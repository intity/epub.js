import EventEmitter from "event-emitter";
import { extend, defer, isFloat } from "./utils/core";
import Hook from "./utils/hook";
import EpubCFI from "./epubcfi";
import Queue from "./utils/queue";
import Layout from "./layout";
// import Mapping from "./mapping";
import Themes from "./themes";
import Contents from "./contents";
import Annotations from "./annotations";
import { EVENTS, DOM_EVENTS } from "./utils/constants";

// Default View Managers
import DefaultViewManager from "./managers/default/index";
import ContinuousViewManager from "./managers/continuous/index";

/**
 * Displays an Epub as a series of Views for each Section.
 * Requires Manager and View class to handle specifics of rendering
 * the section content.
 * @param {Book} book
 * @param {object} [options]
 * @param {number} [options.width]
 * @param {number} [options.height]
 * @param {string} [options.ignoreClass] class for the cfi parser to ignore
 * @param {string|function|object} [options.manager='default'] string values: default / continuous
 * @param {string|function} [options.view='iframe']
 * @param {string} [options.layout] layout to force
 * @param {string} [options.spread] force spread value
 * @param {string} [options.direction] direction `"ltr"` OR `"rtl"`
 * @param {number} [options.minSpreadWidth] overridden by spread: none (never) / both (always)
 * @param {string} [options.stylesheet] url of stylesheet to be injected
 * @param {boolean} [options.resizeOnOrientationChange] false to disable orientation events
 * @param {string} [options.script] url of script to be injected
 * @param {boolean|object} [options.snap=false] use snap scrolling
 * @param {boolean} [options.allowPopups=false] enable opening popup in content
 * @param {boolean} [options.allowScriptedContent=false] enable running scripts in content
 */
class Rendition {
	constructor(book, options) {
		/**
		 * @member {object} settings
		 * @memberof Rendition
		 * @readonly
		 */
		this.settings = extend(this.settings || {}, {
			width: null,
			height: null,
			manager: "default",
			view: "iframe",
			flow: null,
			layout: null,
			spread: null,
			minSpreadWidth: 800,
			script: null,
			snap: false,
			direction: null, // TODO: implement to 'auto' detection
			ignoreClass: "",
			stylesheet: null,
			allowPopups: false,
			allowScriptedContent: false,
			resizeOnOrientationChange: true,
		});

		extend(this.settings, options);

		if (typeof this.settings.manager === "object") {
			this.manager = this.settings.manager;
		}

		this.book = book;
		/**
		 * Adds Hook methods to the Rendition prototype
		 * @member {object} hooks
		 * @property {Hook} hooks.content
		 * @property {Hook} hooks.display
		 * @property {Hook} hooks.layout
		 * @property {Hook} hooks.render
		 * @property {Hook} hooks.show
		 * @property {Hook} hooks.unloaded
		 * @memberof Rendition
		 */
		this.hooks = {
			content: new Hook(this),
			display: new Hook(this),
			layout: new Hook(this),
			render: new Hook(this),
			show: new Hook(this),
			unloaded: new Hook(this)
		}
		this.hooks.content.register(this.handleLinks.bind(this));
		this.hooks.content.register(this.passEvents.bind(this));
		this.hooks.content.register(this.adjustImages.bind(this));

		this.book.spine.hooks.content.register(this.injectIdentifier.bind(this));

		if (this.settings.stylesheet) {
			this.book.spine.hooks.content.register(this.injectStylesheet.bind(this));
		}

		if (this.settings.script) {
			this.book.spine.hooks.content.register(this.injectScript.bind(this));
		}
		/**
		 * @member {Annotations} annotations
		 * @memberof Rendition
		 * @readonly
		 */
		this.annotations = new Annotations(this);
		/**
		 * @member {Themes} themes
		 * @memberof Rendition
		 * @readonly
		 */
		this.themes = new Themes(this);

		this.epubcfi = new EpubCFI();

		this.q = new Queue(this);

		/**
		 * A Rendered Location Range
		 * @typedef location
		 * @type {Object}
		 * @property {object} start
		 * @property {string} start.index
		 * @property {string} start.href
		 * @property {object} start.displayed
		 * @property {number} start.displayed.page
		 * @property {number} start.displayed.total
		 * @property {string} start.cfi EpubCFI string format
		 * @property {number} start.location
		 * @property {number} start.percentage
		 * @property {object} end
		 * @property {string} end.index
		 * @property {string} end.href
		 * @property {object} end.displayed
		 * @property {number} end.displayed.page
		 * @property {number} end.displayed.total
		 * @property {string} end.cfi EpubCFI string format
		 * @property {number} end.location
		 * @property {number} end.percentage
		 * @property {boolean} atStart Location at start position
		 * @property {boolean} atEnd Location at end position
		 * @memberof Rendition
		 */
		this.location = undefined;

		// Hold queue until book is opened
		this.q.enqueue(this.book.opened);

		this.starting = new defer();
		/**
		 * returns after the rendition has started
		 * @member {Promise} started
		 * @memberof Rendition
		 */
		this.started = this.starting.promise;

		// Block the queue until rendering is started
		this.q.enqueue(this.start);
	}

	/**
	 * Set the manager function
	 * @param {function} manager
	 */
	setManager(manager) {

		this.manager = manager;
	}

	/**
	 * Require the manager from passed string, or as a class function
	 * @param  {string|object} manager [description]
	 * @return {any}
	 */
	requireManager(manager) {

		let ret;

		// If manager is a string, try to load from imported managers
		if (typeof manager === "string" && manager === "default") {
			ret = DefaultViewManager;
		} else if (typeof manager === "string" && manager === "continuous") {
			ret = ContinuousViewManager;
		} else {
			// otherwise, assume we were passed a class function
			ret = manager;
		}

		return ret;
	}

	/**
	 * Start the rendering
	 */
	start() {

		const metadata = this.book.package.metadata;
		const prePaginated = metadata.layout === "pre-paginated";
		const fixedLayout = this.book.displayOptions.fixedLayout === "true";

		if (!this.settings.layout && (prePaginated || fixedLayout)) {
			this.settings.layout = "pre-paginated";
		}

		// Parse metadata to get layout props
		const layoutProps = this.determineLayoutProperties(metadata);

		this.layout = new Layout(layoutProps);
		this.layout.on(EVENTS.LAYOUT.UPDATED, (props, changed) => {
			this.emit(EVENTS.RENDITION.LAYOUT, props, changed);
		});

		if (this.manager === undefined) {
			const manager = this.requireManager(this.settings.manager);
			const options = {
				view: this.settings.view,
				ignoreClass: this.settings.ignoreClass,
				allowPopups: this.settings.allowPopups,
				resizeOnOrientationChange: this.settings.resizeOnOrientationChange
			};
			this.manager = new manager(this.book, this.layout, options);
		}

		// Listen for displayed views
		this.manager.on(EVENTS.MANAGERS.ADDED, this.afterDisplayed.bind(this));
		this.manager.on(EVENTS.MANAGERS.REMOVED, this.afterRemoved.bind(this));

		// Listen for resizing
		this.manager.on(EVENTS.MANAGERS.RESIZED, this.onResized.bind(this));

		// Listen for rotation
		this.manager.on(EVENTS.MANAGERS.ORIENTATION_CHANGE, this.onOrientationChange.bind(this));

		// Listen for scroll changes
		this.manager.on(EVENTS.MANAGERS.SCROLLED, this.reportLocation.bind(this));

		/**
		 * Emit that rendering has started
		 * @event started
		 * @memberof Rendition
		 */
		this.emit(EVENTS.RENDITION.STARTED);

		// Start processing queue
		this.starting.resolve();
	}

	/**
	 * Call to attach the container to an element in the dom
	 * Container must be attached before rendering can begin
	 * @param  {Element} element to attach to
	 * @return {Promise}
	 */
	attachTo(element) {

		return this.q.enqueue(() => {

			// Start rendering
			this.manager.render(element, {
				width: this.settings.width,
				height: this.settings.height
			});

			/**
			 * Emit that rendering has attached to an element
			 * @event attached
			 * @memberof Rendition
			 */
			this.emit(EVENTS.RENDITION.ATTACHED);
		})
	}

	/**
	 * Display a point in the book
	 * The request will be added to the rendering Queue,
	 * so it will wait until book is opened, rendering started
	 * and all other rendering tasks have finished to be called.
	 * @param  {string} target Url or EpubCFI
	 * @return {Promise}
	 */
	display(target) {

		if (this.displaying) {
			this.displaying.resolve();
		}
		return this.q.enqueue(this._display, target);
	}

	/**
	 * Tells the manager what to display immediately
	 * @param  {string} target Url or EpubCFI
	 * @return {Promise}
	 * @private
	 */
	_display(target) {

		if (!this.book) return;
		const displaying = new defer();
		const displayed = displaying.promise;
		this.displaying = displaying;

		// Check if this is a book percentage
		if (this.book.locations.length() && isFloat(target)) {
			target = this.book.locations.cfiFromPercentage(parseFloat(target));
		}

		const section = this.book.spine.get(target);

		if (!section) {
			displaying.reject(new Error("No Section Found"));
			return displayed;
		}

		this.manager.display(section, target).then(() => {

			displaying.resolve(section);
			this.displaying = undefined;
			/**
			 * Emit that a section has been displayed
			 * @event displayed
			 * @param {Section} section
			 * @memberof Rendition
			 */
			this.emit(EVENTS.RENDITION.DISPLAYED, section);
			this.reportLocation();
		}, (err) => {
			/**
			 * Emit that has been an error displaying
			 * @event displayError
			 * @param {*} err
			 * @memberof Rendition
			 */
			this.emit(EVENTS.RENDITION.DISPLAY_ERROR, err);
		});

		return displayed;
	}

	/**
	 * Report what section has been displayed
	 * @param {object} view
	 * @private
	 */
	afterDisplayed(view) {

		view.on(EVENTS.VIEWS.MARK_CLICKED, (cfiRange, data) => {
			this.triggerMarkEvent(cfiRange, data, view.contents)
		});

		this.hooks.render.trigger(view, this).then(() => {
			if (view.contents) {
				this.hooks.content.trigger(view.contents, this).then(() => {
					/**
					 * Emit that a section has been rendered
					 * @event rendered
					 * @param {Section} section
					 * @param {View} view
					 * @memberof Rendition
					 */
					this.emit(EVENTS.RENDITION.RENDERED, view.section, view);
				});
			} else {
				this.emit(EVENTS.RENDITION.RENDERED, view.section, view);
			}
		});
	}

	/**
	 * Report what has been removed
	 * @param {object} view
	 * @private
	 */
	afterRemoved(view) {

		this.hooks.unloaded.trigger(view, this).then(() => {
			/**
			 * Emit that a section has been removed
			 * @event removed
			 * @param {Section} section
			 * @param {View} view
			 * @memberof Rendition
			 */
			this.emit(EVENTS.RENDITION.REMOVED, view.section, view);
		})
	}

	/**
	 * Report resize events and display the last seen location
	 * @param {object} size 
	 * @param {string} [epubcfi]
	 * @private
	 */
	onResized(size, epubcfi) {
		/**
		 * Emit that the rendition has been resized
		 * @event resized
		 * @param {number} width
		 * @param {height} height
		 * @param {string} [epubcfi]
		 * @memberof Rendition
		 */
		this.emit(EVENTS.RENDITION.RESIZED, {
			width: size.width,
			height: size.height
		}, epubcfi);

		if (this.location && this.location.start) {
			this.display(epubcfi || this.location.start.cfi);
		}
	}

	/**
	 * Report orientation events and display the last seen location
	 * @param {ScreenOrientation} orientation 
	 * @private
	 */
	onOrientationChange(orientation) {
		/**
		 * Emit that the rendition has been rotated
		 * @event orientationchange
		 * @param {ScreenOrientation} orientation
		 * @memberof Rendition
		 */
		this.emit(EVENTS.RENDITION.ORIENTATION_CHANGE, orientation);
	}

	/**
	 * Move the Rendition to a specific offset
	 * Usually you would be better off calling display()
	 * @param {object} offset
	 */
	moveTo(offset) {

		this.manager.moveTo(offset);
	}

	/**
	 * Trigger a resize of the views
	 * @param {number} [width]
	 * @param {number} [height]
	 * @param {string} [epubcfi]
	 */
	resize(width, height, epubcfi) {

		if (width) {
			this.settings.width = width;
		}
		if (height) {
			this.settings.height = height;
		}
		this.manager.resize(width, height, epubcfi);
	}

	/**
	 * Clear all rendered views
	 */
	clear() {

		this.manager.clear();
	}

	/**
	 * Go to the next "page" in the rendition
	 * @return {Promise}
	 */
	next() {

		return this.q.enqueue(this.manager.next.bind(this.manager))
			.then(this.reportLocation.bind(this));
	}

	/**
	 * Go to the previous "page" in the rendition
	 * @return {Promise}
	 */
	prev() {

		return this.q.enqueue(this.manager.prev.bind(this.manager))
			.then(this.reportLocation.bind(this));
	}

	//-- http://www.idpf.org/epub/301/spec/epub-publications.html#meta-properties-rendering
	/**
	 * Determine the Layout properties from metadata and settings
	 * @private
	 * @param {object} metadata
	 * @return {object} Layout properties
	 */
	determineLayoutProperties(metadata) {

		return {
			name: this.settings.layout || metadata.layout || "reflowable",
			flow: this.settings.flow || metadata.flow || "paginated",
			spread: this.settings.spread || metadata.spread || "auto",
			viewport: metadata.viewport || "",
			direction: this.settings.direction || metadata.direction || "ltr",
			orientation: this.settings.orientation || metadata.orientation || "auto",
			minSpreadWidth: this.settings.minSpreadWidth || metadata.minSpreadWidth || 800
		}
	}

	/**
	 * Layout configuration
	 * @param {object} options
	 */
	updateLayout(options) {

		this.layout.set(options);
		this.display(this.location.start.cfi);
	}

	/**
	 * Report the current location
	 * @fires relocated
	 * @returns {Promise}
	 */
	reportLocation() {

		const report = (location) => {
			const located = this.located(location);
			if (!located || !located.start || !located.end) {
				return;
			}
			this.location = located;
			/**
			 * @event relocated
			 * @type {displayedLocation}
			 * @memberof Rendition
			 */
			this.emit(EVENTS.RENDITION.RELOCATED, this.location);
		}

		const animate = () => {
			const location = this.manager.currentLocation();
			if (location && location.then && typeof location.then === "function") {
				location.then((result) => report(result));
			} else if (location) {
				report(location);
			}
		}

		return this.q.enqueue(() => {
			requestAnimationFrame(animate.bind(this))
		})
	}

	/**
	 * Get the Current Location object
	 * @return {displayedLocation|Promise} location (may be a promise)
	 */
	currentLocation() {

		const location = this.manager.currentLocation();
		if (location && location.then && typeof location.then === "function") {
			location.then((result) => {
				return this.located(result);
			});
		} else if (location) {
			return this.located(location);
		}
	}

	/**
	 * Creates a Rendition#locationRange from location
	 * passed by the Manager
	 * @param {object[]} location Location sections
	 * @returns {displayedLocation}
	 * @private
	 */
	located(location) {

		if (location.length === 0) return {};

		const start = location[0];
		const end = location[location.length - 1];
		const located = {
			start: {
				href: start.href,
				index: start.index,
				cfi: start.mapping.start,
				displayed: {
					page: start.pages[0] || 1,
					total: start.totalPages
				}
			},
			end: {
				href: end.href,
				index: end.index,
				cfi: end.mapping.end,
				displayed: {
					page: end.pages[end.pages.length - 1] || 1,
					total: end.totalPages
				}
			}
		}

		const locationStart = this.book.locations.locationFromCfi(start.mapping.start);
		const locationEnd = this.book.locations.locationFromCfi(end.mapping.end);

		if (locationStart != null) {
			located.start.location = locationStart;
			located.start.percentage = this.book.locations.percentageFromLocation(locationStart);
		}
		if (locationEnd != null) {
			located.end.location = locationEnd;
			located.end.percentage = this.book.locations.percentageFromLocation(locationEnd);
		}

		const pageStart = this.book.pageList.pageFromCfi(start.mapping.start);
		const pageEnd = this.book.pageList.pageFromCfi(end.mapping.end);

		if (pageStart != -1) {
			located.start.page = pageStart;
		}
		if (pageEnd != -1) {
			located.end.page = pageEnd;
		}

		if (end.index === this.book.spine.last().index &&
			located.end.displayed.page >= located.end.displayed.total) {
			located.atEnd = true;
		}

		if (start.index === this.book.spine.first().index &&
			located.start.displayed.page === 1) {
			located.atStart = true;
		}

		return located;
	}

	/**
	 * Remove and Clean Up the Rendition
	 */
	destroy() {

		// Clear the queue
		// this.q.clear();
		// this.q = undefined;

		this.manager && this.manager.destroy();
		this.book = undefined;

		// this.views = null;
		// this.hooks.display.clear();
		// this.hooks.serialize.clear();
		// this.hooks.content.clear();
		// this.hooks.layout.clear();
		// this.hooks.render.clear();
		// this.hooks.show.clear();
		// this.hooks = {};
		// this.themes.destroy();
		// this.themes = undefined;
		// this.epubcfi = undefined;
		// this.starting = undefined;
		// this.started = undefined;
	}

	/**
	 * Pass the events from a view's Contents
	 * @param  {Contents} view contents
	 * @private
	 */
	passEvents(contents) {

		DOM_EVENTS.forEach((e) => {
			contents.on(e, (ev) => this.triggerViewEvent(ev, contents));
		});

		contents.on(EVENTS.CONTENTS.SELECTED, (e) => this.triggerSelectedEvent(e, contents));
	}

	/**
	 * Emit events passed by a view
	 * @param  {event} e
	 * @private
	 */
	triggerViewEvent(e, contents) {

		this.emit(e.type, e, contents);
	}

	/**
	 * Emit a selection event's CFI Range passed from a a view
	 * @param  {string} cfirange
	 * @private
	 */
	triggerSelectedEvent(cfirange, contents) {
		/**
		 * Emit that a text selection has occurred
		 * @event selected
		 * @param {string} cfirange
		 * @param {Contents} contents
		 * @memberof Rendition
		 */
		this.emit(EVENTS.RENDITION.SELECTED, cfirange, contents);
	}

	/**
	 * Emit a markClicked event with the cfiRange and data from a mark
	 * @param  {EpubCFI} cfirange
	 * @param {object} data 
	 * @param {Contents} contents 
	 * @private
	 */
	triggerMarkEvent(cfiRange, data, contents) {
		/**
		 * Emit that a mark was clicked
		 * @event markClicked
		 * @param {EpubCFI} cfiRange
		 * @param {object} data
		 * @param {Contents} contents
		 * @memberof Rendition
		 */
		this.emit(EVENTS.RENDITION.MARK_CLICKED, cfiRange, data, contents);
	}

	/**
	 * Get a Range from a Visible CFI
	 * @param  {string} epubcfi EpubCfi string
	 * @param  {string} ignoreClass
	 * @return {Range}
	 */
	getRange(epubcfi, ignoreClass) {

		const cfi = new EpubCFI(epubcfi);
		const found = this.manager.visible().filter((view) => {
			if (cfi.spinePos === view.index) return true;
		});

		// Should only every return 1 item
		if (found.length) {
			return found[0].contents.range(cfi, ignoreClass);
		}
	}

	/**
	 * Hook to adjust images to fit in columns
	 * @param  {Contents} contents
	 * @private
	 */
	adjustImages(contents) {

		if (this.layout.name === "pre-paginated") {
			return new Promise((resolve) => {
				resolve();
			});
		}

		const computed = contents.window.getComputedStyle(contents.content, null);
		const padding = {
			top: parseFloat(computed.paddingTop),
			bottom: parseFloat(computed.paddingBottom),
			left: parseFloat(computed.paddingLeft),
			right: parseFloat(computed.paddingRight)
		}
		const height = (contents.content.offsetHeight - (padding.top + padding.bottom)) * .95;
		const hPadding = padding.left + padding.right;
		const maxWidth = (this.layout.columnWidth ? (this.layout.columnWidth - hPadding) + "px" : "100%") + "!important";

		contents.addStylesheetRules({
			"img": {
				"max-width": maxWidth,
				"max-height": `${height}px !important`,
				"object-fit": "contain",
				"page-break-inside": "avoid",
				"break-inside": "avoid",
				"box-sizing": "border-box"
			},
			"svg": {
				"max-width": maxWidth,
				"max-height": `${height}px !important`,
				"page-break-inside": "avoid",
				"break-inside": "avoid"
			}
		});

		return new Promise((resolve, reject) => {
			// Wait to apply
			setTimeout(() => {
				resolve();
			}, 1);
		});
	}

	/**
	 * Get the Contents object of each rendered view
	 * @returns {object[]}
	 */
	getContents() {

		return this.manager ? this.manager.getContents() : [];
	}

	/**
	 * Get the views member from the manager
	 * @returns {object[]}
	 */
	views() {

		const views = this.manager ? this.manager.views : undefined;
		return views || [];
	}

	/**
	 * Hook to handle link clicks in rendered content
	 * @param {Contents} contents
	 * @private
	 */
	handleLinks(contents) {

		if (contents) {
			contents.on(EVENTS.CONTENTS.LINK_CLICKED, (href) => {
				let relative = this.book.path.relative(href);
				this.display(relative);
			});
		}
	}

	/**
	 * Hook to handle injecting stylesheet before
	 * a Section is serialized
	 * @param {Document} doc
	 * @param {Section} section
	 * @private
	 */
	injectStylesheet(doc, section) {

		const style = doc.createElement("link");
		style.setAttribute("type", "text/css");
		style.setAttribute("rel", "stylesheet");
		style.setAttribute("href", this.settings.stylesheet);
		doc.getElementsByTagName("head")[0].appendChild(style);
	}

	/**
	 * Hook to handle injecting scripts before
	 * a Section is serialized
	 * @param {Document} doc
	 * @param {Section} section
	 * @private
	 */
	injectScript(doc, section) {

		const script = doc.createElement("script");
		script.setAttribute("type", "text/javascript");
		script.setAttribute("src", this.settings.script);
		script.textContent = " "; // Needed to prevent self closing tag
		doc.getElementsByTagName("head")[0].appendChild(script);
	}

	/**
	 * Hook to handle the document identifier before
	 * a Section is serialized
	 * @param {document} doc
	 * @param {Section} section
	 * @private
	 */
	injectIdentifier(doc, section) {

		const ident = this.book.packaging.metadata.identifier;
		const meta = doc.createElement("meta");
		meta.setAttribute("name", "dc.relation.ispartof");
		if (ident) meta.setAttribute("content", ident);
		doc.getElementsByTagName("head")[0].appendChild(meta);
	}
}

EventEmitter(Rendition.prototype);

export default Rendition;