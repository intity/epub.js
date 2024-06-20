import Path from "./path";

/**
 * Creates a Url object for parsing and manipulation of a url string
 */
class Url {
	/**
	 * Constructor
	 * @param {string} url a url string (relative or absolute)
	 * @param {string} [base] optional base for the url, default to window.location.href
	 */
	constructor(url, base) {

		this.Url = undefined;
		this.href = url;
		this.protocol = "";
		this.origin = "";
		this.hash = "";
		this.hash = "";
		this.search = "";
		this.base = base;

		const absolute = (url.indexOf("://") > -1);
		
		if (!absolute &&
			base !== false &&
			typeof (base) !== "string" &&
			window && window.location) {
			this.base = window.location.href;
		}

		let pathname = url;
		// URL Polyfill doesn't throw an error if base is empty
		if (absolute || this.base) {
			try {
				if (this.base) { // Safari doesn't like an undefined base
					this.Url = new URL(url, this.base);
				} else {
					this.Url = new URL(url);
				}
				this.href = this.Url.href;
				this.protocol = this.Url.protocol;
				this.origin = this.Url.origin;
				this.hash = this.Url.hash;
				this.search = this.Url.search;

				pathname = this.Url.pathname + (this.Url.search ? this.Url.search : "");
			} catch (e) {
				// Skip URL parsing
				this.Url = undefined;
				// resolve the pathname from the base
				if (this.base) {
					const basePath = new Path(this.base);
					pathname = basePath.resolve(pathname);
				}
				console.error(e);
			}
			// override URL.origin property for Firefox browser
			if (this.origin === "null" && this.protocol === "file:") {
				this.origin = "file://";
			}
		}
		/**
		 * @member {Path} path
		 * @memberof Url
		 * @readonly
		 */
		this.path = new Path(pathname);
		this.directory = this.path.directory;
		this.filename = this.path.filename;
		this.extension = this.path.extension;
	}

	/**
	 * Resolves a relative path to a absolute url
	 * @param {string} path
	 * @returns {string} url
	 */
	resolve(path) {

		if (path.indexOf("://") > -1) { // is absolute
			return path;
		}

		const dir = this.path.directory;
		const fullpath = Path.prototype.resolve(dir, path);
		return this.origin + fullpath;
	}

	/**
	 * Resolve a path relative to the url
	 * @param {string} path
	 * @returns {string} path
	 */
	relative(path) {

		const dir = this.path.directory;
		return Path.prototype.relative(path, dir);
	}

	/**
	 * toString
	 * @returns {string}
	 */
	toString() {

		return this.href;
	}
}

export default Url;