import EventEmitter from "event-emitter";
import { extend, defer, windowBounds, isNumber } from "../../utils/core";
import scrollType from "../../utils/scrolltype";
import Mapping from "../../mapping";
import Queue from "../../utils/queue";
import Stage from "../helpers/stage";
import Views from "../helpers/views";
import { EVENTS } from "../../utils/constants";

/**
 * Default View Manager
 */
class DefaultViewManager {
	/**
	 * Constructor
	 * @param {object} options 
	 */
	constructor(options) {
		/**
		 * @member {string} name Manager name
		 * @memberof DefaultViewManager
		 * @readonly
		 */
		this.name = "default";
		this.optsSettings = options.settings;
		this.View = options.view;
		this.request = options.request;
		this.renditionQueue = options.queue;
		this.q = new Queue(this);

		this.settings = extend(this.settings || {}, {
			infinite: true,
			hidden: false,
			width: undefined,
			height: undefined,
			axis: undefined,
			writingMode: undefined,
			flow: "scrolled",
			ignoreClass: "",
			fullsize: undefined,
			allowScriptedContent: false,
			allowPopups: false
		});

		extend(this.settings, options.settings || {});

		this.viewSettings = {
			ignoreClass: this.settings.ignoreClass,
			axis: this.settings.axis,
			flow: this.settings.flow,
			layout: this.layout,
			method: this.settings.method, // srcdoc, blobUrl, write
			width: 0,
			height: 0,
			forceEvenPages: true,
			allowScriptedContent: this.settings.allowScriptedContent,
			allowPopups: this.settings.allowPopups
		};
		/**
		 * @member {object[]} location
		 * @memberof DefaultViewManager
		 * @readonly
		 */
		this.location = [];
		/**
		 * @member {boolean} rendered
		 * @memberof DefaultViewManager
		 * @readonly
		 */
		this.rendered = false;
	}

	/**
	 * render
	 * @param {Element} element 
	 * @param {object} size 
	 * @param {number} size.width
	 * @param {number} size.height
	 */
	render(element, size) {

		let tag;
		if (element.tagName) {
			tag = element.tagName.toLowerCase();
			tag = tag === "body" || tag === "html";
		}

		if (this.settings.fullsize === undefined && tag) {
			this.settings.fullsize = true;
		}

		if (this.settings.fullsize) {
			this.settings.overflow = "visible";
			this.overflow = this.settings.overflow;
		}

		this.settings.size = size;
		this.settings.rtlScrollType = scrollType();
		/**
		 * @member {Stage} stage
		 * @memberof DefaultViewManager
		 * @property {string} axis
		 * @property {string} direction
		 * @property {string|number} width
		 * @property {string|number} height
		 * @property {string} overflow
		 * @property {boolean} hidden
		 * @property {boolean} fullsize
		 * @readonly
		 */
		this.stage = new Stage({
			axis: this.settings.axis,
			width: size.width,
			height: size.height,
			overflow: this.overflow,
			hidden: this.settings.hidden,
			fullsize: this.settings.fullsize,
			direction: this.settings.direction
		});
		this.stage.attachTo(element);
		/**
		 * Stage container
		 * @member {Element} container div element
		 * @memberof DefaultViewManager
		 * @readonly
		 */
		this.container = this.stage.getContainer();
		/**
		 * @member {Views} views 
		 * @memberof DefaultViewManager
		 * @readonly
		 */
		this.views = new Views(this.container);
		/**
		 * Calculate Stage Size
		 * @member {object} _bounds
		 * @memberof DefaultViewManager
		 * @readonly
		 */
		this._bounds = this.bounds();
		/**
		 * @member {object} stageSize
		 * @memberof DefaultViewManager
		 * @readonly
		 */
		this.stageSize = this.stage.size();

		// Set the dimensions for views
		this.viewSettings.width = this.stageSize.width;
		this.viewSettings.height = this.stageSize.height;

		// Function to handle a resize event.
		// Will only attach if width and height are both fixed.
		this.stage.onResize(this.onResized.bind(this));

		this.stage.onOrientationChange(this.onOrientationChange.bind(this));

		// Add Event Listeners
		this.addEventListeners();

		// Add Layout method
		// this.applyLayoutMethod();
		if (this.layout) {
			this.updateLayout();
		}

		this.rendered = true;
	}

	/**
	 * addEventListeners
	 * @private
	 */
	addEventListeners() {

		window.onpagehide = (e) => this.destroy();

		let scroller;
		if (!this.settings.fullsize) {
			scroller = this.container;
		} else {
			scroller = window;
		}

		this._onScroll = this.onScroll.bind(this);
		scroller.addEventListener("scroll", this._onScroll);
	}

	/**
	 * removeEventListeners
	 * @private
	 */
	removeEventListeners() {

		let scroller;
		if (!this.settings.fullsize) {
			scroller = this.container;
		} else {
			scroller = window;
		}

		scroller.removeEventListener("scroll", this._onScroll);
		this._onScroll = undefined;
	}

	/**
	 * destroy
	 */
	destroy() {

		clearTimeout(this.orientationTimeout);
		clearTimeout(this.resizeTimeout);
		clearTimeout(this.afterScrolled);

		this.clear();
		this.removeEventListeners();
		this.stage.destroy();
		this.rendered = false;
	}

	/**
	 * onOrientationChange
	 * @param {Event} e 
	 * @private
	 */
	onOrientationChange(e) {

		let { orientation } = window.screen;

		if (this.optsSettings.resizeOnOrientationChange) {
			this.resize();
		}

		// Per ampproject:
		// In IOS 10.3, the measured size of an element is incorrect if the
		// element size depends on window size directly and the measurement
		// happens in window.resize event. Adding a timeout for correct
		// measurement. See https://github.com/ampproject/amphtml/issues/8479
		clearTimeout(this.orientationTimeout);
		this.orientationTimeout = setTimeout(() => {
			this.orientationTimeout = undefined;

			if (this.optsSettings.resizeOnOrientationChange) {
				this.resize();
			}

			this.emit(EVENTS.MANAGERS.ORIENTATION_CHANGE, orientation);
		}, 500);
	}

	/**
	 * onResized
	 * @param {Event} e 
	 * @private
	 */
	onResized(e) {

		this.resize();
	}

	/**
	 * resize
	 * @param {number} [width] 
	 * @param {number} [height] 
	 * @param {string} [epubcfi] 
	 */
	resize(width, height, epubcfi) {

		const stageSize = this.stage.size(width, height);

		// For Safari, wait for orientation to catch up
		// if the window is a square
		this.winBounds = windowBounds();
		if (this.orientationTimeout &&
			this.winBounds.width === this.winBounds.height) {
			// reset the stage size for next resize
			this.stageSize = undefined;
			return;
		}

		if (this.stageSize &&
			this.stageSize.width === stageSize.width &&
			this.stageSize.height === stageSize.height) {
			// Size is the same, no need to resize
			return;
		}

		this.stageSize = stageSize;

		this._bounds = this.bounds();

		// Clear current views
		this.clear();

		// Update for new views
		this.viewSettings.width = this.stageSize.width;
		this.viewSettings.height = this.stageSize.height;

		this.updateLayout();

		this.emit(EVENTS.MANAGERS.RESIZED, {
			width: this.stageSize.width,
			height: this.stageSize.height
		}, epubcfi);
	}

	/**
	 * createView
	 * @param {Section} section 
	 * @param {boolean} forceRight 
	 * @returns {object} View object (default: IframeView)
	 * @private
	 */
	createView(section, forceRight) {

		return new this.View(section, extend(this.viewSettings, { forceRight }));
	}

	/**
	 * handleNextPrePaginated
	 * @param {boolean} forceRight 
	 * @param {Section} section 
	 * @param {function} action callback function
	 * @returns {*}
	 * @private
	 */
	handleNextPrePaginated(forceRight, section, action) {

		if (this.layout.name === "pre-paginated" && this.layout.divisor > 1) {
			if (forceRight || section.index === 0) {
				// First page (cover) should stand alone for pre-paginated books
				return;
			}
			const next = section.next();
			if (next && !next.properties.includes("page-spread-left")) {
				return action.call(this, next);
			}
		}
	}

	/**
	 * display
	 * @param {Section} section 
	 * @param {string|number} target 
	 * @returns {Promise} displaying promise
	 */
	display(section, target) {

		const displaying = new defer();
		const displayed = displaying.promise;

		// Check if moving to target is needed
		if (target === section.href || isNumber(target)) {
			target = undefined;
		}

		// Check to make sure the section we want isn't already shown
		const visible = this.views.find(section);

		// View is already shown, just move to correct location in view
		if (visible && section && this.layout.name !== "pre-paginated") {
			const offset = visible.offset();

			if (this.settings.direction === "ltr") {
				this.scrollTo(offset.left, offset.top, true);
			} else {
				const width = visible.width();
				this.scrollTo(offset.left + width, offset.top, true);
			}

			if (target) {
				this.moveTo(visible.locationOf(target), visible.width());
			}

			displaying.resolve();
			return displayed;
		}

		// Hide all current views
		this.clear();

		let forceRight = false;
		if (this.layout.name === "pre-paginated" && 
			this.layout.divisor === 2 && 
			section.properties.includes("page-spread-right")) {
			forceRight = true;
		}

		this.add(section, forceRight).then((view) => {

			// Move to correct place within the section, if needed
			if (target) {
				let offset = view.locationOf(target);
				let width = view.width();
				this.moveTo(offset, width);
			}
		}, (err) => {
			displaying.reject(err);
		}).then(() => {
			return this.handleNextPrePaginated(forceRight, section, this.add);
		}).then(() => {
			this.views.show();
			displaying.resolve();
		});

		return displayed;
	}

	/**
	 * afterDisplayed
	 * @param {*} view 
	 * @private
	 */
	afterDisplayed(view) {

		this.emit(EVENTS.MANAGERS.ADDED, view);
	}

	/**
	 * afterResized
	 * @param {*} view 
	 * @private
	 */
	afterResized(view) {

		this.emit(EVENTS.MANAGERS.RESIZE, view.section);
	}

	/**
	 * moveTo
	 * @param {object} offset
	 * @param {number} offset.top
	 * @param {number} offset.left
	 * @param {number} width 
	 * @private
	 */
	moveTo(offset, width) {

		let distX = 0, distY = 0;

		if (!this.isPaginated) {
			distY = offset.top;
		} else {
			distX = Math.floor(offset.left / this.layout.delta) * this.layout.delta;

			if (distX + this.layout.delta > this.container.scrollWidth) {
				distX = this.container.scrollWidth - this.layout.delta;
			}

			distY = Math.floor(offset.top / this.layout.delta) * this.layout.delta;

			if (distY + this.layout.delta > this.container.scrollHeight) {
				distY = this.container.scrollHeight - this.layout.delta;
			}
		}

		if (this.settings.direction === 'rtl') {
			/***
				the `floor` function above (L343) is on positive values, so we should add one `layout.delta`
				to distX or use `Math.ceil` function, or multiply offset.left by -1
				before `Math.floor`
			*/
			distX = distX + this.layout.delta;
			distX = distX - width;
		}

		this.scrollTo(distX, distY, true);
	}

	/**
	 * add
	 * @param {Section} section 
	 * @param {boolean} forceRight 
	 * @returns {Promise}
	 */
	add(section, forceRight) {

		const view = this.createView(section, forceRight);
		this.views.append(view);

		// view.on(EVENTS.VIEWS.SHOWN, this.afterDisplayed.bind(this));
		view.onDisplayed = this.afterDisplayed.bind(this);
		view.onResize = this.afterResized.bind(this);

		view.on(EVENTS.VIEWS.AXIS, (axis) => {
			this.updateAxis(axis);
		});

		view.on(EVENTS.VIEWS.WRITING_MODE, (mode) => {
			this.updateWritingMode(mode);
		});

		return view.display(this.request);
	}

	/**
	 * append
	 * @param {Section} section Section object
	 * @param {boolean} forceRight 
	 * @returns {Promise}
	 * @private
	 */
	append(section, forceRight) {

		const view = this.createView(section, forceRight);
		this.views.append(view);

		view.onDisplayed = this.afterDisplayed.bind(this);
		view.onResize = this.afterResized.bind(this);

		view.on(EVENTS.VIEWS.AXIS, (axis) => {
			this.updateAxis(axis);
		});

		view.on(EVENTS.VIEWS.WRITING_MODE, (mode) => {
			this.updateWritingMode(mode);
		});

		return view.display(this.request);
	}

	/**
	 * prepend
	 * @param {Section} section 
	 * @param {boolean} forceRight 
	 * @returns {Promise}
	 * @private
	 */
	prepend(section, forceRight) {

		const view = this.createView(section, forceRight);

		view.on(EVENTS.VIEWS.RESIZED, (bounds) => {
			this.counter(bounds);
		});

		this.views.prepend(view);

		view.onDisplayed = this.afterDisplayed.bind(this);
		view.onResize = this.afterResized.bind(this);

		view.on(EVENTS.VIEWS.AXIS, (axis) => {
			this.updateAxis(axis);
		});

		view.on(EVENTS.VIEWS.WRITING_MODE, (mode) => {
			this.updateWritingMode(mode);
		});

		return view.display(this.request);
	}

	/**
	 * counter
	 * @param {*} bounds 
	 * @private
	 */
	counter(bounds) {

		if (this.settings.axis === "vertical") {
			this.scrollBy(0, bounds.heightDelta, true);
		} else {
			this.scrollBy(bounds.widthDelta, 0, true);
		}
	}

	/**
	 * next
	 * @returns {Promise}
	 */
	next() {

		let next;
		let left;
		const dir = this.settings.direction;

		if (!this.views.length) return;

		if (this.isPaginated && this.settings.axis === "horizontal" && (!dir || dir === "ltr")) {

			this.scrollLeft = this.container.scrollLeft;

			left = this.container.scrollLeft + this.container.offsetWidth + this.layout.delta;

			if (left <= this.container.scrollWidth) {
				this.scrollBy(this.layout.delta, 0, true);
			} else {
				next = this.views.last().section.next();
			}
		} else if (this.isPaginated && this.settings.axis === "horizontal" && dir === "rtl") {

			this.scrollLeft = this.container.scrollLeft;

			if (this.settings.rtlScrollType === "default") {
				left = this.container.scrollLeft;

				if (left > 0) {
					this.scrollBy(this.layout.delta, 0, true);
				} else {
					next = this.views.last().section.next();
				}
			} else {
				left = this.container.scrollLeft + (this.layout.delta * -1);

				if (left > this.container.scrollWidth * -1) {
					this.scrollBy(this.layout.delta, 0, true);
				} else {
					next = this.views.last().section.next();
				}
			}

		} else if (this.isPaginated && this.settings.axis === "vertical") {

			this.scrollTop = this.container.scrollTop;
			const top = this.container.scrollTop + this.container.offsetHeight;

			if (top < this.container.scrollHeight) {
				this.scrollBy(0, this.layout.height, true);
			} else {
				next = this.views.last().section.next();
			}

		} else {
			next = this.views.last().section.next();
		}

		if (next) {
			this.clear();
			// The new section may have a different 
			// writing-mode from the old section. 
			// Thus, we need to update layout.
			this.updateLayout();

			let forceRight = false;
			if (this.layout.name === "pre-paginated" && 
				this.layout.divisor === 2 && 
				next.properties.includes("page-spread-right")) {
				forceRight = true;
			}

			return this.append(next, forceRight).then(() => {
				return this.handleNextPrePaginated(forceRight, next, this.append);
			}, (err) => {
				return err;
			}).then(() => {

				// Reset position to start for scrolled-doc vertical-rl in default mode
				if (!this.isPaginated &&
					this.settings.axis === "horizontal" &&
					this.settings.direction === "rtl" &&
					this.settings.rtlScrollType === "default") {

					this.scrollTo(this.container.scrollWidth, 0, true);
				}
				this.views.show();
			});
		}
	}

	/**
	 * prev
	 * @returns {Promise}
	 */
	prev() {

		let prev;
		let left;
		const dir = this.settings.direction;

		if (!this.views.length) return;

		if (this.isPaginated && this.settings.axis === "horizontal" && (!dir || dir === "ltr")) {

			this.scrollLeft = this.container.scrollLeft;

			left = this.container.scrollLeft;

			if (left > 0) {
				this.scrollBy(-this.layout.delta, 0, true);
			} else {
				prev = this.views.first().section.prev();
			}

		} else if (this.isPaginated && this.settings.axis === "horizontal" && dir === "rtl") {

			this.scrollLeft = this.container.scrollLeft;

			if (this.settings.rtlScrollType === "default") {
				left = this.container.scrollLeft + this.container.offsetWidth;

				if (left < this.container.scrollWidth) {
					this.scrollBy(-this.layout.delta, 0, true);
				} else {
					prev = this.views.first().section.prev();
				}
			}
			else {
				left = this.container.scrollLeft;

				if (left < 0) {
					this.scrollBy(-this.layout.delta, 0, true);
				} else {
					prev = this.views.first().section.prev();
				}
			}

		} else if (this.isPaginated && this.settings.axis === "vertical") {

			this.scrollTop = this.container.scrollTop;
			const top = this.container.scrollTop;

			if (top > 0) {
				this.scrollBy(0, -(this.layout.height), true);
			} else {
				prev = this.views.first().section.prev();
			}

		} else {
			prev = this.views.first().section.prev();
		}

		if (prev) {
			this.clear();
			// The new section may have a different 
			// writing-mode from the old section. 
			// Thus, we need to update layout.
			this.updateLayout();

			let forceRight = false;
			if (this.layout.name === "pre-paginated" && 
				this.layout.divisor === 2 && 
				typeof prev.prev() !== "object") {
				forceRight = true;
			}

			return this.prepend(prev, forceRight).then(() => {

				if (this.layout.name === "pre-paginated" && this.layout.divisor > 1) {
					const left = prev.prev();
					if (left) {
						return this.prepend(left);
					}
				}
			}, (err) => {
				return err;
			}).then(() => {
				if (this.isPaginated && this.settings.axis === "horizontal") {
					if (this.settings.direction === "rtl") {
						if (this.settings.rtlScrollType === "default") {
							this.scrollTo(0, 0, true);
						}
						else {
							this.scrollTo((this.container.scrollWidth * -1) + this.layout.delta, 0, true);
						}
					} else {
						this.scrollTo(this.container.scrollWidth - this.layout.delta, 0, true);
					}
				}
				this.views.show();
			});
		}
	}

	/**
	 * current
	 * @returns {*} view
	 */
	current() {

		const visible = this.visible();
		if (visible.length) {
			// Current is the last visible view
			return visible[visible.length - 1];
		}
		return null;
	}

	/**
	 * clear views
	 */
	clear() {

		// this.q.clear();

		if (this.views) {
			this.views.hide();
			this.scrollTo(0, 0, true);
			this.views.clear();
		}
	}

	/**
	 * currentLocation
	 * @returns {object[]} Location sections
	 */
	currentLocation() {

		this.updateLayout();
		if (this.isPaginated && this.settings.axis === "horizontal") {
			this.location = this.paginatedLocation();
		} else {
			this.location = this.scrolledLocation();
		}
		return this.location;
	}

	/**
	 * scrolledLocation
	 * @returns {object[]} Location sections
	 * @private
	 */
	scrolledLocation() {

		const visible = this.visible();
		const container = this.container.getBoundingClientRect();
		const pageHeight = (container.height < window.innerHeight) ? container.height : window.innerHeight;
		const pageWidth = (container.width < window.innerWidth) ? container.width : window.innerWidth;
		const vertical = (this.settings.axis === "vertical");
		const rtl = (this.settings.direction === "rtl");

		let offset = 0;
		let used = 0;

		if (this.settings.fullsize) {
			offset = vertical ? window.scrollY : window.scrollX;
		}

		const sections = visible.map(view => {

			const { index, href } = view.section;
			const position = view.position();
			const width = view.width();
			const height = view.height();

			let startPos;
			let endPos;
			let stopPos;
			let totalPages;

			if (vertical) {
				startPos = offset + container.top - position.top + used;
				endPos = startPos + pageHeight - used;
				totalPages = this.layout.count(height, pageHeight).pages;
				stopPos = pageHeight;
			} else {
				startPos = offset + container.left - position.left + used;
				endPos = startPos + pageWidth - used;
				totalPages = this.layout.count(width, pageWidth).pages;
				stopPos = pageWidth;
			}

			let currPage = Math.ceil(startPos / stopPos);
			let endPage = Math.ceil(endPos / stopPos);

			// Reverse page counts for horizontal rtl
			if (this.settings.direction === "rtl" && !vertical) {
				const tmp = currPage;
				currPage = totalPages - endPage;
				endPage = totalPages - tmp;
			}

			const pages = [];
			for (let i = currPage; i <= endPage; i++) {
				const pg = i + 1;
				pages.push(pg);
			}

			const mapping = this.mapping.page(
				view.contents, 
				view.section.cfiBase, 
				startPos, 
				endPos
			);

			return {
				index,
				href,
				pages,
				totalPages,
				mapping
			}
		});

		return sections;
	}

	/**
	 * paginatedLocation
	 * @returns {object[]} sections
	 * @private
	 */
	paginatedLocation() {

		const visible = this.visible();
		const container = this.container.getBoundingClientRect();

		let left = 0;
		let used = 0;

		if (this.settings.fullsize) {
			left = window.scrollX;
		}

		const sections = visible.map(view => {

			const { index, href } = view.section;
			const position = view.position();
			const width = view.width();

			// Find mapping
			let start;
			let end;
			let pageWidth;
			let offset;

			if (this.settings.direction === "rtl") {
				offset = container.right - left;
				pageWidth = Math.min(Math.abs(offset - position.left), this.layout.width) - used;
				end = position.width - (position.right - offset) - used;
				start = end - pageWidth;
			} else {
				offset = container.left + left;
				pageWidth = Math.min(position.right - offset, this.layout.width) - used;
				start = offset - position.left + used;
				end = start + pageWidth;
			}

			used += pageWidth;

			let startPage = Math.floor(start / this.layout.pageWidth);
			let endPage = Math.floor(end / this.layout.pageWidth);

			// start page should not be negative
			if (startPage < 0) {
				startPage = 0;
				endPage = endPage + 1;
			}

			const totalPages = this.layout.count(width).pages;
			// Reverse page counts for rtl
			if (this.settings.direction === "rtl") {
				const tmp = startPage;
				startPage = totalPages - endPage;
				endPage = totalPages - tmp;
			}

			const pages = [];
			for (let i = startPage + 1; i <= endPage; i++) {
				pages.push(i);
			}

			const mapping = this.mapping.page(
				view.contents, 
				view.section.cfiBase, 
				start, 
				end
			);
			
			return {
				index,
				href,
				pages,
				totalPages,
				mapping
			}
		});

		return sections;
	}

	/**
	 * isVisible
	 * @param {*} view 
	 * @param {number} offsetPrev 
	 * @param {number} offsetNext 
	 * @param {DOMRect} [rect] 
	 * @returns {boolean}
	 * @private
	 */
	isVisible(view, offsetPrev, offsetNext, rect) {

		const position = view.position();
		const container = rect || this.bounds();

		if (this.settings.axis === "horizontal" &&
			position.right > container.left - offsetPrev &&
			position.left < container.right + offsetNext) {

			return true;

		} else if (this.settings.axis === "vertical" &&
			position.bottom > container.top - offsetPrev &&
			position.top < container.bottom + offsetNext) {

			return true;
		}

		return false;
	}

	/**
	 * Get array of visible views
	 * @returns {object[]} array of visible views
	 */
	visible() {

		const container = this.bounds();
		const views = this.views.displayed();
		const items = [];

		for (let i = 0, len = views.length; i < len; i++) {
			const view = views[i];
			if (this.isVisible(view, 0, 0, container)) {
				items.push(view);
			}
		}

		return items;
	}

	/**
	 * scrollBy
	 * @param {number} x 
	 * @param {number} y 
	 * @param {boolean} silent 
	 * @private
	 */
	scrollBy(x, y, silent) {

		const dir = this.settings.direction === "rtl" ? -1 : 1;

		if (silent) {
			this.ignore = true;
		}

		if (!this.settings.fullsize) {
			if (x) this.container.scrollLeft += x * dir;
			if (y) this.container.scrollTop += y;
		} else {
			window.scrollBy(x * dir, y * dir);
		}
		this.scrolled = true;
	}

	/**
	 * scrollTo
	 * @param {number} x 
	 * @param {number} y 
	 * @param {boolean} silent 
	 * @private
	 */
	scrollTo(x, y, silent) {

		if (silent) {
			this.ignore = true;
		}

		if (!this.settings.fullsize) {
			this.container.scrollLeft = x;
			this.container.scrollTop = y;
		} else {
			window.scrollTo(x, y);
		}
		this.scrolled = true;
	}

	/**
	 * onScroll event handler
	 * @private
	 */
	onScroll() {

		let scrollTop;
		let scrollLeft;

		if (!this.settings.fullsize) {
			scrollTop = this.container.scrollTop;
			scrollLeft = this.container.scrollLeft;
		} else {
			scrollTop = window.scrollY;
			scrollLeft = window.scrollX;
		}

		this.scrollTop = scrollTop;
		this.scrollLeft = scrollLeft;

		if (!this.ignore) {
			this.emit(EVENTS.MANAGERS.SCROLL, {
				top: scrollTop,
				left: scrollLeft
			});

			clearTimeout(this.afterScrolled);
			this.afterScrolled = setTimeout(() => {
				this.emit(EVENTS.MANAGERS.SCROLLED, {
					top: this.scrollTop,
					left: this.scrollLeft
				});
			}, 20);
		} else {
			this.ignore = false;
		}
	}

	/**
	 * bounds
	 * @returns {DOMRect}
	 */
	bounds() {

		return this.stage.bounds();
	}

	/**
	 * applyLayout
	 * @param {Layout} layout Layout object
	 */
	applyLayout(layout) {

		/**
		 * @member {Layout} layout
		 * @memberof DefaultViewManager
		 * @readonly
		 */
		this.layout = layout;
		this.updateLayout();
		if (this.views && this.views.length > 0 && 
			this.layout.name === "pre-paginated") {
			this.display(this.views.first().section);
		}
	}

	/**
	 * updateLayout
	 */
	updateLayout() {

		if (!this.stage) return;

		this.stageSize = this.stage.size();

		if (!this.isPaginated) {
			this.layout.calculate(this.stageSize.width, this.stageSize.height);
		} else {
			this.layout.calculate(
				this.stageSize.width,
				this.stageSize.height,
				this.settings.gap
			);

			// Set the look ahead offset for what is visible
			this.settings.offset = this.layout.delta / this.layout.divisor;

			// this.stage.addStyleRules("iframe", [{"margin-right" : this.layout.gap + "px"}]);
		}

		// Set the dimensions for views
		this.viewSettings.width = this.layout.width;
		this.viewSettings.height = this.layout.height;

		this.setLayout(this.layout);
	}

	/**
	 * setLayout
	 * @param {Layout} layout 
	 * @private
	 */
	setLayout(layout) {
		/**
		 * @member {Mapping} mapping
		 * @memberof DefaultViewManager
		 * @readonly
		 */
		this.mapping = new Mapping(layout, this.settings.direction, this.settings.axis);
		this.views && this.views.forEach(view => {

			view && view.setLayout(layout)
		});
		this.viewSettings.layout = layout;
	}

	/**
	 * updateWritingMode
	 * @param {*} mode 
	 * @private
	 */
	updateWritingMode(mode) {

		this.writingMode = mode;
	}

	/**
	 * updateAxis
	 * @param {string} axis
	 * @param {boolean} forceUpdate
	 */
	updateAxis(axis, forceUpdate) {

		if (!forceUpdate && axis === this.settings.axis) {
			return;
		}

		this.settings.axis = axis;
		this.stage && this.stage.axis(axis);
		this.viewSettings.axis = axis;

		if (this.mapping) {
			this.mapping = new Mapping(this.layout, this.settings.direction, this.settings.axis);
		}

		if (this.layout) {
			if (axis === "vertical") {
				this.layout.spread("none");
			} else {
				this.layout.spread(this.layout.settings.spread);
			}
		}
	}

	/**
	 * updateFlow
	 * @param {string} flow 
	 * @param {string} [defaultScrolledOverflow='auto'] 
	 */
	updateFlow(flow, defaultScrolledOverflow = "auto") {

		const isPaginated = (flow === "paginated" || flow === "auto");
		this.isPaginated = isPaginated;

		if (flow === "scrolled-doc" ||
			flow === "scrolled-continuous" ||
			flow === "scrolled") {
			this.updateAxis("vertical");
		} else {
			this.updateAxis("horizontal");
		}

		this.viewSettings.flow = flow;

		if (!this.settings.overflow) {
			this.overflow = isPaginated ? "hidden" : defaultScrolledOverflow;
		} else {
			this.overflow = this.settings.overflow;
		}

		this.stage && this.stage.overflow(this.overflow);
		this.updateLayout();
	}

	/**
	 * Get contents array from views
	 * @returns {Contents[]} [view.contents]
	 */
	getContents() {

		const contents = [];
		if (!this.views) {
			return contents;
		}
		this.views.forEach(view => {

			view && contents.push(view.contents)
		});
		return contents;
	}

	/**
	 * direction
	 * @param {string} [dir='ltr'] 
	 */
	direction(dir = "ltr") {

		this.settings.direction = dir;
		this.stage && this.stage.direction(dir);
		this.viewSettings.direction = dir;
		this.updateLayout();
	}

	/**
	 * isRendered
	 * @returns {boolean}
	 */
	isRendered() {

		return this.rendered;
	}
}

EventEmitter(DefaultViewManager.prototype);

export default DefaultViewManager;