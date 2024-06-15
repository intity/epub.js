import { substitute } from "./utils/replacements";
import { createBase64Url, createBlobUrl, blob2base64 } from "./utils/core";
import Url from "./utils/url";
import mime from "./utils/mime";
import Path from "./utils/path";

/**
 * Handle Package Resources
 */
class Resources {
	/**
	 * Constructor
	 * @param {Manifest} manifest
	 * @param {object} [options]
	 * @param {Archive} [options.archive]
	 * @param {method} [options.request]
	 * @param {method} [options.resolve]
	 * @param {string} [options.replacements='base64']
	 */
	constructor(manifest, { archive, request, resolve, replacements }) {

		this.settings = {
			replacements: replacements || "base64",
		};

		this.archive = archive;
		this.request = request;
		this.resolve = resolve;
		this.process(manifest);
	}

	/**
	 * Process resources
	 * @param {Manifest} manifest
	 */
	process(manifest) {

		this.css = [];
		this.html = [];
		this.assets = [];
		this.urls = [];
		this.replacementUrls = [];
		
		manifest.forEach((item, key) => {
			if (item.type === "application/xhtml+xml" ||
				item.type === "text/html") {
				this.html.push(item);
			} else {
				if (item.type === "text/css") {
					this.css.push(item);
				}
				this.assets.push(item);
				this.urls.push(item.href);
			}
		});
	}

	/**
	 * Create a url to a resource
	 * @param {string} url
	 * @return {Promise<string>} Promise resolves with url string
	 */
	async createUrl(url) {

		const parsedUrl = new Url(url);
		const mimeType = mime.lookup(parsedUrl.filename);
		const base64 = this.settings.replacements === "base64";

		if (this.archive) {
			return this.archive.createUrl(url, {
				base64: base64
			});
		} else if (base64) {
			return this.request(url, "blob").then((blob) => {
				return blob2base64(blob);
			}).then((blob) => {
				return createBase64Url(blob, mimeType);
			});
		} else {
			return this.request(url, "blob").then((blob) => {
				return createBlobUrl(blob, mimeType);
			});
		}
	}

	/**
	 * Create blob urls for all the assets
	 * @return {Promise} returns replacement urls
	 */
	async replacements() {

		if (this.settings.replacements === "none") {
			return new Promise((resolve) => {
				resolve(this.urls);
			});
		}

		const replacements = this.replaceUrls();

		return Promise.all(replacements).then((urls) => {
			this.replacementUrls = urls.filter((url) => {
				return (typeof (url) === "string");
			});
			return urls;
		});
	}

	/**
	 * Replace URLs
	 * @param {string} absoluteUri 
	 * @returns {Promise[]} replacements
	 * @private
	 */
	replaceUrls() {

		return this.urls.map(async (url) => {
			const absolute = this.resolve(url);
			return this.createUrl(absolute).catch((err) => {
				console.error(err);
				return null;
			});
		});
	}

	/**
	 * Replace URLs in CSS resources
	 * @param {Archive} [archive]
	 * @param {method} [resolve]
	 * @return {Promise}
	 */
	replaceCss(archive, resolve) {

		const replaced = [];
		archive = archive || this.archive;
		resolve = resolve || this.resolve;
		this.css.forEach((item) => {
			const replacement = this.createCssFile(
				item.href,
				archive,
				resolve
			).then((url) => {
				// switch the url in the replacementUrls
				const index = this.urls.indexOf(item.href);
				if (index > -1) {
					this.replacementUrls[index] = url;
				}
			});
			replaced.push(replacement);
		});

		return Promise.all(replaced);
	}

	/**
	 * Create a new CSS file with the replaced URLs
	 * @param {string} href the original css file
	 * @return {Promise} returns a BlobUrl to the new CSS file or a data url
	 * @private
	 */
	createCssFile(href) {

		let path = new Path(href);
		if (path.isAbsolute(path.toString())) {
			return new Promise((resolve) => {
				resolve();
			});
		}

		const absoluteUri = this.resolve(href);

		// Get the text of the css file from the archive
		let textResponse;
		if (this.archive) {
			textResponse = this.archive.getText(absoluteUri);
		} else {
			textResponse = this.request(absoluteUri, "text");
		}

		if (!textResponse) {
			// file not found, don't replace
			return new Promise((resolve) => {
				resolve();
			});
		}

		// Get asset links relative to css file
		const urls = this.relativeTo(absoluteUri);

		return textResponse.then((text) => {
			// Replacements in the css text
			text = substitute(text, urls, this.replacementUrls);

			let newUrl;
			if (this.settings.replacements === "base64") {
				newUrl = createBase64Url(text, "text/css");
			} else {
				newUrl = createBlobUrl(text, "text/css");
			}

			return newUrl;
		}, (err) => {
			console.error(err);
			// handle response errors
			return new Promise((resolve) => {
				resolve();
			});
		});
	}

	/**
	 * Resolve all resources URLs relative to an absolute URL
	 * @param {string} absoluteUri to be resolved to
	 * @param {method} [resolve]
	 * @return {string[]} array with relative Urls
	 */
	relativeTo(absoluteUri, resolve) {

		resolve = resolve || this.resolve;

		// Get Urls relative to current sections
		return this.urls.map((href) => {
			const resolved = resolve(href);
			const path = new Path(absoluteUri);
			return path.relative(path.directory, resolved);
		});
	}

	/**
	 * Get a URL for a resource
	 * @param {string} path
	 * @return {string|null} url
	 */
	get(path) {

		const index = this.urls.indexOf(path);

		if (index === -1) {
			return null;
		} else if (this.replacementUrls.length) {
			return new Promise((resolve, reject) => {
				resolve(this.replacementUrls[index]);
			});
		} else {
			return this.createUrl(path);
		}
	}

	/**
	 * Substitute urls in content, with replacements,
	 * relative to a url if provided
	 * @param {string} content
	 * @param {string} [url] url to resolve to
	 * @return {string} content with urls substituted
	 */
	substitute(content, url) {

		let relUrls;
		if (url) {
			relUrls = this.relativeTo(url);
		} else {
			relUrls = this.urls;
		}
		return substitute(content, relUrls, this.replacementUrls);
	}

	/**
	 * destroy
	 */
	destroy() {

		this.settings = undefined;
		this.replacementUrls = undefined;
		this.html = undefined;
		this.assets = undefined;
		this.css = undefined;
		this.urls = undefined;
	}
}

export default Resources;