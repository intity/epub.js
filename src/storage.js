import { isXml, parse } from "./utils/core";
import Defer from "./utils/defer";
import mime from "./utils/mime";
import Path from "./utils/path";
import EventEmitter from "event-emitter";
import localforage from "localforage";

const _URL = window.URL || window.webkitURL || window.mozURL;

/**
 * Handles saving and requesting files from local storage
 */
class Storage {
	/**
	 * Constructor
	 * @param {string} name This should be the name of the application for modals
	 * @param {method} request
	 * @param {method} resolve
	 */
	constructor(name, request, resolve) {

		this.name = name;
		this.request = request;
		this.resolve = resolve;
		/**
		 * @member {LocalForage} instance
		 * @memberof Storage
		 * @readonly
		 */
		this.instance = undefined;
		/**
		 * @member {object} urlCache
		 * @memberof Storage
		 * @readonly
		 */
		this.urlCache = {};
		/**
		 * @member {boolean} online Current status
		 * @memberof Storage
		 * @readonly
		 */
		this.online = true;

		this.checkRequirements();
		this.appendListeners();
	}

	/**
	 * Checks to see if LocalForage exists in global namspace
	 * @private
	 */
	checkRequirements() {

		if (localforage) {
			this.instance = localforage.createInstance({
				name: this.name
			});
		} else {
			throw new TypeError("LocalForage lib not loaded");
		}
	}

	/**
	 * Append online and offline event listeners
	 * @private
	 */
	appendListeners() {

		window.addEventListener("online", this.status.bind(this));
		window.addEventListener("offline", this.status.bind(this));
	}

	/**
	 * Remove online and offline event listeners
	 * @private
	 */
	removeListeners() {

		window.removeEventListener("online", this.status.bind(this));
		window.removeEventListener("offline", this.status.bind(this));
	}

	/**
	 * Update the online / offline status
	 * @param {Event} event 
	 * @private
	 */
	status(event) {

		this.online = event.type === "online";

		if (this.online) {
			this.emit("online");
		} else {
			this.emit("offline");
		}
	}

	/**
	 * Add all of a book manifest to the storage
	 * @param {Manifest} manifest  book manifest
	 * @param {boolean} [force=false] force resaving manifest
	 * @return {Promise<object>} store objects
	 */
	add(manifest, force = false) {

		const items = manifest.values().toArray();
		const mapped = items.map(async (item) => {

			const { href } = item;
			const url = this.resolve(href);
			const encodedUrl = window.encodeURIComponent(url);

			return await this.instance.getItem(encodedUrl).then((item) => {
				if (!item || force) {
					return this.request(url, "binary").then((data) => {
						return this.instance.setItem(encodedUrl, data);
					});
				} else {
					return item;
				}
			});
		});
		return Promise.all(mapped);
	}

	/**
	 * Put binary data from a url to storage
	 * @param {string} url  a url to request from storage
	 * @param {boolean} [withCredentials]
	 * @param {object} [headers]
	 * @return {Promise<Blob>}
	 */
	async put(url, withCredentials, headers) {

		const encodedUrl = window.encodeURIComponent(url);

		return await this.instance.getItem(encodedUrl).then((result) => {
			if (!result) {
				return this.request(url, "binary", withCredentials, headers).then((data) => {
					return this.instance.setItem(encodedUrl, data);
				});
			}
			return result;
		});
	}

	/**
	 * Dispatch request by url
	 * @param {string} url a url to request from storage
	 * @param {string} [type] specify the type of the returned result
	 * @param {boolean} [withCredentials]
	 * @param {Array} [headers]
	 * @return {Promise<Blob|string|JSON|Document|XMLDocument>}
	 */
	async dispatch(url, type, withCredentials, headers) {

		if (this.online) {
			// From network
			return this.request(url, type, withCredentials, headers).then(async (data) => {
				// save to store if not present
				await this.put(url);
				return data;
			});
		} else {
			// From storage
			return this.retrieve(url, type);
		}
	}

	/**
	 * Request a url from storage
	 * @param {string} url a url to request from storage
	 * @param {string} [type] specify the type of the returned result
	 * @return {Promise<Blob|string|JSON|Document|XMLDocument>}
	 */
	async retrieve(url, type) {

		const path = new Path(url);

		// If type isn't set, determine it from the file extension
		if (!type) {
			type = path.extension;
		}

		let response;
		if (type === "blob") {
			response = this.getBlob(url);
		} else {
			response = this.getText(url);
		}

		return response.then((r) => {
			const deferred = new Defer();
			if (r) {
				const result = this.handleResponse(r, type);
				deferred.resolve(result);
			} else {
				deferred.reject({
					message: "File not found in storage: " + url,
					stack: new Error().stack
				});
			}
			return deferred.promise;
		});
	}

	/**
	 * Handle the response from request
	 * @param {any} response
	 * @param {string} [type]
	 * @return {any} the parsed result
	 * @private
	 */
	handleResponse(response, type) {

		let r;
		if (isXml(type)) {
			r = parse(response, "text/xml");
		} else if (type === "xhtml") {
			r = parse(response, "application/xhtml+xml");
		} else if (type === "html" || type === "htm") {
			r = parse(response, "text/html");
		} else if (type === "json") {
			r = JSON.parse(response);
		} else {
			r = response;
		}
		return r;
	}

	/**
	 * Get a Blob from Storage by Url
	 * @param {string} url
	 * @param {string} [mimeType]
	 * @return {Blob}
	 */
	getBlob(url, mimeType) {

		const encodedUrl = window.encodeURIComponent(url);
		mimeType = mimeType || mime.lookup(url);

		return this.instance.getItem(encodedUrl).then((uint8array) => {
			if (!uint8array) return;
			return new Blob([uint8array], { type: mimeType });
		});
	}

	/**
	 * Get Text from Storage by Url
	 * @param {string} url
	 * @param {string} [mimeType]
	 * @return {string}
	 */
	getText(url, mimeType) {

		const encodedUrl = window.encodeURIComponent(url);
		mimeType = mimeType || mime.lookup(url);

		return this.instance.getItem(encodedUrl).then(function (uint8array) {
			if (!uint8array) return;
			const deferred = new Defer();
			const reader = new FileReader();
			const blob = new Blob([uint8array], { type: mimeType });

			reader.onloadend = () => {
				deferred.resolve(reader.result);
			};
			reader.readAsText(blob, mimeType);
			return deferred.promise;
		});
	}

	/**
	 * Get a base64 encoded result from Storage by Url
	 * @param {string} url
	 * @param {string} [mimeType]
	 * @return {string} base64 encoded
	 */
	getBase64(url, mimeType) {

		let encodedUrl = window.encodeURIComponent(url);
		mimeType = mimeType || mime.lookup(url);

		return this.instance.getItem(encodedUrl).then((uint8array) => {
			if (!uint8array) return;
			const deferred = new Defer();
			const reader = new FileReader();
			const blob = new Blob([uint8array], { type: mimeType });

			reader.onloadend = () => {
				deferred.resolve(reader.result);
			};
			reader.readAsDataURL(blob, mimeType);
			return deferred.promise;
		});
	}

	/**
	 * Create a Url from a stored item
	 * @param {string} url
	 * @param {object} [options.base64] use base64 encoding or blob url
	 * @return {Promise} url promise with Url string
	 */
	createUrl(url, options) {

		const deferred = new Defer();

		if (url in this.urlCache) {
			deferred.resolve(this.urlCache[url]);
			return deferred.promise;
		}

		let response;
		if (options && options.base64) {
			response = this.getBase64(url);

			if (response) {
				response.then((tempUrl) => {

					this.urlCache[url] = tempUrl;
					deferred.resolve(tempUrl);
				});
			}
		} else {
			response = this.getBlob(url);

			if (response) {
				response.then((blob) => {

					const tempUrl = _URL.createObjectURL(blob);
					this.urlCache[url] = tempUrl;
					deferred.resolve(tempUrl);
				});
			}
		}

		if (!response) {
			deferred.reject({
				message: "File not found in storage: " + url,
				stack: new Error().stack
			});
		}

		return deferred.promise;
	}

	/**
	 * Revoke Temp Url for a archive item
	 * @param {string} url url of the item in the store
	 */
	revokeUrl(url) {

		const fromCache = this.urlCache[url];
		if (fromCache) {
			_URL.revokeObjectURL(fromCache);
		}
	}

	/**
	 * destroy
	 */
	destroy() {

		for (const fromCache in this.urlCache) {
			_URL.revokeObjectURL(fromCache);
		}
		this.urlCache = {};
		this.removeListeners();
	}
}

EventEmitter(Storage.prototype);

export default Storage;