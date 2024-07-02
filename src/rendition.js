import EventEmitter from "event-emitter";
import Annotations from "./annotations";
import EpubCFI from "./epubcfi";
import Layout from "./layout";
import Themes from "./themes";
import Defer from "./utils/defer";
import Hook from "./utils/hook";
import Path from "./utils/path";
import Queue from "./utils/queue";
import { extend, isFloat } from "./utils/core";
import { EVENTS, DOM_EVENTS } from "./utils/constants";

// Default View Managers
import DefaultViewManager from "./managers/default/index";
import ContinuousViewManager from "./managers/continuous/index";

/**
 * Displays an Epub as a series of Views for each Section.
 * Requires Manager and View class to handle specifics of rendering
 * the section content.
 * @param {Book} book
 * @param {Object} [options]
 * @param {Number} [options.width]
 * @param {Number} [options.height]
 * @param {String} [options.ignoreClass] class for the cfi parser to ignore
 * @param {String|Function|Object} [options.manager='default'] string values: default / continuous
 * @param {String|Function} [options.view='iframe']
 * @param {String} [options.method='write'] values: `"write"` OR `"srcdoc"`
 * @param {String} [options.layout] layout to force
 * @param {String} [options.spread] force spread value
 * @param {String} [options.direction] direction `"ltr"` OR `"rtl"`
 * @param {Number} [options.minSpreadWidth] overridden by spread: none (never) / both (always)
 * @param {String} [options.stylesheet] url of stylesheet to be injected
 * @param {String} [options.script] url of script to be injected
 * @param {Object} [options.snap] use snap scrolling
 * @param {Boolean} [options.fullsize=false]
 * @param {Boolean} [options.allowPopups=false] enable opening popup in content
 * @param {Boolean} [options.allowScriptedContent=false] enable running scripts in content
 * @param {Boolean} [options.resizeOnOrientationChange=true] false to disable orientation events
 */
class Rendition {
	constructor(book, options) {
		/**
		 * @member {Object} settings
		 * @memberof Rendition
		 * @readonly
		 */
		this.settings = extend({
			width: null,
			height: null,
			manager: "default",
			view: "iframe",
			flow: null,
			method: "write", // the 'baseUrl' value is set from the 'book.settings.replacements' property
			layout: null,
			spread: null,
			minSpreadWidth: 800,
			script: null,
			snap: false,
			direction: null, // TODO: implement to 'auto' detection
			ignoreClass: "",
			stylesheet: null,
			fullsize: false,
			allowPopups: false,
			allowScriptedContent: false,
			resizeOnOrientationChange: true,
		}, options || {});

		if (typeof this.settings.manager === "object") {
			this.manager = this.settings.manager;
		}

		this.book = book;
		/**
		 * Adds Hook methods to the Rendition prototype
		 * @member {Object} hooks
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

		this.book.sections.hooks.content.register(this.injectIdentifier.bind(this));

		if (this.settings.stylesheet) {
			this.book.sections.hooks.content.register(this.injectStylesheet.bind(this));
		}

		if (this.settings.script) {
			this.book.sections.hooks.content.register(this.injectScript.bind(this));
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
		 * @property {Object} start
		 * @property {String} start.index
		 * @property {String} start.href
		 * @property {Object} start.displayed
		 * @property {Number} start.displayed.page
		 * @property {Number} start.displayed.total
		 * @property {String} start.cfi EpubCFI string format
		 * @property {Number} start.location
		 * @property {Number} start.percentage
		 * @property {Object} end
		 * @property {String} end.index
		 * @property {String} end.href
		 * @property {Object} end.displayed
		 * @property {Number} end.displayed.page
		 * @property {Number} end.displayed.total
		 * @property {String} end.cfi EpubCFI string format
		 * @property {Number} end.location
		 * @property {Number} end.percentage
		 * @property {Boolean} atStart Location at start position
		 * @property {Boolean} atEnd Location at end position
		 * @memberof Rendition
		 */
		this.location = undefined;

		// Hold queue until book is opened
		this.q.enqueue(this.book.opened);

		this.starting = new Defer();
		/**
		 * returns after the rendition has started
		 * @member {Promise<any>} started
		 * @memberof Rendition
		 */
		this.started = this.starting.promise;

		// Block the queue until rendering is started
		this.q.enqueue(this.start);
	}

	/**
	 * Set the manager function
	 * @param {Function} manager
	 */
	setManager(manager) {

		this.manager = manager;
	}

	/**
	 * Require the manager from passed string, or as a class function
	 * @param {String|Object} manager [description]
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

		// Parse metadata to get layout props
		const props = this.determineLayoutProperties();
		this.settings.layout = props.name;

		this.layout = new Layout(props);
		this.layout.on(EVENTS.LAYOUT.UPDATED, (props, changed) => {
			/**
			 * Emit of updated the Layout state
			 * @event layout
			 * @param {Layout} props
			 * @param {Object} changed
			 * @memberof Rendition
			 */
			this.emit(EVENTS.RENDITION.LAYOUT, props, changed);
		});

		if (this.manager === undefined) {
			const manager = this.requireManager(this.settings.manager);
			const options = {
				snap: this.settings.snap,
				view: this.settings.view,
				method: this.settings.method,
				fullsize: this.settings.fullsize,
				ignoreClass: this.settings.ignoreClass,
				allowPopups: this.settings.allowPopups,
				allowScriptedContent: this.settings.allowScriptedContent,
				resizeOnOrientationChange: this.settings.resizeOnOrientationChange,
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
	 * @param {Element} element to attach to
	 * @return {Promise<any>}
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
	 * @param {String|Number} [target] `Section.index` OR `Section.idref` OR `Section.href` OR EpubCFI
	 * @example rendition.display()
	 * @example rendition.display(3)
	 * @example rendition.display("#chapter_001")
	 * @example rendition.display("chapter_001.xhtml")
	 * @example rendition.display("epubcfi(/6/8!/4/2/16/1:0)")
	 * @return {Promise<any>}
	 */
	display(target) {

		if (this.displaying) {
			this.displaying.resolve();
		}
		return this.q.enqueue(this._display, target);
	}

	/**
	 * Tells the manager what to display immediately
	 * @param {String} [target]
	 * @return {Promise<Section>}
	 * @private
	 */
	_display(target) {

		if (!this.book) return;
		const displaying = new Defer();
		const displayed = displaying.promise;
		this.displaying = displaying;

		// Check if this is a book percentage
		if (this.book.locations.length && isFloat(target)) {
			target = this.book.locations.cfiFromPercentage(parseFloat(target));
		}

		const section = this.book.sections.get(target);

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
			 * @param {Error} err
			 * @memberof Rendition
			 */
			this.emit(EVENTS.RENDITION.DISPLAY_ERROR, err);
		});

		return displayed;
	}

	/**
	 * Report what section has been displayed
	 * @param {Object} view
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
					 * @param {View} view
					 * @memberof Rendition
					 */
					this.emit(EVENTS.RENDITION.RENDERED, view);
				});
			} else {
				this.emit(EVENTS.RENDITION.RENDERED, view);
			}
		});
	}

	/**
	 * Report what has been removed
	 * @param {Object} view
	 * @private
	 */
	afterRemoved(view) {

		this.hooks.unloaded.trigger(view, this).then(() => {
			/**
			 * Emit that a section has been removed
			 * @event removed
			 * @param {View} view
			 * @memberof Rendition
			 */
			this.emit(EVENTS.RENDITION.REMOVED, view);
		})
	}

	/**
	 * Report resize events and display the last seen location
	 * @param {Object} size 
	 * @param {Number} size.width
	 * @param {Number} size.height
	 * @param {String} [epubcfi]
	 * @private
	 */
	onResized(size, epubcfi) {
		/**
		 * Emit that the rendition has been resized
		 * @event resized
		 * @param {Object} size
		 * @param {Number} size.width
		 * @param {Number} size.height
		 * @param {String} [epubcfi]
		 * @memberof Rendition
		 */
		this.emit(EVENTS.RENDITION.RESIZED, size, epubcfi);

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
	 * @param {Object} offset
	 */
	moveTo(offset) {

		this.manager.moveTo(offset);
	}

	/**
	 * Trigger a resize of the views
	 * @param {Number} [width]
	 * @param {Number} [height]
	 * @param {String} [epubcfi]
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
	 * @return {Promise<any>}
	 */
	next() {

		return this.q.enqueue(
			this.manager.next.bind(this.manager)
		).then(this.reportLocation.bind(this));
	}

	/**
	 * Go to the previous "page" in the rendition
	 * @return {Promise<any>}
	 */
	prev() {

		return this.q.enqueue(
			this.manager.prev.bind(this.manager)
		).then(this.reportLocation.bind(this));
	}

	/**
	 * Determine the Layout properties from metadata and settings
	 * @link http://www.idpf.org/epub/301/spec/epub-publications.html#meta-properties-rendering
	 * @return {Object} Layout properties
	 * @private
	 */
	determineLayoutProperties() {

		const metadata = this.book.packaging.metadata;
		const direction = this.book.packaging.direction;
		return {
			name: this.settings.layout || metadata.get("layout") || "reflowable",
			flow: this.settings.flow || metadata.get("flow") || "paginated",
			spread: this.settings.spread || metadata.get("spread") || "auto",
			viewport: metadata.get("viewport") || "",
			direction: this.settings.direction || direction || "ltr",
			orientation: this.settings.orientation || metadata.get("orientation") || "auto",
			minSpreadWidth: this.settings.minSpreadWidth || 800
		}
	}

	/**
	 * Layout configuration
	 * @param {Object} options
	 */
	updateLayout(options) {

		this.layout.set(options);
		this.display(this.location.start.cfi);
	}

	/**
	 * Report the current location
	 * @fires relocated
	 * @returns {Promise<any>}
	 * @private
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
	 * @param {Object} location Location sections
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

		if (locationStart !== null) {
			located.start.location = locationStart;
			located.start.percentage = this.book.locations.percentageFromLocation(locationStart);
		}
		if (locationEnd !== null) {
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

		if (end.index === this.book.sections.last().index &&
			located.end.displayed.page >= located.end.displayed.total) {
			located.atEnd = true;
		}

		if (start.index === this.book.sections.first().index &&
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
	 * @param {Contents} view contents
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
	 * @param {event} e
	 * @private
	 */
	triggerViewEvent(e, contents) {

		this.emit(e.type, e, contents);
	}

	/**
	 * Emit a selection event's CFI Range passed from a a view
	 * @param {String} cfirange
	 * @private
	 */
	triggerSelectedEvent(cfirange, contents) {
		/**
		 * Emit that a text selection has occurred
		 * @event selected
		 * @param {String} cfirange
		 * @param {Contents} contents
		 * @memberof Rendition
		 */
		this.emit(EVENTS.RENDITION.SELECTED, cfirange, contents);
	}

	/**
	 * Emit a markClicked event with the cfiRange and data from a mark
	 * @param {EpubCFI} cfirange
	 * @param {Object} data 
	 * @param {Contents} contents 
	 * @private
	 */
	triggerMarkEvent(cfiRange, data, contents) {
		/**
		 * Emit that a mark was clicked
		 * @event markClicked
		 * @param {EpubCFI} cfiRange
		 * @param {Object} data
		 * @param {Contents} contents
		 * @memberof Rendition
		 */
		this.emit(EVENTS.RENDITION.MARK_CLICKED, cfiRange, data, contents);
	}

	/**
	 * Get a Range from a Visible CFI
	 * @param {String} epubcfi EpubCfi string
	 * @param {String} ignoreClass
	 * @return {Range}
	 */
	getRange(epubcfi, ignoreClass) {

		const cfi = new EpubCFI(epubcfi);
		const found = this.manager.visible().filter((view) => {
			if (cfi.spinePos === view.section.index) return true;
		});

		// Should only every return 1 item
		if (found.length) {
			return found[0].contents.range(cfi, ignoreClass);
		}
	}

	/**
	 * Hook to adjust images to fit in columns
	 * @param {Contents} contents
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

		contents.appendStylesheetRules({
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
		}, "images");

		return new Promise((resolve, reject) => {
			// Wait to apply
			setTimeout(() => {
				resolve();
			}, 1);
		});
	}

	/**
	 * Get the Contents object of each rendered view
	 * @returns {Array<Contents>}
	 */
	getContents() {

		return this.manager ? this.manager.getContents() : [];
	}

	/**
	 * Get the views member from the manager
	 * @returns {Views}
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
				const path = new Path(href);
				const relative = path.relative(path.directory, href);
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
	 * @param {Document} doc
	 * @param {Section} section 
	 * @private
	 */
	injectIdentifier(doc, section) {

		const ident = this.book.packaging.metadata.get("identifier");
		const meta = doc.createElement("meta");
		meta.setAttribute("name", "dc.relation.ispartof");
		if (ident) meta.setAttribute("content", ident);
		doc.getElementsByTagName("head")[0].appendChild(meta);
	}
}

EventEmitter(Rendition.prototype);

export default Rendition;