import EventEmitter from "event-emitter";
import { extend, borders, uuid, isNumber, bounds, defer, createBlobUrl, revokeBlobUrl } from "../../utils/core";
import EpubCFI from "../../epubcfi";
import Contents from "../../contents";
import { EVENTS } from "../../utils/constants";
import { Pane, Highlight, Underline } from "marks-pane";

/**
 * IframeView
 * @param {Layout} layout
 * @param {Section} section
 * @param {object} [options]
 * @param {boolean} [options.allowPopups=false]
 * @param {boolean} [options.allowScriptedContent=false]
 * @param {*} [options.axis]
 * @param {boolean} [options.forceRight=false]
 * @param {number} [options.width]
 * @param {number} [options.height]
 * @param {string} [options.ignoreClass='']
 * @param {*} [options.method]
 */
class IframeView {
	constructor(layout, section, options) {
		this.settings = extend({
			axis: undefined, //options.layout && options.layout.props.flow === "scrolled" ? "vertical" : "horizontal",
			method: undefined,
			forceRight: false,
			forceEvenPages: false,
			ignoreClass: "",
			allowPopups: false,
			allowScriptedContent: false,
		}, options || {});

		this.id = "epubjs-view-" + uuid();
		this.section = section;
		this.index = section.index;
		this.element = this.container(this.settings.axis);
		this.added = false;
		this.displayed = false;
		this.rendered = false;
		this.fixedWidth = 0;
		this.fixedHeight = 0;

		// Blank Cfi for Parsing
		this.epubcfi = new EpubCFI();
		/**
		 * @member {Layout} layout
		 * @memberof IframeView
		 * @readonly
		 */
		this.layout = layout;
		this.layout.on(EVENTS.LAYOUT.UPDATED, (props, changed) => {
			this.updateLayout();
		});
		// Dom events to listen for
		// this.listenedEvents = ["keydown", "keyup", "keypressed", "mouseup", "mousedown", "click", "touchend", "touchstart"];

		this.pane = undefined;
		this.highlights = {};
		this.underlines = {};
		this.marks = {};
	}

	/**
	 * container
	 * @param {*} axis 
	 * @returns {Element} HTML element
	 */
	container(axis) {

		const element = document.createElement("div");
		element.classList.add("epub-view");
		//element.style.minHeight = "100px";
		element.style.height = "0px";
		element.style.width = "0px";
		element.style.overflow = "hidden";
		element.style.position = "relative";
		element.style.display = "block";

		// if (axis && axis == "horizontal") {
		// 	element.style.flex = "none";
		// } else {
		// 	element.style.flex = "initial";
		// }

		return element;
	}

	/**
	 * create
	 * @returns {Element} iframe
	 */
	create() {

		if (this.iframe) {
			return this.iframe;
		}

		if (!this.element) {
			this.element = this.createContainer();
		}

		this.iframe = document.createElement("iframe");
		this.iframe.id = this.id;
		//this.iframe.scrolling = "no"; // Might need to be removed: breaks ios width calculations
		this.iframe.style.overflow = "hidden";
		this.iframe.seamless = "seamless";
		// Back up if seamless isn't supported
		this.iframe.style.border = "none";

		// sandbox
		this.iframe.sandbox = "allow-same-origin";
		if (this.settings.allowScriptedContent) {
			this.iframe.sandbox += " allow-scripts";
		}
		if (this.settings.allowPopups) {
			this.iframe.sandbox += " allow-popups";
		}

		this.iframe.setAttribute("enable-annotation", "true");
		this.resizing = true;

		// this.iframe.style.display = "none";
		//this.element.style.visibility = "hidden";
		//this.iframe.style.visibility = "hidden";

		this.iframe.style.width = "0";
		this.iframe.style.height = "0";
		this.width = 0;
		this.height = 0;

		this.element.setAttribute("ref", this.index);
		this.added = true;
		this.elementBounds = bounds(this.element);

		if (("srcdoc" in this.iframe)) {
			this.supportsSrcdoc = true;
		} else {
			this.supportsSrcdoc = false;
		}

		if (!this.settings.method) {
			this.settings.method = this.supportsSrcdoc ? "srcdoc" : "write";
		}

		return this.iframe;
	}

	/**
	 * render
	 * @param {*} request 
	 * @param {*} show 
	 * @returns {object} section render object
	 */
	render(request, show) {

		// view.onLayout = this.layout.format.bind(this.layout);
		this.create();

		// Fit to size of the container, apply padding
		this.size();

		if (!this.sectionRender) {
			this.sectionRender = this.section.render(request);
		}

		// Render Chain
		return this.sectionRender.then((contents) => {
			return this.load(contents);
		}).then(() => {

			// find and report the writingMode axis
			let writingMode = this.contents.writingMode();

			// Set the axis based on the flow and writing mode
			let axis;
			if (this.layout.flow === "scrolled") {
				axis = (writingMode.indexOf("vertical") === 0) ? "horizontal" : "vertical";
			} else {
				axis = (writingMode.indexOf("vertical") === 0) ? "vertical" : "horizontal";
			}

			if (writingMode.indexOf("vertical") === 0 && this.layout.flow === "paginated") {
				this.layout.delta = this.layout.height;
			}

			this.setAxis(axis);
			this.emit(EVENTS.VIEWS.AXIS, axis);

			this.setWritingMode(writingMode);
			this.emit(EVENTS.VIEWS.WRITING_MODE, writingMode);


			// apply the layout function to the contents
			this.layout.format(this.contents, this.section, this.axis);

			// Listen for events that require an expansion of the iframe
			this.addListeners();

			return new Promise((resolve, reject) => {
				// Expand the iframe to the full size of the content
				this.expand();

				if (this.settings.forceRight) {
					this.element.style.marginLeft = this.width + "px";
				}
				resolve();
			});

		}, (e) => {
			this.emit(EVENTS.VIEWS.LOAD_ERROR, e);
			return new Promise((resolve, reject) => {
				reject(e);
			});
		}).then(() => {
			this.emit(EVENTS.VIEWS.RENDERED, this.section);
		});
	}

	/**
	 * reset
	 */
	reset() {

		if (this.iframe) {
			this.iframe.style.width = "0";
			this.iframe.style.height = "0";
			this.width = 0;
			this.height = 0;
			this._textWidth = undefined;
			this._contentWidth = undefined;
			this._textHeight = undefined;
			this._contentHeight = undefined;
		}
		this.needsReframe = true;
	}

	/**
	 * size
	 * Determine locks base on settings
	 * @param {*} [width] 
	 * @param {*} [height] 
	 */
	size(width, height) {

		const w = width || this.layout.width;
		const h = height || this.layout.height;

		if (this.layout.name === "pre-paginated") {
			this.lock("both", w, h);
		} else if (this.settings.axis === "horizontal") {
			this.lock("height", w, h);
		} else {
			this.lock("width", w, h);
		}
	}

	/**
	 * lock
	 * Lock an axis to element dimensions, taking borders into account
	 * @param {*} what 
	 * @param {*} width 
	 * @param {*} height 
	 */
	lock(what, width, height) {

		const elBorders = borders(this.element);

		let iframeBorders;
		if (this.iframe) {
			iframeBorders = borders(this.iframe);
		} else {
			iframeBorders = { width: 0, height: 0 };
		}

		if (what === "width" && isNumber(width)) {
			this.lockedWidth = width - elBorders.width - iframeBorders.width;
			// this.resize(this.lockedWidth, width); //  width keeps ratio correct
		}

		if (what === "height" && isNumber(height)) {
			this.lockedHeight = height - elBorders.height - iframeBorders.height;
			// this.resize(width, this.lockedHeight);
		}

		if (what === "both" && isNumber(width) && isNumber(height)) {

			this.lockedWidth = width - elBorders.width - iframeBorders.width;
			this.lockedHeight = height - elBorders.height - iframeBorders.height;
			// this.resize(this.lockedWidth, this.lockedHeight);
		}

		if (this.displayed && this.iframe) {

			// this.contents.layout();
			this.expand();
		}
	}

	/**
	 * expand
	 * Resize a single axis based on content dimensions
	 * @param {*} force 
	 */
	expand(force) {

		let width = this.lockedWidth;
		let height = this.lockedHeight;

		if (!this.iframe || this.expanding) return;

		this.expanding = true;

		if (this.layout.name === "pre-paginated") {
			width = this.layout.columnWidth;
			height = this.layout.height;
		} else if (this.settings.axis === "horizontal") {
			// Get the width of the text
			width = this.contents.textWidth();

			if (width % this.layout.pageWidth > 0) {
				width = Math.ceil(width / this.layout.pageWidth) * this.layout.pageWidth;
			}

			if (this.settings.forceEvenPages) {
				const columns = (width / this.layout.pageWidth);
				if (this.layout.divisor > 1 &&
					this.layout.name === "reflowable" &&
					(columns % 2 > 0)) {
					// add a blank page
					width += this.layout.pageWidth;
				}
			}

		} // Expand Vertically
		else if (this.settings.axis === "vertical") {
			height = this.contents.textHeight();
			if (this.layout.flow === "paginated" &&
				height % this.layout.height > 0) {
				height = Math.ceil(height / this.layout.height) * this.layout.height;
			}
		}

		// Only Resize if dimensions have changed or
		// if Frame is still hidden, so needs reframing
		if (this.needsReframe || width !== this.width || height !== this.height) {
			this.reframe(width, height);
		}

		this.expanding = false;
	}

	/**
	 * reframe
	 * @param {*} width 
	 * @param {*} height 
	 */
	reframe(width, height) {
		
		if (isNumber(width)) {
			this.element.style.width = width + "px";
			this.iframe.style.width = width + "px";
			this.width = width;
		}

		if (isNumber(height)) {
			this.element.style.height = height + "px";
			this.iframe.style.height = height + "px";
			this.height = height;
		}

		let widthDelta = this.prevBounds ? width - this.prevBounds.width : width;
		let heightDelta = this.prevBounds ? height - this.prevBounds.height : height;

		const size = {
			width: width,
			height: height,
			widthDelta: widthDelta,
			heightDelta: heightDelta,
		};

		this.pane && this.pane.render();

		requestAnimationFrame(() => {
			let mark;
			for (let m in this.marks) {
				if (this.marks.hasOwnProperty(m)) {
					mark = this.marks[m];
					this.placeMark(mark.element, mark.range);
				}
			}
		});

		this.onResize(this, size);
		this.emit(EVENTS.VIEWS.RESIZED, size);
		this.prevBounds = size;
		this.elementBounds = bounds(this.element);
	}

	/**
	 * load
	 * @param {*} contents 
	 * @returns {Promise} loading promise
	 */
	load(contents) {

		const loading = new defer();
		const loaded = loading.promise;

		if (!this.iframe) {
			loading.reject(new Error("No Iframe Available"));
			return loaded;
		}

		this.iframe.onload = function (event) {

			this.onLoad(event, loading);

		}.bind(this);

		if (this.settings.method === "blobUrl") {
			this.blobUrl = createBlobUrl(contents, "application/xhtml+xml");
			this.iframe.src = this.blobUrl;
			this.element.appendChild(this.iframe);
		} else if (this.settings.method === "srcdoc") {
			this.iframe.srcdoc = contents;
			this.element.appendChild(this.iframe);
		} else {

			this.element.appendChild(this.iframe);

			this.document = this.iframe.contentDocument;

			if (!this.document) {
				loading.reject(new Error("No Document Available"));
				return loaded;
			}

			this.iframe.contentDocument.open();
			// For Cordova windows platform
			if (window.MSApp && MSApp.execUnsafeLocalFunction) {
				var outerThis = this;
				MSApp.execUnsafeLocalFunction(function () {
					outerThis.iframe.contentDocument.write(contents);
				});
			} else {
				this.iframe.contentDocument.write(contents);
			}
			this.iframe.contentDocument.close();

		}

		return loaded;
	}

	/**
	 * onLoad
	 * @param {*} event 
	 * @param {*} promise 
	 */
	onLoad(event, promise) {

		this.window = this.iframe.contentWindow;
		this.document = this.iframe.contentDocument;
		this.contents = new Contents(this.document, this.document.body, this.section.cfiBase, this.section.index);
		this.rendering = false;

		const link = this.document.querySelector("link[rel='canonical']");
		if (link) {
			link.setAttribute("href", this.section.canonical);
		} else {
			link = this.document.createElement("link");
			link.setAttribute("rel", "canonical");
			link.setAttribute("href", this.section.canonical);
			this.document.querySelector("head").appendChild(link);
		}

		this.contents.on(EVENTS.CONTENTS.EXPAND, () => {
			if (this.displayed && this.iframe) {
				this.expand();
				if (this.contents) {
					this.layout.format(this.contents);
				}
			}
		});

		this.contents.on(EVENTS.CONTENTS.RESIZE, (e) => {
			if (this.displayed && this.iframe) {
				this.expand();
				if (this.contents) {
					this.layout.format(this.contents);
				}
			}
		});

		promise.resolve(this.contents);
	}

	/**
	 * Update Layout
	 * @private
	 */
	updateLayout() {

		if (this.contents) {
			this.layout.format(this.contents);
			this.expand();
		}
	}

	/**
	 * setAxis
	 * @param {*} axis 
	 */
	setAxis(axis) {

		this.settings.axis = axis;

		// if (axis == "horizontal") {
		// 	this.element.style.flex = "none";
		// } else {
		// 	this.element.style.flex = "initial";
		// }

		this.size();
	}

	/**
	 * setWritingMode
	 * @param {*} mode 
	 */
	setWritingMode(mode) {
		// this.element.style.writingMode = writingMode;
		this.writingMode = mode;
	}

	addListeners() {
		//TODO: Add content listeners for expanding
	}

	removeListeners(layoutFunc) {
		//TODO: remove content listeners for expanding
	}

	/**
	 * display
	 * @param {*} request 
	 * @returns {Promise} displayed promise
	 */
	display(request) {

		const displayed = new defer();

		if (!this.displayed) {

			this.render(request).then(() => {

				this.emit(EVENTS.VIEWS.DISPLAYED, this);
				this.onDisplayed(this);

				this.displayed = true;
				displayed.resolve(this);

			}, (err) => {
				displayed.reject(err, this);
			});

		} else {
			displayed.resolve(this);
		}

		return displayed.promise;
	}

	/**
	 * show
	 */
	show() {

		this.element.style.visibility = "visible";

		if (this.iframe) {
			this.iframe.style.visibility = "visible";

			// Remind Safari to redraw the iframe
			this.iframe.style.transform = "translateZ(0)";
			this.iframe.offsetWidth;
			this.iframe.style.transform = null;
		}

		this.emit(EVENTS.VIEWS.SHOWN, this);
	}

	/**
	 * hide
	 */
	hide() {

		this.element.style.visibility = "hidden";
		this.iframe.style.visibility = "hidden";

		this.stopExpanding = true;
		this.emit(EVENTS.VIEWS.HIDDEN, this);
	}

	/**
	 * offset
	 * @returns {object}
	 */
	offset() {

		return {
			top: this.element.offsetTop,
			left: this.element.offsetLeft
		}
	}

	/**
	 * position
	 * @returns {DOMRect}
	 */
	position() {

		return this.element.getBoundingClientRect();
	}

	/**
	 * locationOf
	 * @param {*} target 
	 * @returns {object}
	 */
	locationOf(target) {

		var parentPos = this.iframe.getBoundingClientRect();
		var targetPos = this.contents.locationOf(target, this.settings.ignoreClass);

		return {
			"left": targetPos.left,
			"top": targetPos.top
		};
	}

	onDisplayed(view) {
		// Stub, override with a custom functions
	}

	onResize(view, e) {
		// Stub, override with a custom functions
	}

	/**
	 * bounds
	 * @param {*} force 
	 * @returns {Element}
	 */
	bounds(force) {

		if (force || !this.elementBounds) {
			this.elementBounds = bounds(this.element);
		}

		return this.elementBounds;
	}

	/**
	 * highlight
	 * @param {*} cfiRange 
	 * @param {*} [data={}] 
	 * @param {*} cb 
	 * @param {*} [className='epubjs-hl'] 
	 * @param {*} [styles={}] 
	 * @returns {object}
	 */
	highlight(cfiRange, data = {}, cb, className = "epubjs-hl", styles = {}) {

		if (!this.contents) {
			return;
		}
		const attributes = Object.assign({ "fill": "yellow", "fill-opacity": "0.3", "mix-blend-mode": "multiply" }, styles);
		let range = this.contents.range(cfiRange);

		let emitter = () => {
			this.emit(EVENTS.VIEWS.MARK_CLICKED, cfiRange, data);
		};

		data["epubcfi"] = cfiRange;

		if (!this.pane) {
			this.pane = new Pane(this.iframe, this.element);
		}

		let m = new Highlight(range, className, data, attributes);
		let h = this.pane.addMark(m);

		this.highlights[cfiRange] = { "mark": h, "element": h.element, "listeners": [emitter, cb] };

		h.element.setAttribute("ref", className);
		h.element.addEventListener("click", emitter);
		h.element.addEventListener("touchstart", emitter);

		if (cb) {
			h.element.addEventListener("click", cb);
			h.element.addEventListener("touchstart", cb);
		}
		return h;
	}

	/**
	 * underline
	 * @param {*} cfiRange 
	 * @param {*} [data={}] 
	 * @param {*} cb 
	 * @param {*} [className='epubjs-ul'] 
	 * @param {*} [styles={}] 
	 * @returns {object}
	 */
	underline(cfiRange, data = {}, cb, className = "epubjs-ul", styles = {}) {

		if (!this.contents) {
			return;
		}
		const attributes = Object.assign({ "stroke": "black", "stroke-opacity": "0.3", "mix-blend-mode": "multiply" }, styles);
		let range = this.contents.range(cfiRange);
		let emitter = () => {
			this.emit(EVENTS.VIEWS.MARK_CLICKED, cfiRange, data);
		};

		data["epubcfi"] = cfiRange;

		if (!this.pane) {
			this.pane = new Pane(this.iframe, this.element);
		}

		let m = new Underline(range, className, data, attributes);
		let h = this.pane.addMark(m);

		this.underlines[cfiRange] = { "mark": h, "element": h.element, "listeners": [emitter, cb] };

		h.element.setAttribute("ref", className);
		h.element.addEventListener("click", emitter);
		h.element.addEventListener("touchstart", emitter);

		if (cb) {
			h.element.addEventListener("click", cb);
			h.element.addEventListener("touchstart", cb);
		}
		return h;
	}

	/**
	 * mark
	 * @param {*} cfiRange 
	 * @param {*} [data={}] 
	 * @param {*} cb 
	 * @returns {object}
	 */
	mark(cfiRange, data = {}, cb) {

		if (!this.contents) {
			return;
		}

		if (cfiRange in this.marks) {
			let item = this.marks[cfiRange];
			return item;
		}

		let range = this.contents.range(cfiRange);
		if (!range) {
			return;
		}
		let container = range.commonAncestorContainer;
		let parent = (container.nodeType === 1) ? container : container.parentNode;

		let emitter = (e) => {
			this.emit(EVENTS.VIEWS.MARK_CLICKED, cfiRange, data);
		};

		if (range.collapsed && container.nodeType === 1) {
			range = new Range();
			range.selectNodeContents(container);
		} else if (range.collapsed) { // Webkit doesn't like collapsed ranges
			range = new Range();
			range.selectNodeContents(parent);
		}

		let mark = this.document.createElement("a");
		mark.setAttribute("ref", "epubjs-mk");
		mark.style.position = "absolute";

		mark.dataset["epubcfi"] = cfiRange;

		if (data) {
			Object.keys(data).forEach((key) => {
				mark.dataset[key] = data[key];
			});
		}

		if (cb) {
			mark.addEventListener("click", cb);
			mark.addEventListener("touchstart", cb);
		}

		mark.addEventListener("click", emitter);
		mark.addEventListener("touchstart", emitter);

		this.placeMark(mark, range);

		this.element.appendChild(mark);

		this.marks[cfiRange] = { "element": mark, "range": range, "listeners": [emitter, cb] };

		return parent;
	}

	/**
	 * placeMark
	 * @param {*} element 
	 * @param {*} range 
	 */
	placeMark(element, range) {
		let top, right, left;

		if (this.layout.name === "pre-paginated" ||
			this.settings.axis !== "horizontal") {
			let pos = range.getBoundingClientRect();
			top = pos.top;
			right = pos.right;
		} else {
			// Element might break columns, so find the left most element
			let rects = range.getClientRects();

			let rect;
			for (var i = 0; i != rects.length; i++) {
				rect = rects[i];
				if (!left || rect.left < left) {
					left = rect.left;
					// right = rect.right;
					right = Math.ceil(left / this.layout.props.pageWidth) * this.layout.props.pageWidth - (this.layout.gap / 2);
					top = rect.top;
				}
			}
		}

		element.style.top = `${top}px`;
		element.style.left = `${right}px`;
	}

	/**
	 * unhighlight
	 * @param {*} cfiRange 
	 */
	unhighlight(cfiRange) {
		let item;
		if (cfiRange in this.highlights) {
			item = this.highlights[cfiRange];

			this.pane.removeMark(item.mark);
			item.listeners.forEach((l) => {
				if (l) {
					item.element.removeEventListener("click", l);
					item.element.removeEventListener("touchstart", l);
				};
			});
			delete this.highlights[cfiRange];
		}
	}

	/**
	 * ununderline
	 * @param {*} cfiRange 
	 */
	ununderline(cfiRange) {
		let item;
		if (cfiRange in this.underlines) {
			item = this.underlines[cfiRange];
			this.pane.removeMark(item.mark);
			item.listeners.forEach((l) => {
				if (l) {
					item.element.removeEventListener("click", l);
					item.element.removeEventListener("touchstart", l);
				};
			});
			delete this.underlines[cfiRange];
		}
	}

	/**
	 * unmark
	 * @param {*} cfiRange 
	 */
	unmark(cfiRange) {
		let item;
		if (cfiRange in this.marks) {
			item = this.marks[cfiRange];
			this.element.removeChild(item.element);
			item.listeners.forEach((l) => {
				if (l) {
					item.element.removeEventListener("click", l);
					item.element.removeEventListener("touchstart", l);
				};
			});
			delete this.marks[cfiRange];
		}
	}

	/**
	 * destroy
	 */
	destroy() {

		for (let cfiRange in this.highlights) {
			this.unhighlight(cfiRange);
		}

		for (let cfiRange in this.underlines) {
			this.ununderline(cfiRange);
		}

		for (let cfiRange in this.marks) {
			this.unmark(cfiRange);
		}

		if (this.blobUrl) {
			revokeBlobUrl(this.blobUrl);
		}

		if (this.displayed) {
			this.displayed = false;

			this.removeListeners();
			this.contents.destroy();

			this.stopExpanding = true;
			this.element.removeChild(this.iframe);

			if (this.pane) {
				this.pane.element.remove();
				this.pane = undefined;
			}

			this.iframe = undefined;
			this.contents = undefined;

			this._textWidth = null;
			this._textHeight = null;
			this.width = null;
			this.height = null;
		}

		// this.element.style.height = "0px";
		// this.element.style.width = "0px";
	}
}

EventEmitter(IframeView.prototype);

export default IframeView;