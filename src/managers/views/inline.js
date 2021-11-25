import EventEmitter from "event-emitter";
import { extend, borders, uuid, isNumber, bounds, defer, qs, parse } from "../../utils/core";
import EpubCFI from "../../epubcfi";
import Contents from "../../contents";
import { EVENTS } from "../../utils/constants";
import { Pane, Highlight, Underline } from "marks-pane";

class InlineView {
	constructor(section, options) {
		this.settings = extend({
			ignoreClass: "",
			axis: undefined,
			direction: undefined,
			width: 0,
			height: 0,
			layout: undefined,
			//globalLayoutProperties: {},
		}, options || {});

		this.id = "inline-view";
		this.section = section;
		this.index = section.index;
		this.element = this.create();
		this.added = false;
		this.displayed = false;
		this.rendered = false;

		//this.width = this.settings.width;
		//this.height = this.settings.height;

		this.fixedWidth = 0;
		this.fixedHeight = 0;

		// Blank Cfi for Parsing
		this.epubcfi = new EpubCFI();

		this.layout = this.settings.layout;
		this.pane = undefined;
		this.highlights = {};
		this.underlines = {};
		this.marks = {};
	}

	create() {

		const element = document.createElement("div");
		element.id = this.id;
		element.style.overflow = "hidden";
		element.style.wordSpacing = "initial";
		element.style.lineHeight = "initial";
		element.style.visibility = "hidden";

		this.resizing = true;

		if (this.settings.axis === "horizontal") {
			element.style.width = "auto";
			element.style.height = "0";
		} else {
			element.style.width = "0";
			element.style.height = "auto";
		}

		this._width = 0;
		this._height = 0;
		this.added = true;
		this.elementBounds = bounds(element);

		return element;
	}

	render(request, show) {
		
		// view.onLayout = this.layout.format.bind(this.layout);

		// Fit to size of the container, apply padding
		this.size();

		// Render Chain
		return this.section.render(request).then(function (contents) {
			return this.load(contents);
		}.bind(this))
		// .then(function(doc){
		// 	return this.hooks.content.trigger(view, this);
		// }.bind(this))
		.then(function () {
			// this.settings.layout.format(view.contents);
			// return this.hooks.layout.trigger(view, this);
		}.bind(this))
		// .then(function(){
		// 	return this.display();
		// }.bind(this))
		// .then(function(){
		// 	return this.hooks.render.trigger(view, this);
		// }.bind(this))
		.then(function () {

			// apply the layout function to the contents
			this.layout.format(this.contents, this.section, this.axis);

			// Expand the iframe to the full size of the content
			// this.expand();

			// Listen for events that require an expansion of the iframe
			this.addListeners();

			if (show !== false) {
				//this.q.enqueue(function(view){
				this.show();
				//}, view);
			}
			// this.map = new Map(view, this.layout);
			//this.hooks.show.trigger(view, this);
			this.emit(EVENTS.VIEWS.RENDERED, this.section);

		}.bind(this)).catch(function (e) {
			this.emit(EVENTS.VIEWS.LOAD_ERROR, e);
		}.bind(this));
	}

	reset() {
		this._needsReframe = true;
	}

	// Determine locks base on settings
	size(_width, _height) {

		const width = _width || this.settings.width;
		const height = _height || this.settings.height;

		if (this.layout.name === "pre-paginated") {
			// TODO: check if these are different than the size set in chapter
			this.lock("both", width, height);
		} else if (this.settings.axis === "horizontal") {
			this.lock("height", width, height);
		} else {
			this.lock("width", width, height);
		}

		this.settings.width = width;
		this.settings.height = height;
	}

	// Lock an axis to element dimensions, taking borders into account
	lock(what, width, height) {

		const elBorders = borders(this.element);

		if (what == "width" && isNumber(width)) {
			this.lockedWidth = width - elBorders.width;
			//this.resize(this.lockedWidth, false); //  width keeps ratio correct
		}

		if (what == "height" && isNumber(height)) {
			this.lockedHeight = height - elBorders.height;
			//this.resize(false, this.lockedHeight);
		}

		if (what === "both" && isNumber(width) && isNumber(height)) {

			this.lockedWidth = width - elBorders.width;
			this.lockedHeight = height - elBorders.height;
			//this.resize(this.lockedWidth, this.lockedHeight);
		}
	}

	// Resize a single axis based on content dimensions
	expand(force) {

		let width = this.lockedWidth;
		let height = this.lockedHeight;

		let textWidth, textHeight;

		if (!this.element || this._expanding)
			return;

		this._expanding = true;

		// Expand Horizontally
		if (this.settings.axis === "horizontal") {
			width = this.contentWidth(textWidth);
		} // Expand Vertically
		else if (this.settings.axis === "vertical") {
			height = this.contentHeight(textHeight);
		}

		// Only Resize if dimensions have changed or
		// if Frame is still hidden, so needs reframing
		if (this._needsReframe || width != this._width || height != this._height) {
			this.resize(width, height);
		}

		this._expanding = false;
	}

	contentWidth(min) {
		return this.element.scrollWidth;
	}

	contentHeight(min) {
		return this.element.scrollHeight;
	}

	resize(width, height) {

		if (!this.element) return;

		if (isNumber(width)) {
			this.element.style.width = width + "px";
			this._width = width;
		}

		if (isNumber(height)) {
			this.element.style.height = height + "px";
			this._height = height;
		}

		this.prevBounds = this.elementBounds;
		this.elementBounds = bounds(this.element);

		let size = {
			width: this.elementBounds.width,
			height: this.elementBounds.height,
			widthDelta: this.elementBounds.width - this.prevBounds.width,
			heightDelta: this.elementBounds.height - this.prevBounds.height,
		};

		this.onResize(this, size);
		this.emit(EVENTS.VIEWS.RESIZED, size);
	}

	load(contents) {

		const loading = new defer();
		const loaded = loading.promise;
		const doc = parse(contents, "text/html"); // epub document
		const body = qs(doc, "body");
		/*
		var srcs = doc.querySelectorAll("[src]");

		Array.prototype.slice.call(srcs)
			.forEach(function(item) {
				var src = item.getAttribute("src");
				var assetUri = URI(src);
				var origin = assetUri.origin();
				var absoluteUri;

				if (!origin) {
					absoluteUri = assetUri.absoluteTo(this.section.url);
					item.src = absoluteUri;
				}
			}.bind(this));
		*/
		this.element.innerHTML = body.innerHTML;
		this.document = this.element.ownerDocument;
		this.window = this.document.defaultView;
		this.contents = new Contents(this.document, this.element, this.section.cfiBase, this.section.index);
		this.rendering = false;

		const uri_1 = this.section.url;
		const att_1 = [
			{
				name: "href",
				value: uri_1
			}
		];
		this.setElement("base", "base", att_1);

		const uri_2 = this.section.canonical;
		const att_2 = [
			{
				name: "rel",
				value: "canonical"
			},
			{
				name: "href",
				value: uri_2
			}
		];
		this.setElement("link", "link[rel='canonical']", att_2);

		const link = doc.querySelector("link[rel='stylesheet']");
		if (link) {
			const uri_3 = link.getAttribute("href");
			const att_3 = [
				{
					name: "rel",
					value: "stylesheet"
				},
				{
					name: "type",
					value: "text/css"
				},
				{
					name: "href",
					value: uri_3
				}
			];
			this.setElement("link", "link[rel='stylesheet'][href='" + uri_3 + "']", att_3);
		}

		loading.resolve(this.contents);

		return loaded;
	}

	setElement(tagName, selectors, attributes) {

		let element = this.document.querySelector(selectors);
		if (element) {
			this.setValues(element, attributes);
		} else {
			element = this.document.createElement(tagName);
			this.setValues(element, attributes);
			this.document.querySelector("head").appendChild(element);
		}
	}

	setValues(element, attributes) {

		for (let i = 0; i < attributes.length; i++) {

			element.setAttribute(attributes[i].name, attributes[i].value);
		}
	}

	setLayout(layout) {
		this.layout = layout;
	}

	resizeListenters() {
		// Test size again
		// clearTimeout(this.expanding);
		// this.expanding = setTimeout(this.expand.bind(this), 350);
	}

	addListeners() {
		//TODO: Add content listeners for expanding
	}

	removeListeners(layoutFunc) {
		//TODO: remove content listeners for expanding
	}

	display(request) {

		const displayed = new defer();

		if (!this.displayed) {

			this.render(request).then(function () {

				this.emit(EVENTS.VIEWS.DISPLAYED, this);
				this.onDisplayed(this);

				this.displayed = true;

				displayed.resolve(this);

			}.bind(this));

		} else {
			displayed.resolve(this);
		}

		return displayed.promise;
	}

	show() {

		this.element.style.visibility = "visible";
		this.emit(EVENTS.VIEWS.SHOWN, this);
	}

	hide() {

		this.element.style.visibility = "hidden";
		this.stopExpanding = true;
		this.emit(EVENTS.VIEWS.HIDDEN, this);
	}

	offset() {
		return {
			top: this.element.offsetTop,
			left: this.element.offsetLeft
		}
	}

	width() {
		return this._width;
	}

	height() {
		return this._height;
	}

	position() {
		return this.element.getBoundingClientRect();
	}

	locationOf(target) {
		//const parentPos = this.element.getBoundingClientRect();
		const targetPos = this.contents.locationOf(target, this.settings.ignoreClass);

		// return {
		// 	"left": window.scrollX + parentPos.left + targetPos.left,
		// 	"top": window.scrollY + parentPos.top + targetPos.top
		// };
		return {
			"left": targetPos.left,
			"top": targetPos.top
		}
	}

	onDisplayed(view) {
		// Stub, override with a custom functions
	}

	onResize(view, e) {
		// Stub, override with a custom functions
	}

	bounds() {
		if (!this.elementBounds) {
			this.elementBounds = bounds(this.element);
		}
		return this.elementBounds;
	}

	highlight(cfiRange, data = {}, cb, className = "epubjs-hl", styles = {}) {

		if (!this.contents) {
			return;
		}

		const attributes = Object.assign({
			"fill": "yellow",
			"fill-opacity": "0.3",
			"mix-blend-mode": "multiply"
		}, styles);

		let range = this.contents.range(cfiRange);
		let emitter = () => {
			this.emit(EVENTS.VIEWS.MARK_CLICKED, cfiRange, data);
		};

		data["epubcfi"] = cfiRange;

		if (!this.pane) {
			this.pane = new Pane(this.element);
		}

		let m = new Highlight(range, className, data, attributes);
		let h = this.pane.addMark(m);

		this.highlights[cfiRange] = {
			"mark": h,
			"element": h.element,
			"listeners": [emitter, cb]
		};

		h.element.setAttribute("ref", className);
		h.element.addEventListener("click", emitter);
		h.element.addEventListener("touchstart", emitter);

		if (cb) {
			h.element.addEventListener("click", cb);
			h.element.addEventListener("touchstart", cb);
		}
		return h;
	}

	underline(cfiRange, data = {}, cb, className = "epubjs-ul", styles = {}) {

		if (!this.contents) {
			return;
		}

		const attributes = Object.assign({
			"stroke": "black",
			"stroke-opacity": "0.3",
			"mix-blend-mode": "multiply"
		}, styles);

		let range = this.contents.range(cfiRange);
		let emitter = () => {
			this.emit(EVENTS.VIEWS.MARK_CLICKED, cfiRange, data);
		};

		data["epubcfi"] = cfiRange;

		if (!this.pane) {
			this.pane = new Pane(this.element);
		}

		let m = new Underline(range, className, data, attributes);
		let h = this.pane.addMark(m);

		this.underlines[cfiRange] = {
			"mark": h,
			"element": h.element,
			"listeners": [emitter, cb]
		};

		h.element.setAttribute("ref", className);
		h.element.addEventListener("click", emitter);
		h.element.addEventListener("touchstart", emitter);

		if (cb) {
			h.element.addEventListener("click", cb);
			h.element.addEventListener("touchstart", cb);
		}
		return h;
	}

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
		this.marks[cfiRange] = {
			"element": mark,
			"range": range,
			"listeners": [emitter, cb]
		};

		return parent;
	}

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
		
		if (this.displayed) {
			this.displayed = false;

			this.removeListeners();

			this.stopExpanding = true;
			this.displayed = false;

			this._textWidth = null;
			this._textHeight = null;
			this._width = null;
			this._height = null;
		}
		// this.element.style.height = "0px";
		// this.element.style.width = "0px";
	}
}

EventEmitter(InlineView.prototype);

export default InlineView;