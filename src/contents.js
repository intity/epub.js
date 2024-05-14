import EventEmitter from "event-emitter";
import EpubCFI from "./epubcfi";
import Mapping from "./mapping";
import { replaceLinks } from "./utils/replacements";
import { EPUBJS_VERSION, EVENTS, DOM_EVENTS } from "./utils/constants";
import { isNumber, prefixed, borders, defaults } from "./utils/core";

const hasNavigator = typeof (navigator) !== "undefined";
const isChrome = hasNavigator && /Chrome/.test(navigator.userAgent);
const isWebkit = hasNavigator && !isChrome && /AppleWebKit/.test(navigator.userAgent);
const ELEMENT_NODE = 1;
const TEXT_NODE = 3;

/**
 * Handles DOM manipulation, queries and events for View contents
 */
class Contents {
	/**
	 * Constructor
	 * @param {document} doc Document
	 * @param {element} content Parent Element (typically Body)
	 * @param {string} cfiBase Section component of CFIs
	 * @param {number} sectionIndex Index in Spine of Conntent's Section
	 */
	constructor(doc, content, cfiBase, sectionIndex) {
		/**
		 * @member {EpubCFI} epubcfi Blank Cfi for Parsing
		 * @memberof Contents
		 * @readonly
		 */
		this.epubcfi = new EpubCFI();
		this.document = doc;
		this.documentElement = this.document.documentElement;
		this.content = content || this.document.body;
		this.content.style.overflow = "hidden";
		this.window = this.document.defaultView;
		this._size = {
			width: 0,
			height: 0
		};
		/**
		 * @member {number} sectionIndex
		 * @memberof Contents
		 * @readonly
		 */
		this.sectionIndex = sectionIndex || 0;
		/**
		 * @member {string} cfiBase
		 * @memberof Contents
		 * @readonly
		 */
		this.cfiBase = cfiBase || "";
		this.active = true;

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

		const content = this.content || this.document.body;

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
		const content = this.content || this.document.body;
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

		const content = this.content || this.document.body;

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
	 * Add DOM listeners
	 * @private
	 */
	listeners() {

		this.imageLoadListeners();
		this.mediaQueryListeners();
		// this.fontLoadListeners();
		this.addEventListeners();
		this.addSelectionListeners();
		// this.transitionListeners();

		if (typeof ResizeObserver === "undefined") {
			this.resizeListeners();
			this.visibilityListeners();
		} else {
			this.resizeObservers();
		}

		// this.mutationObservers();
		this.linksHandler();
	}

	/**
	 * Remove DOM listeners
	 * @private
	 */
	removeListeners() {

		this.removeEventListeners();
		this.removeSelectionListeners();

		if (this.observer) {
			this.observer.disconnect();
		}

		clearTimeout(this.expanding);
	}

	/**
	 * Check if size of contents has changed and
	 * emit 'resize' event if it has.
	 * @private
	 */
	resizeCheck() {

		const size = this.textSize();

		if (size.width !== this._size.width || size.height !== this._size.height) {

			this._size = {
				width: size.width,
				height: size.height
			};

			this.onResize && this.onResize(this._size);
			this.emit(EVENTS.CONTENTS.RESIZE, this._size);
		}
	}

	/**
	 * Poll for resize detection
	 * @private
	 */
	resizeListeners() {

		// Test size again
		clearTimeout(this.expanding);
		requestAnimationFrame(this.resizeCheck.bind(this));
		this.expanding = setTimeout(this.resizeListeners.bind(this), 350);
	}

	/**
	 * Listen for visibility of tab to change
	 * @private
	 */
	visibilityListeners() {

		document.addEventListener("visibilitychange", () => {
			if (document.visibilityState === "visible" && this.active === false) {
				this.active = true;
				this.resizeListeners();
			} else {
				this.active = false;
				clearTimeout(this.expanding);
			}
		});
	}

	/**
	 * Use css transitions to detect resize (unused)
	 * @private
	 */
	transitionListeners() {

		const body = this.content;

		body.style['transitionProperty'] = "font, font-size, font-size-adjust, font-stretch, font-variation-settings, font-weight, width, height";
		body.style['transitionDuration'] = "0.001ms";
		body.style['transitionTimingFunction'] = "linear";
		body.style['transitionDelay'] = "0";

		this._resizeCheck = this.resizeCheck.bind(this);
		this.document.addEventListener('transitionend', this._resizeCheck);
	}

	/**
	 * Listen for media query changes and emit 'expand' event
	 * Adapted from: https://github.com/tylergaw/media-query-events/blob/master/js/mq-events.js
	 * @private
	 */
	mediaQueryListeners() {

		const sheets = this.document.styleSheets;
		const mediaChangeHandler = (m) => {
			if (m.matches && !this.expanding) {
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
	 * Use ResizeObserver to listen for changes in the DOM and check for resize
	 * @private
	 */
	resizeObservers() {
		// create an observer instance
		this.observer = new ResizeObserver((e) => {
			requestAnimationFrame(this.resizeCheck.bind(this));
		});

		// pass in the target node
		this.observer.observe(this.document.documentElement);
	}

	/**
	 * Use MutationObserver to listen for changes in the DOM and check for resize (unused)
	 * @private
	 */
	mutationObservers() {
		// create an observer instance
		this.observer = new MutationObserver((mutations) => {
			this.resizeCheck();
		});

		// configuration of the observer:
		const config = {
			attributes: true,
			childList: true,
			characterData: true,
			subtree: true
		};

		// pass in the target node, as well as the observer options
		this.observer.observe(this.document, config);
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
	 * Listen for font load and check for resize when loaded (unused)
	 * @private
	 */
	fontLoadListeners() {

		if (!this.document || !this.document.fonts) {
			return;
		}

		this.document.fonts.ready.then(() => this.resizeCheck());
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
							if (container.nodeType === ELEMENT_NODE) {
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
	 * Append a stylesheet link to the document head
	 * @param {string} src url
	 * @returns {Promise}
	 */
	addStylesheet(src) {

		return new Promise((resolve, reject) => {

			let ready = false;

			if (!this.document) {
				resolve(false);
				return;
			}

			// Check if link already exists
			let stylesheet = this.document.querySelector("link[href='" + src + "']");
			if (stylesheet) {
				resolve(true);
				return; // already present
			}

			stylesheet = this.document.createElement("link");
			stylesheet.type = "text/css";
			stylesheet.rel = "stylesheet";
			stylesheet.href = src;
			stylesheet.onload = stylesheet.onreadystatechange = () => {
				if (!ready && (!this.readyState || this.readyState == "complete")) {
					ready = true;
					// Let apply
					setTimeout(() => {
						resolve(true);
					}, 1);
				}
			};

			this.document.head.appendChild(stylesheet);
		});
	}

	/**
	 * _getStylesheetNode
	 * @param {string} key 
	 * @returns {Element}
	 * @private
	 */
	_getStylesheetNode(key) {

		if (!this.document) return null;

		key = "epubjs-inserted-css-" + (key || "");
		// Check if link already exists
		let styleEl = this.document.getElementById(key);
		if (!styleEl) {
			styleEl = this.document.createElement("style");
			styleEl.id = key;
			// Append style element to head
			this.document.head.appendChild(styleEl);
		}
		return styleEl;
	}

	/**
	 * Append stylesheet css
	 * @param {string} serializedCss
	 * @param {string} key If the key is the same, the CSS will be replaced instead of inserted
	 * @returns {boolean}
	 */
	addStylesheetCss(serializedCss, key) {

		if (!this.document || !serializedCss) {
			return false;
		}

		const styleEl = this._getStylesheetNode(key);
		styleEl.innerHTML = serializedCss;

		return true;
	}

	/**
	 * Append stylesheet rules to a generate stylesheet
	 * Array: https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/insertRule
	 * Object: https://github.com/desirable-objects/json-to-css
	 * @param {array | object} rules
	 * @param {string} key If the key is the same, the CSS will be replaced instead of inserted
	 */
	addStylesheetRules(rules, key) {

		if (!this.document || !rules || rules.length === 0) return;

		// Grab style sheet
		const styleSheet = this._getStylesheetNode(key).sheet;

		if (Object.prototype.toString.call(rules) === "[object Array]") {
			for (let i = 0, len = rules.length; i < len; i++) {
				let j = 1, rule = rules[i], propStr = "";
				const selector = rules[i][0];
				// If the second argument of a rule is an array of arrays, correct our variables.
				if (Object.prototype.toString.call(rule[1][0]) === "[object Array]") {
					rule = rule[1];
					j = 0;
				}

				for (let pl = rule.length; j < pl; j++) {
					const prop = rule[j];
					propStr += prop[0] + ":" + prop[1] + (prop[2] ? " !important" : "") + ";\n";
				}

				// Insert CSS Rule
				styleSheet.insertRule(selector + "{" + propStr + "}", styleSheet.cssRules.length);
			}
		} else {
			const selectors = Object.keys(rules);
			selectors.forEach((selector) => {
				const definition = rules[selector];
				if (Array.isArray(definition)) {
					definition.forEach((item) => {
						const _rules = Object.keys(item);
						const result = _rules.map((rule) => {
							return `${rule}:${item[rule]}`;
						}).join(';');
						styleSheet.insertRule(`${selector}{${result}}`, styleSheet.cssRules.length);
					});
				} else {
					const _rules = Object.keys(definition);
					const result = _rules.map((rule) => {
						return `${rule}:${definition[rule]}`;
					}).join(';');
					styleSheet.insertRule(`${selector}{${result}}`, styleSheet.cssRules.length);
				}
			});
		}
	}

	/**
	 * Append a script tag to the document head
	 * @param {string} src url
	 * @returns {Promise} loaded
	 */
	addScript(src) {

		return new Promise((resolve, reject) => {

			if (!this.document) {
				resolve(false);
				return;
			}

			let ready = false;
			const script = this.document.createElement("script");
			script.type = "text/javascript";
			script.async = true;
			script.src = src;
			script.onload = script.onreadystatechange = () => {
				if (!ready && (!this.readyState || this.readyState == "complete")) {
					ready = true;
					setTimeout(function () {
						resolve(true);
					}, 1);
				}
			};

			this.document.head.appendChild(script);
		});
	}

	/**
	 * Add a class to the contents container
	 * @param {string} className
	 */
	addClass(className) {

		if (!this.document) return;

		const content = this.content || this.document.body;

		if (content) {
			content.classList.add(className);
		}
	}

	/**
	 * Remove a class from the contents container
	 * @param {string} removeClass
	 */
	removeClass(className) {

		if (!this.document) return;

		const content = this.content || this.document.body;

		if (content) {
			content.classList.remove(className);
		}
	}

	/**
	 * Add DOM event listeners
	 * @private
	 */
	addEventListeners() {

		if (!this.document) return;

		this._triggerEvent = this.triggerEvent.bind(this);

		DOM_EVENTS.forEach(eventName => {
			this.document.addEventListener(eventName, this._triggerEvent, { passive: true });
		}, this);
	}

	/**
	 * Remove DOM event listeners
	 * @private
	 */
	removeEventListeners() {

		if (!this.document) return;

		DOM_EVENTS.forEach(eventName => {
			this.document.removeEventListener(eventName, this._triggerEvent, { passive: true });
		}, this);
		this._triggerEvent = undefined;
	}

	/**
	 * Emit passed browser events
	 * @private
	 */
	triggerEvent(e) {

		this.emit(e.type, e);
	}

	/**
	 * Add listener for text selection
	 * @private
	 */
	addSelectionListeners() {

		if (!this.document) return;

		this._onSelectionChange = this.onSelectionChange.bind(this);
		this.document.addEventListener("selectionchange", this._onSelectionChange, { passive: true });
	}

	/**
	 * Remove listener for text selection
	 * @private
	 */
	removeSelectionListeners() {

		if (!this.document) return;

		this.document.removeEventListener("selectionchange", this._onSelectionChange, { passive: true });
		this._onSelectionChange = undefined;
	}

	/**
	 * Handle getting text on selection
	 * @private
	 */
	onSelectionChange(e) {

		if (this.selectionEndTimeout) {
			clearTimeout(this.selectionEndTimeout);
		}
		this.selectionEndTimeout = setTimeout(() => {
			const selection = this.window.getSelection();
			this.triggerSelectedEvent(selection);
		}, 250);
	}

	/**
	 * Emit event on text selection
	 * @private
	 */
	triggerSelectedEvent(selection) {

		if (selection && selection.rangeCount > 0) {
			const range = selection.getRangeAt(0);
			if (!range.collapsed) {
				const cfirange = new EpubCFI(range, this.cfiBase).toString();
				this.emit(EVENTS.CONTENTS.SELECTED, cfirange);
				this.emit(EVENTS.CONTENTS.SELECTED_RANGE, range);
			}
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

		return new EpubCFI(range, this.cfiBase, ignoreClass).toString();
	}

	/**
	 * Get an EpubCFI from a Dom node
	 * @param {node} node
	 * @param {string} [ignoreClass]
	 * @returns {EpubCFI} cfi
	 */
	cfiFromNode(node, ignoreClass) {

		return new EpubCFI(node, this.cfiBase, ignoreClass).toString();
	}

	// TODO: find where this is used - remove?
	map(layout) {

		const map = new Mapping(layout);
		return map.section();
	}

	/**
	 * Size the contents to a given width and height
	 * @param {number} [width]
	 * @param {number} [height]
	 */
	size(width, height) {

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
	}

	/**
	 * Apply columns to the contents for pagination
	 * @param {number} width
	 * @param {number} height
	 * @param {number} columnWidth
	 * @param {number} gap
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

		if (dir === "rtl" && axis === AXIS_H) {
			this.direction(dir);
		}

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
		// if (this.sectionIndex % 2 === 1) {
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
	 * @param {string} [dir="ltr"] `"rtl"` OR `"ltr"`
	 */
	direction(dir = "ltr") {

		if (this.documentElement) {
			this.documentElement.style["direction"] = dir;
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
	 * Emit event when link in content is clicked
	 * @private
	 */
	linksHandler() {

		replaceLinks(this.content, (href) => {
			this.emit(EVENTS.CONTENTS.LINK_CLICKED, href);
		});
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

	/**
	 * destroy
	 */
	destroy() {

		this.removeListeners();
	}
}

EventEmitter(Contents.prototype);

export default Contents;