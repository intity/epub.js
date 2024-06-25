import EventEmitter from "event-emitter";
import EpubCFI from "./epubcfi";
import Mapping from "./mapping";
import { replaceLinks } from "./utils/replacements";
import { EPUBJS_VERSION, EVENTS, DOM_EVENTS } from "./utils/constants";
import { isNumber, prefixed, borders, defaults } from "./utils/core";

const hasNavigator = typeof (navigator) !== "undefined";
const isChrome = hasNavigator && /Chrome/.test(navigator.userAgent);
const isWebkit = hasNavigator && !isChrome && /AppleWebKit/.test(navigator.userAgent);

/**
 * Handles DOM manipulation, queries and events for View contents
 */
class Contents {
	/**
	 * Constructor
	 * @param {document} doc Document
	 * @param {element} content Parent Element (typically Body)
	 * @param {Section} section Section object reference
	 */
	constructor(doc, content, section) {
		/**
		 * @member {EpubCFI} epubcfi Blank Cfi for Parsing
		 * @memberof Contents
		 * @readonly
		 */
		this.epubcfi = new EpubCFI();
		this.document = doc;
		this.documentElement = this.document.documentElement;
		/**
		 * @member {object} content document.body by current location
		 * @memberof Contents
		 * @readonly
		 */
		this.content = content || this.document.body;
		/**
		 * @member {object} contentRect
		 * @memberof Contents
		 * @readonly
		 */
		this.contentRect = {
			bottom: 0,
			height: 0,
			left: 0,
			right: 0,
			top: 0,
			width: 0,
			x: 0,
			y: 0,
		};
		/**
		 * @member {Section} section
		 * @memberof Contents
		 * @readonly
		 */
		this.section = section;
		this.scripts = new Map();
		this.styles = new Map();
		this.active = true;
		this.window = this.document.defaultView;

		this.epubReadingSystem("epub.js", EPUBJS_VERSION);
		this.listeners();
	}

	/**
	 * Get DOM events that are listened for and passed along
	 */
	static get listenedEvents() {

		return DOM_EVENTS;
	}

	/**
	 * Get or Set width
	 * @param {number} [w]
	 * @returns {number} width
	 */
	width(w) {

		const frame = this.content;

		if (w && isNumber(w)) {
			w = w + "px";
		}

		if (w) {
			frame.style.width = w;
		}

		return parseInt(this.window.getComputedStyle(frame)["width"]);
	}

	/**
	 * Get or Set height
	 * @param {number} [h]
	 * @returns {number} height
	 */
	height(h) {

		const frame = this.content;

		if (h && isNumber(h)) {
			h = h + "px";
		}

		if (h) {
			frame.style.height = h;
		}

		return parseInt(this.window.getComputedStyle(frame)["height"]);
	}

	/**
	 * Get or Set width of the contents
	 * @param {number} [w]
	 * @returns {number} width
	 */
	contentWidth(w) {

		const content = this.content || this.document.body;

		if (w && isNumber(w)) {
			w = w + "px";
		}

		if (w) {
			content.style.width = w;
		}

		return parseInt(this.window.getComputedStyle(content)["width"]);
	}

	/**
	 * Get or Set height of the contents
	 * @param {number} [h]
	 * @returns {number} height
	 */
	contentHeight(h) {

		const content = this.content;

		if (h && isNumber(h)) {
			h = h + "px";
		}

		if (h) {
			content.style.height = h;
		}

		return parseInt(this.window.getComputedStyle(content)["height"]);
	}

	/**
	 * Get size of the text using Range
	 * @returns {{ width: number, height: number }}
	 */
	textSize() {

		const range = this.document.createRange();
		const content = this.content;
		// Select the contents of frame
		range.selectNodeContents(content);
		// get rect of the text content
		const rect = range.getBoundingClientRect();
		const border = borders(content);
		let width = rect.width;
		let height = rect.height;
		if (border) {
			if (border.width) {
				width += border.width;
			}
			if (border.height) {
				height += border.height;
			}
		}

		return {
			width: Math.round(width),
			height: Math.round(height)
		}
	}

	/**
	 * Get documentElement scrollWidth
	 * @returns {number} width
	 */
	scrollWidth() {

		return this.documentElement.scrollWidth;
	}

	/**
	 * Get documentElement scrollHeight
	 * @returns {number} height
	 */
	scrollHeight() {

		return this.documentElement.scrollHeight;
	}

	/**
	 * Set overflow css style of the contents
	 * @param {string} [overflow]
	 */
	overflow(overflow) {

		if (overflow) {
			this.documentElement.style.overflow = overflow;
		}

		return this.window.getComputedStyle(this.documentElement)["overflow"];
	}

	/**
	 * Set overflowX css style of the documentElement
	 * @param {string} [overflow]
	 */
	overflowX(overflow) {

		if (overflow) {
			this.documentElement.style.overflowX = overflow;
		}

		return this.window.getComputedStyle(this.documentElement)["overflowX"];
	}

	/**
	 * Set overflowY css style of the documentElement
	 * @param {string} [overflow]
	 */
	overflowY(overflow) {

		if (overflow) {
			this.documentElement.style.overflowY = overflow;
		}

		return this.window.getComputedStyle(this.documentElement)["overflowY"];
	}

	/**
	 * Set Css styles on the contents element (typically Body)
	 * @param {string} property
	 * @param {string} value
	 * @param {boolean} [priority] set as "important"
	 */
	css(property, value, priority) {

		const content = this.content;

		if (value) {
			content.style.setProperty(property, value, priority ? "important" : "");
		} else {
			content.style.removeProperty(property);
		}

		return this.window.getComputedStyle(content)[property];
	}

	/**
	 * Get or Set the viewport element
	 * @param {object} [options]
	 * @param {string} [options.width]
	 * @param {string} [options.height]
	 * @param {string} [options.scale]
	 * @param {string} [options.minimum]
	 * @param {string} [options.maximum]
	 * @param {string} [options.scalable]
	 */
	viewport(options) {

		const parsed = {
			width: undefined,
			height: undefined,
			scale: undefined,
			minimum: undefined,
			maximum: undefined,
			scalable: undefined
		};
		let viewport = this.document.querySelector("meta[name='viewport']");

		/***
		 * check for the viewport size
		 * <meta name="viewport" content="width=1024,height=697" />
		 */
		if (viewport && viewport.hasAttribute("content")) {

			const content = viewport.getAttribute("content");
			const width = content.match(/width\s*=\s*([^,]*)/);
			const height = content.match(/height\s*=\s*([^,]*)/);
			const scale = content.match(/initial-scale\s*=\s*([^,]*)/);
			const minimum = content.match(/minimum-scale\s*=\s*([^,]*)/);
			const maximum = content.match(/maximum-scale\s*=\s*([^,]*)/);
			const scalable = content.match(/user-scalable\s*=\s*([^,]*)/);

			if (width && width.length && typeof width[1] !== "undefined") {
				parsed.width = width[1];
			}
			if (height && height.length && typeof height[1] !== "undefined") {
				parsed.height = height[1];
			}
			if (scale && scale.length && typeof scale[1] !== "undefined") {
				parsed.scale = scale[1];
			}
			if (minimum && minimum.length && typeof minimum[1] !== "undefined") {
				parsed.minimum = minimum[1];
			}
			if (maximum && maximum.length && typeof maximum[1] !== "undefined") {
				parsed.maximum = maximum[1];
			}
			if (scalable && scalable.length && typeof scalable[1] !== "undefined") {
				parsed.scalable = scalable[1];
			}
		}

		const settings = defaults(options || {}, parsed);
		const newContent = [];

		if (options) {
			if (settings.width) {
				newContent.push("width=" + settings.width);
			}

			if (settings.height) {
				newContent.push("height=" + settings.height);
			}

			if (settings.scale) {
				newContent.push("initial-scale=" + settings.scale);
			}

			if (settings.scalable === "no") {
				newContent.push("minimum-scale=" + settings.scale);
				newContent.push("maximum-scale=" + settings.scale);
				newContent.push("user-scalable=" + settings.scalable);
			} else {

				if (settings.scalable) {
					newContent.push("user-scalable=" + settings.scalable);
				}

				if (settings.minimum) {
					newContent.push("minimum-scale=" + settings.minimum);
				}

				if (settings.maximum) {
					newContent.push("minimum-scale=" + settings.maximum);
				}
			}

			if (viewport === null) {
				viewport = this.document.createElement("meta");
				viewport.setAttribute("name", "viewport");
				this.document.querySelector("head").appendChild(viewport);
			}

			viewport.setAttribute("content", newContent.join(", "));
			this.window.scrollTo(0, 0);
		}

		return settings;
	}

	/**
	 * Event emitter for when the contents has expanded
	 * @private
	 */
	expand() {

		this.emit(EVENTS.CONTENTS.EXPAND);
	}

	/**
	 * content resize event handler
	 * @param {object[]} entries
	 * @private
	 */
	resize(entries) {

		let changed = false;
		const cmp = (rect) => Object.keys(this.contentRect).forEach(p => {
			if (this.contentRect[p] !== rect[p] && rect[p] !== void 0) {
				this.contentRect[p] = rect[p];
				changed = true;
			}
		});
		entries.forEach(entry => entry.contentRect && cmp(entry.contentRect));
		changed && this.emit(EVENTS.CONTENTS.RESIZE, this.contentRect);
	}

	/**
	 * Get the documentElement
	 * @returns {element} documentElement
	 */
	root() {

		if (!this.document) return null;
		return this.document.documentElement;
	}

	/**
	 * Get the location offset of a EpubCFI or an #id
	 * @param {string | EpubCFI} target
	 * @param {string} [ignoreClass] for the cfi
	 * @returns {object} target position left and top
	 */
	locationOf(target, ignoreClass) {

		const targetPos = { "left": 0, "top": 0 };

		if (!this.document) return targetPos;
		let position;
		if (this.epubcfi.isCfiString(target)) {

			const range = new EpubCFI(target).toRange(this.document, ignoreClass);

			if (range) {
				try {
					if (!range.endContainer ||
						(range.startContainer == range.endContainer
							&& range.startOffset == range.endOffset)) {
						// If the end for the range is not set, it results in collapsed becoming
						// true. This in turn leads to inconsistent behaviour when calling
						// getBoundingRect. Wrong bounds lead to the wrong page being displayed.
						// https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/15684911/
						let pos = range.startContainer.textContent.indexOf(" ", range.startOffset);
						if (pos == -1) {
							pos = range.startContainer.textContent.length;
						}
						range.setEnd(range.startContainer, pos);
					}
				} catch (e) {
					console.error("setting end offset to start container length failed", e);
				}

				if (range.startContainer.nodeType === Node.ELEMENT_NODE) {
					position = range.startContainer.getBoundingClientRect();
					targetPos.left = position.left;
					targetPos.top = position.top;
				} else {
					// Webkit does not handle collapsed range bounds correctly
					// https://bugs.webkit.org/show_bug.cgi?id=138949

					// Construct a new non-collapsed range
					if (isWebkit) {
						const container = range.startContainer;
						const newRange = new Range();
						try {
							if (container.nodeType === Node.ELEMENT_NODE) {
								position = container.getBoundingClientRect();
							} else if (range.startOffset + 2 < container.length) {
								newRange.setStart(container, range.startOffset);
								newRange.setEnd(container, range.startOffset + 2);
								position = newRange.getBoundingClientRect();
							} else if (range.startOffset - 2 > 0) {
								newRange.setStart(container, range.startOffset - 2);
								newRange.setEnd(container, range.startOffset);
								position = newRange.getBoundingClientRect();
							} else { // empty, return the parent element
								position = container.parentNode.getBoundingClientRect();
							}
						} catch (e) {
							console.error(e, e.stack);
						}
					} else {
						position = range.getBoundingClientRect();
					}
				}
			}

		} else if (typeof target === "string" && target.indexOf("#") > -1) {

			const id = target.substring(target.indexOf("#") + 1);
			const el = this.document.getElementById(id);
			if (el) {
				if (isWebkit) {
					// Webkit reports incorrect bounding rects in Columns
					const newRange = new Range();
					newRange.selectNode(el);
					position = newRange.getBoundingClientRect();
				} else {
					position = el.getBoundingClientRect();
				}
			}
		}

		if (position) {
			targetPos.left = position.left;
			targetPos.top = position.top;
		}

		return targetPos;
	}

	/**
	 * Get injected stylesheet node
	 * @param {string} key 
	 * @returns {Node}
	 * @private
	 */
	getStylesheetNode(key) {

		if (!this.document) return null;

		const id = `epubjs-injected-css-${key}`;
		let node = this.styles.get(id);
		if (typeof node === "undefined") {
			node = this.document.createElement("style");
			node.id = id;
			this.document.head.appendChild(node);
		}
		return node;
	}

	/**
	 * Append a stylesheet link to the document head
	 * @param {string} src url
	 * @param {string} key 
	 * @example appendStylesheet("/pach/to/stylesheet.css", "common")
	 * @example appendStylesheet("https://example.com/to/stylesheet.css", "common")
	 * @returns {Promise}
	 */
	appendStylesheet(src, key) {

		return new Promise((resolve, reject) => {

			if (!this.document) {
				reject(new Error("Document cannot be null"));
				return;
			}

			const id = `epubjs-injected-css-${key}`;
			let node = this.styles.get(id);
			if (typeof node === "undefined") {
				node = this.document.createElement("link");
				node.rel = "stylesheet";
				node.type = "text/css";
				node.href = src;
				node.onload = () => {
					resolve(node);
				};
				node.onerror = () => {
					reject(new Error(`Failed to load source: ${src}`));
				};
				this.document.head.appendChild(node);
			}
			this.styles.set(id, node);
		});
	}

	/**
	 * Remove a stylesheet link from the document head
	 * @param {string} key 
	 * @returns {boolean}
	 */
	removeStylesheet(key) {

		if (!this.document) {
			return false;
		}
		const id = `epubjs-injected-css-${key}`;
		const node = this.styles.get(id);
		if (typeof node === "undefined") {
			return false;
		}
		this.document.head.removeChild(node);
		return this.styles.delete(id);
	}

	/**
	 * Clear all injected stylesheets
	 */
	clearStylesheets() {

		this.styles.forEach((node) => {
			this.document.head.removeChild(node);
		});
		this.styles.clear();
	}

	/**
	 * Append serialized stylesheet
	 * @param {string} css
	 * @param {string} key
	 * @example appendSerializedCSS("h1 { font-size: 32px; color: magenta; }", "common")
	 * @description If the key is the same, the CSS will be replaced instead of inserted
	 */
	appendSerializedCSS(css, key) {

		if (!this.document) return;

		const node = this.getStylesheetNode(key);
		node.innerHTML = css;
		this.styles.set(node.id, node);
	}

	/**
	 * Append stylesheet rules to a generate stylesheet
	 * @link https://github.com/desirable-objects/json-to-css
	 * @param {object} rules
	 * @param {string} key
	 * @example appendStylesheetRules({ h1: { "font-size": "1.5em" }}, "common")
	 * @description If the key is the same, the CSS will be replaced instead of inserted
	 */
	appendStylesheetRules(rules, key) {

		if (!this.document) return;

		const node = this.getStylesheetNode(key);

		Object.keys(rules).forEach((selector) => {
			const value = rules[selector];
			const index = node.sheet.cssRules.length;
			const items = Object.keys(value).map((k) => {
				return `${k}:${value[k]}`;
			}).join(";");
			node.sheet.insertRule(`${selector}{${items}}`, index);
		});

		this.styles.set(node.id, node);
	}

	/**
	 * Append a script node to the document head
	 * @param {string} src url
	 * @param {string} key 
	 * @example appendScript("/path/to/script.js", "common")
	 * @example appendScript("https://examples.com/to/script.js", "common")
	 * @returns {Promise} loaded
	 */
	appendScript(src, key) {

		return new Promise((resolve, reject) => {

			if (!this.document) {
				reject(new Error("Document cannot be null"));
				return;
			}

			const id = `epubjs-injected-src-${key}`;
			let node = this.styles.get(id);
			if (typeof node === "undefined") {
				node = this.document.createElement("script");
				node.type = "text/javascript";
				node.src = src;
				node.onload = () => {
					resolve(node);
				};
				node.onerror = () => {
					reject(new Error(`Failed to load source: ${src}`));
				};
				this.document.head.appendChild(node);
			}
			this.scripts.set(id, node);
		});
	}

	/**
	 * Remove a script node from the document head
	 * @param {string} key 
	 * @returns {boolean}
	 */
	removeScript(key) {

		if (!this.document) {
			return false;
		}
		const id = `epubjs-injected-src-${key}`;
		const node = this.scripts.get(id);
		if (typeof node === "undefined") {
			return false;
		}
		this.document.head.removeChild(node);
		return this.scripts.remove(id);
	}

	/**
	 * Clear all injected scripts
	 */
	clearScripts() {

		this.scripts.forEach((node) => {
			this.document.head.removeChild(node);
		})
		this.scripts.clear();
	}

	/**
	 * Append a class to the contents container
	 * @param {string} className
	 */
	appendClass(className) {

		if (!this.document) return;

		const content = this.content;

		if (content) {
			content.classList.add(className);
		}
	}

	/**
	 * Remove a class from the contents container
	 * @param {string} className
	 */
	removeClass(className) {

		if (!this.document) return;

		const content = this.content;

		if (content) {
			content.classList.remove(className);
		}
	}

	/**
	 * Get a Dom Range from EpubCFI
	 * @param {EpubCFI} cfi
	 * @param {string} [ignoreClass]
	 * @returns {Range} range
	 */
	range(cfi, ignoreClass) {

		const epubcfi = new EpubCFI(cfi);
		return epubcfi.toRange(this.document, ignoreClass);
	}

	/**
	 * Get an EpubCFI from a Dom Range
	 * @param {Range} range
	 * @param {string} [ignoreClass]
	 * @returns {EpubCFI} cfi
	 */
	cfiFromRange(range, ignoreClass) {

		return new EpubCFI(range, this.section.cfiBase, ignoreClass).toString();
	}

	/**
	 * Get an EpubCFI from a Dom node
	 * @param {Node} node
	 * @param {string} [ignoreClass]
	 * @returns {EpubCFI} cfi
	 */
	cfiFromNode(node, ignoreClass) {

		return new EpubCFI(node, this.section.cfiBase, ignoreClass).toString();
	}

	/**
	 * map
	 * @param {Layout} layout 
	 * @todo TODO: find where this is used - remove?
	 * @returns {Array}
	 */
	map(layout) {

		const map = new Mapping(layout);
		return map.section();
	}

	/**
	 * Size the contents to a given width and height
	 * @param {number} [width]
	 * @param {number} [height]
	 * @param {string} [dir]
	 */
	size(width, height, dir) {

		const viewport = { scale: 1.0, scalable: "no" };

		this.setLayoutStyle("scrolling");

		if (width >= 0) {
			this.width(width);
			viewport.width = width;
			this.css("padding", "0 " + (width / 12) + "px");
		}

		if (height >= 0) {
			this.height(height);
			viewport.height = height;
		}

		this.css("margin", "0");
		this.css("box-sizing", "border-box");
		this.viewport(viewport);
		this.direction(dir);
	}

	/**
	 * Apply columns to the contents for pagination
	 * @param {number} width
	 * @param {number} height
	 * @param {number} columnWidth
	 * @param {number} gap
	 * @param {string} dir
	 */
	columns(width, height, columnWidth, gap, dir) {

		const COLUMN_AXIS = prefixed("column-axis");
		const COLUMN_GAP = prefixed("column-gap");
		const COLUMN_WIDTH = prefixed("column-width");
		const COLUMN_FILL = prefixed("column-fill");

		const AXIS_H = "horizontal";
		const AXIS_V = "vertical";
		const writingMode = this.writingMode();
		const axis = (writingMode.indexOf(AXIS_V) === 0) ? AXIS_V : AXIS_H;

		this.setLayoutStyle("paginated");
		this.direction(dir);
		this.width(width);
		this.height(height);

		// Deal with Mobile trying to scale to viewport
		this.viewport({
			width: width,
			height: height,
			scale: 1.0,
			scalable: "no"
		});

		// TODO: inline-block needs more testing
		// Fixes Safari column cut offs, but causes RTL issues
		// this.css("display", "inline-block");

		this.css("overflow-y", "hidden");
		this.css("margin", "0", true);

		if (axis === AXIS_V) {
			this.css("padding-top", (gap / 2) + "px", true);
			this.css("padding-bottom", (gap / 2) + "px", true);
			this.css("padding-left", "20px");
			this.css("padding-right", "20px");
			this.css(COLUMN_AXIS, AXIS_V);
		} else {
			this.css("padding-top", "20px");
			this.css("padding-bottom", "20px");
			this.css("padding-left", (gap / 2) + "px", true);
			this.css("padding-right", (gap / 2) + "px", true);
			this.css(COLUMN_AXIS, AXIS_H);
		}

		this.css("box-sizing", "border-box");
		this.css("max-width", "inherit");
		this.css(COLUMN_FILL, "auto");
		this.css(COLUMN_GAP, gap + "px");
		this.css(COLUMN_WIDTH, columnWidth + "px");

		// Fix glyph clipping in WebKit
		// https://github.com/futurepress/epub.js/issues/983
		this.css("-webkit-line-box-contain", "block glyphs replaced");
	}

	/**
	 * Scale contents from center
	 * @param {number} scale
	 * @param {number} offsetX
	 * @param {number} offsetY
	 */
	scaler(scale, offsetX, offsetY) {

		const scaleStr = "scale(" + scale + ")";
		let translateStr = "";
		// this.css("position", "absolute"));
		this.css("transform-origin", "top left");

		if (offsetX >= 0 || offsetY >= 0) {
			translateStr = " translate(" + (offsetX || 0) + "px, " + (offsetY || 0) + "px )";
		}

		this.css("transform", scaleStr + translateStr);
	}

	/**
	 * Fit contents into a fixed width and height
	 * @param {number} width
	 * @param {number} height
	 */
	fit(width, height, section) {

		const viewport = this.viewport();
		const viewportWidth = parseInt(viewport.width);
		const viewportHeight = parseInt(viewport.height);
		const widthScale = width / viewportWidth;
		const heightScale = height / viewportHeight;
		const scale = widthScale < heightScale ? widthScale : heightScale;

		// the translate does not work as intended, elements can end up unaligned
		// var offsetY = (height - (viewportHeight * scale)) / 2;
		// var offsetX = 0;
		// if (this.section.index % 2 === 1) {
		// 	offsetX = width - (viewportWidth * scale);
		// }

		this.setLayoutStyle("paginated");

		// scale needs width and height to be set
		this.width(viewportWidth);
		this.height(viewportHeight);
		this.overflow("hidden");

		// Scale to the correct size
		this.scaler(scale, 0, 0);
		// this.scaler(scale, offsetX > 0 ? offsetX : 0, offsetY);

		// background images are not scaled by transform
		this.css("background-size", viewportWidth * scale + "px " + viewportHeight * scale + "px");

		this.css("background-color", "transparent");
		if (section && section.properties.includes("page-spread-left")) {
			// set margin since scale is weird
			const marginLeft = width - (viewportWidth * scale);
			this.css("margin-left", marginLeft + "px");
		}
	}

	/**
	 * Set the direction of the text
	 * @param {string} [dir='ltr'] values: `"ltr"` OR `"rtl"`
	 */
	direction(dir = "ltr") {

		if (this.documentElement) {
			this.documentElement.dir = dir;
		}
	}

	/**
	 * mapPage
	 * @param {string} cfiBase 
	 * @param {Layout} layout 
	 * @param {number} start 
	 * @param {number} end 
	 * @param {boolean} dev 
	 * @returns {any}
	 */
	mapPage(cfiBase, layout, start, end, dev) {

		const mapping = new Mapping(layout, dev);
		return mapping.page(this, cfiBase, start, end);
	}

	/**
	 * Set the writingMode of the text
	 * @param {string} [mode='horizontal-tb'] `"horizontal-tb"` OR `"vertical-rl"` OR `"vertical-lr"`
	 */
	writingMode(mode = "horizontal-tb") {

		const WRITING_MODE = prefixed("writing-mode");

		if (this.documentElement) {
			this.documentElement.style[WRITING_MODE] = mode;
		}

		return this.window.getComputedStyle(this.documentElement)[WRITING_MODE] || "";
	}

	/**
	 * Set the layoutStyle of the content
	 * @param {string} [value='paginated'] values: `"paginated"` OR `"scrolling"`
	 * @private
	 */
	setLayoutStyle(value = "paginated") {

		this.layoutStyle = value;
		navigator.epubReadingSystem.layoutStyle = value;
		return value;
	}

	/**
	 * Add the epubReadingSystem object to the navigator
	 * @param {string} name
	 * @param {string} version
	 * @private
	 */
	epubReadingSystem(name, version) {

		navigator.epubReadingSystem = {
			name: name,
			version: version,
			layoutStyle: "paginated",
			hasFeature: feature => {
				switch (feature) {
					case "dom-manipulation":
						return true;
					case "layout-changes":
						return true;
					case "touch-events":
						return true;
					case "mouse-events":
						return true;
					case "keyboard-events":
						return true;
					case "spine-scripting":
						return false;
					default:
						return false;
				}
			}
		};
		return navigator.epubReadingSystem;
	}

	//-- events --//

	/**
	 * Add DOM listeners
	 * @private
	 */
	listeners() {

		this.appendListeners();
		// this.imageLoadListeners();
		// this.mediaQueryListeners();
		// this.fontLoadListeners();
		// this.transitionListeners();
		// this.mutationListener();
	}

	/**
	 * Append listeners
	 * @private
	 */
	appendListeners() {

		if (!this.document) return;
		//-- DOM EVENTS
		DOM_EVENTS.forEach(eventName => {
			this.document.addEventListener(eventName,
				this.triggerEvent.bind(this), { passive: true });
		}, this);
		//-- SELECTION
		this.document.addEventListener("selectionchange",
			this.selectionHandler.bind(this), { passive: true }
		);
		//-- RESIZE
		this.resizeObserver = new ResizeObserver((e) => {
			requestAnimationFrame(() => this.resize(e));
		});
		this.resizeObserver.observe(this.document.documentElement);
		//-- LINK CLICKED
		replaceLinks(this.content, (href) => {
			this.emit(EVENTS.CONTENTS.LINK_CLICKED, href);
		});
	}

	/**
	 * Remove listeners
	 * @private
	 */
	removeListeners() {

		if (!this.document) return;
		//-- DOM EVENTS
		DOM_EVENTS.forEach(eventName => {
			this.document.removeEventListener(eventName,
				this.triggerEvent.bind(this), { passive: true });
		}, this);
		//-- SELECTION
		this.document.removeEventListener("selectionchange",
			this.selectionHandler.bind(this), { passive: true }
		);
		//-- RESIZE
		if (this.resizeObserver) {
			this.resizeObserver.disconnect();
		}
		//-- MUTATION
		if (this.mutationObserver) {
			this.mutationObserver.disconnect();
		}
	}

	/**
	 * Emit passed browser events
	 * @private
	 */
	triggerEvent(e) {

		this.emit(e.type, e);
	}

	/**
	 * Handle getting text on selection
	 * @private
	 */
	selectionHandler(e) {

		if (this.selectionEndTimeout) {
			clearTimeout(this.selectionEndTimeout);
		}

		this.selectionEndTimeout = setTimeout(() => {
			const selection = this.window.getSelection();
			if (!(selection && selection.rangeCount > 0))
				return;
			const range = selection.getRangeAt(0);
			if (!range.collapsed) {
				const cfirange = new EpubCFI(range, this.section.cfiBase).toString();
				this.emit(EVENTS.CONTENTS.SELECTED, cfirange);
				this.emit(EVENTS.CONTENTS.SELECTED_RANGE, range);
			}
		}, 250);
	}

	/**
	 * Test if images are loaded or add listener for when they load
	 * @private
	 */
	imageLoadListeners() {

		const images = this.document.querySelectorAll("img");
		for (let i = 0; i < images.length; i++) {
			const img = images[i];

			if (typeof img.naturalWidth !== "undefined" &&
				img.naturalWidth === 0) {
				img.onload = this.expand.bind(this);
			}
		}
	}

	/**
	 * Listen for media query changes and emit 'expand' event
	 * Adapted from: https://github.com/tylergaw/media-query-events/blob/master/js/mq-events.js
	 * @private
	 */
	mediaQueryListeners() {

		const sheets = this.document.styleSheets;
		const mediaChangeHandler = (m) => {
			if (m.matches) {
				setTimeout(this.expand.bind(this), 1);
			}
		};

		for (let i = 0; i < sheets.length; i += 1) {
			let rules;
			// Firefox errors if we access cssRules cross-domain
			try {
				rules = sheets[i].cssRules;
			} catch (e) {
				console.error(e);
				return;
			}
			if (!rules) return; // Stylesheets changed
			for (let j = 0; j < rules.length; j += 1) {
				if (rules[j].media) {
					const mql = this.window.matchMedia(rules[j].media.mediaText);
					mql.onchange = mediaChangeHandler;
				}
			}
		}
	}

	/**
	 * Listen for font load and check for resize when loaded (unused)
	 * @private
	 */
	fontLoadListeners() {

		if (!this.document || !this.document.fonts) {
			return;
		}

		//this.document.fonts.ready.then(() => this.resize());
	}

	/**
	 * Use css transitions to detect resize (unused)
	 * @private
	 */
	transitionListeners() {

		const body = this.content;

		body.style["transitionProperty"] = "font, font-size, font-size-adjust, font-stretch, font-variation-settings, font-weight, width, height";
		body.style["transitionDuration"] = "0.001ms";
		body.style["transitionTimingFunction"] = "linear";
		body.style["transitionDelay"] = "0";

		//this.document.addEventListener('transitionend', this.resize.bind(this));
	}

	/**
	 * Use MutationObserver to listen for changes in 
	 * the DOM and check for resize (unused)
	 * @private
	 */
	mutationListener() {

		const mutation = (mutations, observer) => {

			mutations.forEach(m => {
				//console.log(m)
			});
		}

		this.mutationObserver = new MutationObserver(mutation);
		this.mutationObserver.observe(this.document, {
			attributes: true,
			childList: true,
			characterData: true,
			subtree: true
		});
	}

	/**
	 * destroy
	 */
	destroy() {

		this.removeListeners();
		this.clearStylesheets();
		this.styles = undefined;
		this.clearScripts();
		this.scripts = undefined;
	}
}

EventEmitter(Contents.prototype);

export default Contents;