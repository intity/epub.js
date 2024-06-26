import EventEmitter from "event-emitter";
import { extend } from "./utils/core";
import Defer from "./utils/defer";
import Url from "./utils/url";
import Path from "./utils/path";
import Locations from "./locations";
import Container from "./container";
import Packaging from "./packaging";
import Navigation from "./navigation";
import Resources from "./resources";
import PageList from "./pagelist";
import Rendition from "./rendition";
import Archive from "./archive";
import request from "./utils/request";
import EpubCFI from "./epubcfi";
import Storage from "./storage";
import { EPUBJS_VERSION, EVENTS } from "./utils/constants";
import Sections from "./sections";

const CONTAINER_PATH = "META-INF/container.xml";
const INPUT_TYPE = {
	BINARY: "binary",
	BASE64: "base64",
	EPUB: "epub",
	OPF: "opf",
	MANIFEST: "json",
	DIRECTORY: "directory"
};

/**
 * An Epub representation with methods for the loading, parsing and manipulation
 * of its contents.
 * @class
 * @param {string} [url]
 * @param {object} [options]
 * @param {object} [options.request] object options to xhr request
 * @param {method} [options.request.method=null] a request function to use instead of the default
 * @param {boolean} [options.request.withCredentials=false] send the xhr request withCredentials
 * @param {object} [options.request.headers=[]] send the xhr request headers
 * @param {string} [options.encoding='binary'] optional to pass 'binary' or 'base64' for archived Epubs
 * @param {string} [options.replacements=null] use base64, blobUrl, or none for replacing assets in archived Epubs
 * @param {method} [options.canonical] optional function to determine canonical urls for a path
 * @param {string} [options.openAs] optional string to determine the input type
 * @param {string} [options.store] cache the contents in local storage, value should be the name of the reader
 * @returns {Book}
 * @example new Book("/path/to/book.epub", {})
 * @example new Book({ replacements: "blobUrl" })
 */
class Book {
	constructor(url, options) {
		// Allow passing just options to the Book
		if (typeof (options) === "undefined" &&
			typeof (url) !== "string" &&
			url instanceof Blob === false &&
			url instanceof ArrayBuffer === false) {
			options = url;
			url = undefined;
		}

		this.settings = extend({
			request: {
				method: null,
				withCredentials: false,
				headers: []
			},
			encoding: undefined,
			replacements: null,
			canonical: undefined,
			openAs: undefined,
			store: undefined
		}, options || {});

		this.opening = new Defer(); // Promises
		/**
		 * @member {promise} opened returns after the book is loaded
		 * @memberof Book
		 * @readonly
		 */
		this.opened = this.opening.promise;
		/**
		 * @member {boolean} isOpen
		 * @memberof Book
		 * @readonly
		 */
		this.isOpen = false;

		this.loading = {
			cover: new Defer(),
			spine: new Defer(),
			manifest: new Defer(),
			metadata: new Defer(),
			pageList: new Defer(),
			resources: new Defer(),
			navigation: new Defer()
		};

		this.loaded = {
			cover: this.loading.cover.promise,
			spine: this.loading.spine.promise,
			manifest: this.loading.manifest.promise,
			metadata: this.loading.metadata.promise,
			pageList: this.loading.pageList.promise,
			resources: this.loading.resources.promise,
			navigation: this.loading.navigation.promise
		};
		/**
		 * @member {promise} ready returns after the book is loaded and parsed
		 * @memberof Book
		 * @readonly
		 */
		this.ready = Promise.all([
			this.loaded.manifest,
			this.loaded.spine,
			this.loaded.metadata,
			this.loaded.cover,
			this.loaded.navigation,
			this.loaded.resources
		]);
		/**
		 * Queue for methods used before opening
		 * @member {boolean} isRendered
		 * @memberof Book
		 * @readonly
		 */
		this.isRendered = false;
		/**
		 * @member {method} request
		 * @memberof Book
		 * @readonly
		 */
		this.request = this.settings.request.method || request;
		/**
		 * @member {Navigation} navigation
		 * @memberof Book
		 * @readonly
		 */
		this.navigation = undefined;
		/**
		 * @member {PageList} pagelist
		 * @memberof Book
		 * @readonly
		 */
		this.pageList = undefined;
		/**
		 * @member {Url} url
		 * @memberof Book
		 * @readonly
		 */
		this.url = undefined;
		/**
		 * @member {Path} path
		 * @memberof Book
		 * @readonly
		 */
		this.path = undefined;
		/**
		 * @member {boolean} archived
		 * @memberof Book
		 * @readonly
		 */
		this.archived = false;
		/**
		 * @member {Archive} archive
		 * @memberof Book
		 * @private
		 */
		this.archive = undefined;
		/**
		 * @member {Storage} storage
		 * @memberof Book
		 * @readonly
		 */
		this.storage = undefined;
		/**
		 * @member {Resources} resources
		 * @memberof Book
		 * @readonly
		 */
		this.resources = undefined;
		/**
		 * @member {Rendition} rendition
		 * @memberof Book
		 * @readonly
		 */
		this.rendition = undefined;
		/**
		 * @member {Container} container
		 * @memberof Book
		 * @readonly
		 */
		this.container = undefined;
		/**
		 * @member {Packaging} packaging
		 * @memberof Book
		 * @readonly
		 */
		this.packaging = new Packaging();
		/**
		 * @member {Sections} sections
		 * @memberof Book
		 * @readonly
		 */
		this.sections = new Sections();
		/**
		 * @member {Locations} locations
		 * @memberof Book
		 * @readonly
		 */
		this.locations = new Locations(
			this.sections,
			this.load.bind(this)
		);

		// this.toc = undefined;
		if (this.settings.store) {
			this.store(this.settings.store);
		}

		if (url) {
			this.open(url, this.settings.openAs).catch((error) => {
				/**
				 * @event openFailed
				 * @param {object} error
				 * @memberof Book
				 */
				this.emit(EVENTS.BOOK.OPEN_FAILED, error);
			});
		}
	}

	/**
	 * Open a epub or url
	 * @param {string|ArrayBuffer} input Url, Path or ArrayBuffer
	 * @param {string} [what='binary', 'base64', 'epub', 'opf', 'json', 'directory'] force opening as a certain type
	 * @returns {Promise} of when the book has been loaded
	 * @example book.open("/path/to/book/")
	 * @example book.open("/path/to/book/OPS/package.opf")
	 * @example book.open("/path/to/book.epub")
	 * @example book.open("https://example.com/book/")
	 * @example book.open("https://example.com/book/OPS/package.opf")
	 * @example book.open("https://example.com/book.epub")
	 */
	open(input, what) {

		let opening;
		const type = what || this.determineType(input);

		if (type === INPUT_TYPE.BINARY) {
			this.archived = true;
			this.url = new Url("/", "");
			opening = this.openEpub(input);
		} else if (type === INPUT_TYPE.BASE64) {
			this.archived = true;
			this.url = new Url("/", "");
			opening = this.openEpub(input, type);
		} else if (type === INPUT_TYPE.EPUB) {
			this.archived = true;
			this.url = new Url("/", "");
			opening = this.request(input, "binary",
				this.settings.request.withCredentials,
				this.settings.request.headers
			).then(this.openEpub.bind(this));
		} else if (type == INPUT_TYPE.OPF) {
			this.url = new Url(input);
			opening = this.openPackaging(this.url.path.toString());
		} else if (type == INPUT_TYPE.MANIFEST) {
			this.url = new Url(input);
			opening = this.openManifest(this.url.path.toString());
		} else {
			this.url = new Url(input);
			opening = this.openContainer(CONTAINER_PATH)
				.then(this.openPackaging.bind(this));
		}

		return opening;
	}

	/**
	 * Open an archived epub
	 * @param {binary} data
	 * @param {string} [encoding]
	 * @returns {Promise}
	 * @private
	 */
	async openEpub(data, encoding) {

		encoding = encoding || this.settings.encoding;
		
		return this.unarchive(data, encoding).then(() => {
			return this.openContainer(CONTAINER_PATH);
		}).then((packagePath) => {
			return this.openPackaging(packagePath);
		});
	}

	/**
	 * Open the epub container
	 * @param {string} url
	 * @returns {Promise}
	 * @private
	 */
	async openContainer(url) {

		return this.load(url).then((xml) => {
			this.container = new Container(xml);
			return this.resolve(this.container.fullPath);
		});
	}

	/**
	 * Open the Open Packaging Format Xml
	 * @param {string} url
	 * @returns {Promise}
	 * @private
	 */
	async openPackaging(url) {

		this.path = new Path(url);
		return this.load(url).then((xml) => {
			this.packaging.parse(xml);
			return this.unpack();
		});
	}

	/**
	 * Open the manifest JSON
	 * @param {string} url
	 * @returns {Promise}
	 * @private
	 */
	async openManifest(url) {

		this.path = new Path(url);
		return this.load(url).then((json) => {
			this.packaging.load(json);
			return this.unpack();
		});
	}

	/**
	 * Load a resource from the Book
	 * @param {string} path path to the resource to load
	 * @returns {Promise} returns a promise with the requested resource
	 */
	load(path) {

		const resolved = this.resolve(path);

		if (this.archived) {
			return this.archive.request(resolved);
		} else {
			return this.request(resolved, null,
				this.settings.request.withCredentials,
				this.settings.request.headers);
		}
	}

	/**
	 * Resolve a path to it's absolute position in the Book
	 * @param {string} path
	 * @param {boolean} [absolute=false] force resolving the full URL
	 * @returns {string} the resolved path string
	 */
	resolve(path, absolute = false) {

		if (!path) return;

		if (path.indexOf("://") > -1) {
			return path; // is absolute
		}

		let resolved = path;
		if (this.path) {
			resolved = this.path.resolve(this.path.directory, path);
		}

		if (absolute === false && this.url) {
			resolved = this.url.resolve(resolved);
		}

		return resolved;
	}

	/**
	 * Get a canonical link to a path
	 * @param {string} path
	 * @returns {string} the canonical path string
	 */
	canonical(path) {

		if (!path) return "";

		let url;
		if (this.settings.canonical) {
			url = this.settings.canonical(path);
		} else {
			url = this.resolve(path, true);
		}

		return url;
	}

	/**
	 * Determine the type of they input passed to open
	 * @param {string} input
	 * @returns {string} values: `"binary"` OR `"directory"` OR `"epub"` OR `"opf"`
	 * @private
	 */
	determineType(input) {

		if (this.settings.encoding === "base64") {
			return INPUT_TYPE.BASE64;
		}

		if (typeof (input) !== "string") {
			return INPUT_TYPE.BINARY;
		}

		const path = new Url(input).path;

		let extension = path.extension;
		// If there's a search string, remove it before determining type
		if (extension) {
			extension = extension.replace(/\?.*$/, "");
		}

		if (!extension) {
			return INPUT_TYPE.DIRECTORY;
		}

		if (extension === "epub") {
			return INPUT_TYPE.EPUB;
		}

		if (extension === "opf") {
			return INPUT_TYPE.OPF;
		}

		if (extension === "json") {
			return INPUT_TYPE.MANIFEST;
		}
	}

	/**
	 * Unpack the contents of the book packaging
	 * @private
	 */
	async unpack() {

		this.sections.unpack(
			this.packaging,
			this.resolve.bind(this),
			this.canonical.bind(this)
		);

		this.resources = new Resources(this.packaging.manifest, {
			archive: this.archive,
			request: this.request.bind(this),
			resolve: this.resolve.bind(this),
			replacements: this.get_replacements_cfg()
		});

		this.loadNavigation(this.packaging).then(() => {
			// this.toc = this.navigation.toc;
			this.loading.navigation.resolve(this.navigation);
		});

		if (this.packaging.manifest.coverPath) {
			this.cover = this.resolve(this.packaging.manifest.coverPath);
		}
		// Resolve promises
		this.loading.manifest.resolve(this.packaging.manifest);
		this.loading.metadata.resolve(this.packaging.metadata);
		this.loading.spine.resolve(this.packaging.spine);
		this.loading.cover.resolve(this.cover);
		this.loading.resources.resolve(this.resources);
		this.loading.pageList.resolve(this.pageList);

		this.isOpen = true;

		if (this.archived ||
			this.settings.replacements &&
			this.settings.replacements !== null) {
			this.replacements().then(() => {
				this.opening.resolve(this);
			}).catch((err) => console.error(err.message));
		} else {
			this.opening.resolve(this);
		}
	}

	/**
	 * Load Navigation and PageList from package
	 * @param {Packaging} packaging
	 * @returns {Promise}
	 * @private
	 */
	async loadNavigation(packaging) {

		const navPath = packaging.manifest.navPath;
		const toc = packaging.toc;

		// From json manifest
		if (toc) {
			return new Promise((resolve, reject) => {
				this.navigation = new Navigation(toc);

				if (packaging.pageList) {
					this.pageList = new PageList(packaging.pageList); // TODO: handle page lists from Manifest
				}

				resolve(this.navigation);
			});
		}

		if (!navPath) {
			return new Promise((resolve, reject) => {
				this.navigation = new Navigation();
				this.pageList = new PageList();

				resolve(this.navigation);
			});
		}

		return this.load(navPath, "xml").then((xml) => {
			this.navigation = new Navigation(xml);
			this.pageList = new PageList(xml);
			return this.navigation;
		});
	}

	/**
	 * Gets a Section of the Book from the Spine
	 * Alias for `book.sections.get`
	 * @param {string|number} [target]
	 * @returns {Section|null}
	 * @example book.section()
	 * @example book.section(1)
	 * @example book.section("chapter.html")
	 * @example book.section("#id1234")
	 */
	section(target) {

		return this.sections.get(target);
	}

	/**
	 * Sugar to render a book to an element
	 * @param {Element|string} element element or string to add a rendition to
	 * @param {object} [options]
	 * @returns {Rendition}
	 */
	renderTo(element, options) {

		const method = "blobUrl";

		if (this.settings.replacements === method) {
			options = extend({ method }, options || {})
		}
		this.rendition = new Rendition(this, options);
		this.rendition.attachTo(element);

		return this.rendition;
	}

	/**
	 * Set if request should use withCredentials
	 * @param {boolean} credentials
	 */
	setRequestCredentials(credentials) {

		this.settings.request.withCredentials = credentials;
	}

	/**
	 * Set headers request should use
	 * @param {object} headers
	 */
	setRequestHeaders(headers) {

		this.settings.request.headers = headers;
	}

	/**
	 * Unarchive a zipped epub
	 * @param {binary} input epub data
	 * @param {string} [encoding]
	 * @returns {Archive}
	 * @private
	 */
	unarchive(input, encoding) {

		this.archive = new Archive();
		return this.archive.open(input, encoding);
	}

	/**
	 * Storage the epubs contents
	 * @param {binary} input epub data
	 * @returns {Storage}
	 * @private
	 */
	store(input) {

		// Create new Storage
		this.storage = new Storage(input,
			this.request.bind(this),
			this.resolve.bind(this)
		);
		// Replace request method to go through store
		this.request = this.storage.dispatch.bind(this.storage);

		this.opened.then(() => {
			
			if (this.archived) {
				this.storage.request = this.archive.request.bind(this.archive);
			}
			// Substitute hook
			const substituteResources = (output, section) => {
				section.output = this.resources.substitute(output, section.url);
			};

			// Use "blobUrl" or "base64" for replacements
			this.resources.settings.replacements = this.get_replacements_cfg();

			// Create replacement urls
			this.resources.replacements().then(() => {
				return this.resources.replaceCss();
			});

			let originalUrl = this.url; // Save original url

			this.storage.on("online", () => {
				// Restore original url
				this.url = originalUrl;
				// Remove hook
				this.sections.hooks.serialize.deregister(substituteResources);
			});

			this.storage.on("offline", () => {
				// Remove url to use relative resolving for hrefs
				this.url = new Url("/", "");
				// Add hook to replace resources in contents
				this.sections.hooks.serialize.register(substituteResources);
			});
		});

		return this.storage;
	}

	/**
	 * Get the cover url
	 * @returns {Promise<?string>} coverUrl
	 */
	async coverUrl() {

		return this.loaded.cover.then(() => {

			if (!this.cover) {
				return null;
			}

			if (this.archived) {
				return this.archive.createUrl(this.cover);
			} else {
				return this.cover;
			}
		});
	}

	/**
	 * Load replacement urls
	 * @returns {Promise} completed loading urls
	 * @private
	 */
	async replacements() {

		this.sections.hooks.serialize.register((output, section) => {
			section.output = this.resources.substitute(output, section.url);
		});

		return this.resources.replacements().then(() => {
			return this.resources.replaceCss();
		});
	}

	/**
	 * Get replacements setting
	 * @returns {string}
	 * @private
	 */
	get_replacements_cfg() {

		let replacements = this.settings.replacements;
		if (replacements === null) {
			replacements = this.archived ? "blobUrl" : "base64";
		} else if (replacements === "base64") {
			replacements = this.archived ? "base64" : null;
		}
		return replacements;
	}

	/**
	 * Find a DOM Range for a given CFI Range
	 * @param {EpubCFI} cfiRange a epub cfi range
	 * @returns {Promise}
	 */
	async getRange(cfiRange) {

		const cfi = new EpubCFI(cfiRange);
		const item = this.sections.get(cfi.spinePos);
		const request = this.load.bind(this);
		if (!item) {
			return new Promise((resolve, reject) => {
				reject(new Error("CFI could not be found"));
			});
		}
		return item.load(request).then((contents) => {
			const range = cfi.toRange(item.document);
			return range;
		});
	}

	/**
	 * Generates the Book Key using the identifier in the manifest or other string provided
	 * @param {string} [identifier] to use instead of metadata identifier
	 * @returns {string} key
	 */
	key(identifier) {

		const ident = identifier ||
			this.packaging.metadata.get("identifier") ||
			this.url.filename;
		return `epubjs:${EPUBJS_VERSION}:${ident}`;
	}

	/**
	 * Destroy the Book and all associated objects
	 */
	destroy() {

		this.opened = undefined;
		this.loading = undefined;
		this.loaded = undefined;
		this.ready = undefined;

		this.isOpen = false;
		this.isRendered = false;

		this.locations && this.locations.destroy();
		this.pageList && this.pageList.destroy();
		this.archive && this.archive.destroy();
		this.resources && this.resources.destroy();
		this.container && this.container.destroy();
		this.packaging && this.packaging.destroy();
		this.rendition && this.rendition.destroy();

		this.locations = undefined;
		this.pageList = undefined;
		this.archive = undefined;
		this.resources = undefined;
		this.container = undefined;
		this.packaging = undefined;
		this.rendition = undefined;

		this.navigation = undefined;
		this.url = undefined;
		this.path = undefined;
		this.archived = false;
	}
}

EventEmitter(Book.prototype);

export default Book;