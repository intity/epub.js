import { isXml, parse } from "./utils/core";
import Defer from "./utils/defer";
import request from "./utils/request";
import mime from "./utils/mime";
import Path from "./utils/path";
import JSZip from "jszip/dist/jszip";

/**
 * Handles Unzipping a requesting files from an Epub Archive
 */
class Archive {

	constructor() {

		this.zip = undefined;
		this.urlCache = {};
		this.checkRequirements();
	}

	/**
	 * Checks to see if JSZip exists in global namspace,
	 * Requires JSZip if it isn't there
	 * @private
	 */
	checkRequirements() {

		if (JSZip) {
			this.zip = new JSZip();
		} else {
			throw new Error("JSZip lib not loaded");
		}
	}

	/**
	 * Open an archive
	 * @param {binary} input
	 * @param {boolean} [isBase64] tells JSZip if the input data is base64 encoded
	 * @return {Promise} zipfile
	 */
	open(input, isBase64) {

		return this.zip.loadAsync(input, {
			base64: isBase64
		});
	}

	/**
	 * Load and Open an archive
	 * @param {string} zipUrl
	 * @param {boolean} [isBase64] tells JSZip if the input data is base64 encoded
	 * @return {Promise} zipfile
	 */
	async openUrl(zipUrl, isBase64) {

		return request(zipUrl, "binary").then((data) => {
			return this.zip.loadAsync(data, {
				base64: isBase64
			});
		});
	}

	/**
	 * Request a url from the archive
	 * @param {string} url  a url to request from the archive
	 * @param {string} [type] specify the type of the returned result
	 * @return {Promise<Blob|string|JSON|Document|XMLDocument>}
	 */
	request(url, type) {

		const deferred = new Defer();
		const path = new Path(url);

		// If type isn't set, determine it from the file extension
		if (!type) {
			type = path.extension;
		}

		let response;
		if (type == "blob") {
			response = this.getBlob(url);
		} else {
			response = this.getText(url);
		}

		if (response) {
			response.then((r) => {
				const result = this.handleResponse(r, type);
				deferred.resolve(result);
			});
		} else {
			deferred.reject({
				message: "File not found in the epub: " + url,
				stack: new Error().stack
			});
		}
		return deferred.promise;
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
		} else if (type == "html" || type == "htm") {
			r = parse(response, "text/html");
		} else if (type === "json") {
			r = JSON.parse(response);
		} else {
			r = response;
		}
		return r;
	}

	/**
	 * Get a Blob from Archive by Url
	 * @param {string} url
	 * @param {string} [mimeType]
	 * @return {Blob}
	 */
	getBlob(url, mimeType) {

		const encodedUri = url.substring(1); // Remove first slash
		const decodededUri = window.decodeURIComponent(encodedUri);
		const entry = this.zip.file(decodededUri);

		if (entry) {
			mimeType = mimeType || mime.lookup(entry.name);
			return entry.async("uint8array").then((uint8array) => {
				return new Blob([uint8array], { type: mimeType });
			});
		}
	}

	/**
	 * Get Text from Archive by Url
	 * @param {string} url
	 * @return {string}
	 */
	getText(url) {

		const encodedUri = url.substring(1); // Remove first slash
		const decodededUri = window.decodeURIComponent(encodedUri);
		const entry = this.zip.file(decodededUri);

		if (entry) {
			return entry.async("string").then((text) => {
				return text;
			});
		}
	}

	/**
	 * Get a base64 encoded result from Archive by Url
	 * @param {string} url
	 * @param {string} [mimeType]
	 * @return {string} base64 encoded
	 */
	getBase64(url, mimeType) {

		const encodedUri = url.substring(1); // Remove first slash
		const decodededUri = window.decodeURIComponent(encodedUri);
		const entry = this.zip.file(decodededUri);

		if (entry) {
			mimeType = mimeType || mime.lookup(entry.name);
			return entry.async("base64").then((data) => {
				return "data:" + mimeType + ";base64," + data;
			});
		}
	}

	/**
	 * Create a Url from an unarchived item
	 * @param {string} url
	 * @param {object} [options] 
	 * @param {object} [options.base64] use base64 encoding or blob url
	 * @return {Promise} url promise with Url string
	 */
	createUrl(url, options) {

		const deferred = new Defer();
		const _URL = window.URL || window.webkitURL || window.mozURL;
		const base64 = options && options.base64;

		if (url in this.urlCache) {
			deferred.resolve(this.urlCache[url]);
			return deferred.promise;
		}

		let response;
		if (base64 && (response = this.getBase64(url))) {
			response.then((tempUrl) => {

				this.urlCache[url] = tempUrl;
				deferred.resolve(tempUrl);

			});
		} else if (response = this.getBlob(url)) {
			response.then((blob) => {

				const tempUrl = _URL.createObjectURL(blob);
				this.urlCache[url] = tempUrl;
				deferred.resolve(tempUrl);

			});
		}

		if (typeof response === "undefined") {
			deferred.reject({
				message: "File not found in the epub: " + url,
				stack: new Error().stack
			});
		}

		return deferred.promise;
	}

	/**
	 * Revoke Temp Url for a archive item
	 * @param {string} url url of the item in the archive
	 */
	revokeUrl(url) {

		const _URL = window.URL || window.webkitURL || window.mozURL;
		const fromCache = this.urlCache[url];
		if (fromCache) _URL.revokeObjectURL(fromCache);
	}

	/**
	 * destroy
	 */
	destroy() {

		const _URL = window.URL || window.webkitURL || window.mozURL;
		for (const fromCache in this.urlCache) {
			_URL.revokeObjectURL(fromCache);
		}
		this.zip = undefined;
		this.urlCache = {};
	}
}

export default Archive;