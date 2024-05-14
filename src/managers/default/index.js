import EventEmitter from "event-emitter";
import Mapping from "../../mapping";
import Stage from "../helpers/stage";
import Views from "../helpers/views";
import IframeView from "../views/iframe";
import scrollType from "../../utils/scrolltype";
import { EVENTS } from "../../utils/constants";
import { extend, defer, windowBounds, isNumber } from "../../utils/core";

const AXIS_H = "horizontal";
const AXIS_V = "vertical";

/**
 * Default View Manager
 */
class DefaultViewManager {
	/**
	 * Constructor
	 * @param {Book} book 
	 * @param {Layout} layout 
	 * @param {object} [options]
	 * @param {string} [options.axis]
	 * @param {string} [options.method] values: `"blobUrl"` OR `"srcdoc"` OR `"write"`
	 * @param {string} [options.ignoreClass='']
	 * @param {string|object} [options.view='iframe']
	 */
	constructor(book, layout, options) {
		/**
		 * @member {string} name Manager name
		 * @memberof DefaultViewManager
		 * @readonly
		 */
		this.name = "default";
		this.request = book.load.bind(book);
		this.settings = extend({
			axis: null,
			view: "iframe",
			hidden: false,
			method: null,
			fullsize: null,
			allowPopups: false,
			ignoreClass: "",
			writingMode: undefined,
			allowScriptedContent: false,
			resizeOnOrientationChange: false
		}, options || {});
		/**
		 * @member {Layout} layout
		 * @memberof DefaultViewManager
		 * @readonly
		 */
		this.layout = layout;
		this.layout.on(EVENTS.LAYOUT.UPDATED, (props, changed) => {
			if (changed.flow) {
				this.isPaginated = changed.flow === "paginated";
				if (this.isPaginated) {
					this.updateAxis(AXIS_H);
				} else {
					this.updateAxis(AXIS_V);
				}
			}
			this.clear();
			this.updateLayout();
		});
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

		if (this.settings.fullsize === null && tag) {
			this.settings.fullsize = true;
		}

		this.settings.rtlScrollType = scrollType();
		/**
		 * @member {Stage} stage
		 * @memberof DefaultViewManager
		 * @property {string} axis
		 * @property {string|number} width
		 * @property {string|number} height
		 * @property {boolean} hidden
		 * @property {boolean} fullsize
		 * @readonly
		 */
		this.stage = new Stage(this.layout, {
			axis: this.settings.axis,
			width: size.width,
			height: size.height,
			hidden: this.settings.hidden,
			fullsize: this.settings.fullsize
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
		 * @member {object} stageSize
		 * @memberof DefaultViewManager
		 * @readonly
		 */
		this.stageSize = this.stage.size();

		// Function to handle a resize event.
		// Will only attach if width and height are both fixed.
		this.stage.onResize(this.onResized.bind(this));

		this.stage.onOrientationChange(this.onOrientationChange.bind(this));

		// Add Event Listeners
		this.addEventListeners();

		this.rendered = true;
		this.updateLayout();
	}

	/**
	 * addEventListeners
	 * @private
	 */
	addEventListeners() {

		window.onpagehide = (e) => this.destroy();

		let container;
		if (this.settings.fullsize) {
			container = window;
		} else {
			container = this.container;
		}

		container.addEventListener("scroll", this.onScroll.bind(this));
	}

	/**
	 * removeEventListeners
	 * @private
	 */
	removeEventListeners() {

		let container;
		if (this.settings.fullsize) {
			container = window;
		} else {
			container = this.container;
		}

		container.removeEventListener("scroll", this.onScroll.bind(this));
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

		if (this.settings.resizeOnOrientationChange) {
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

			if (this.settings.resizeOnOrientationChange) {
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
		this.clear(); // Clear current views
		this.updateLayout();

		this.emit(EVENTS.MANAGERS.RESIZED, {
			width: this.stageSize.width,
			height: this.stageSize.height
		}, epubcfi);
	}

	/**
	 * Require the view from passed string, or as a class function
	 * @param  {string|object} view
	 * @return {any}
	 * @private
	 */
	requireView(view) {

		let ret;

		// If view is a string, try to load from imported views,
		if (typeof view == "string" && view === "iframe") {
			ret = IframeView;
		} else {
			// otherwise, assume we were passed a class function
			ret = view;
		}

		return ret;
	}

	/**
	 * createView
	 * @param {Section} section 
	 * @param {boolean} forceRight 
	 * @returns {object} View object (default: IframeView)
	 * @private
	 */
	createView(section, forceRight) {

		const view = this.requireView(this.settings.view);
		return new view(this.layout, section, {
			axis: this.settings.axis,
			method: this.settings.method,
			allowPopups: this.settings.allowPopups,
			ignoreClass: this.settings.ignoreClass,
			allowScriptedContent: this.settings.allowScriptedContent,
			forceRight: forceRight,
			forceEvenPages: true
		});
	}

	/**
	 * handleNextPrePaginated
	 * @param {boolean} forceRight 
	 * @param {Section} section 
	 * @param {function} action callback function
	 * @returns {any}
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
	 * @param {string|number} [target] 
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
		const view = this.views.find(section);

		// View is already shown, just move to correct location in view
		if (view && this.layout.name !== "pre-paginated") {
			const offset = view.offset();
			let x, y = offset.top;
			if (this.layout.direction === "ltr") {
				x = offset.left;
				this.scrollTo(x, y, true);
			} else {
				x = offset.left + view.width;
				this.scrollTo(x, y, true);
			}

			if (target) {
				this.moveTo(view.locationOf(target), view.width);
			}

			displaying.resolve();
			return displayed;
		}

		this.clear(); // Hide all current views

		let forceRight = false;
		if (this.layout.name === "pre-paginated" && 
			this.layout.divisor === 2 && 
			section.properties.includes("page-spread-right")) {
			forceRight = true;
		}

		this.append(section, forceRight).then((view) => {

			// Move to correct place within the section, if needed
			if (target) {
				const offset = view.locationOf(target);
				this.moveTo(offset, view.width);
			}
		}, (err) => {
			displaying.reject(err);
		}).then(() => {
			return this.handleNextPrePaginated(forceRight, section, this.append);
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

		if (this.isPaginated) {
			distX = Math.floor(offset.left / this.layout.delta) * this.layout.delta;

			if (distX + this.layout.delta > this.container.scrollWidth) {
				distX = this.container.scrollWidth - this.layout.delta;
			}

			distY = Math.floor(offset.top / this.layout.delta) * this.layout.delta;

			if (distY + this.layout.delta > this.container.scrollHeight) {
				distY = this.container.scrollHeight - this.layout.delta;
			}
		} else {
			distY = offset.top;
		}

		if (this.layout.direction === "rtl") {
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
	 * @param {object} bounds 
	 * @private
	 */
	counter(bounds) {

		if (this.settings.axis === AXIS_V) {
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

		let left, section;
		const dir = this.layout.direction;

		if (this.views.length === 0) {
			return null;
		} else if (this.isPaginated && this.settings.axis === AXIS_H && dir === "ltr") {

			this.scrollLeft = this.container.scrollLeft;

			left = this.container.scrollLeft + this.container.offsetWidth + this.layout.delta;

			if (left <= this.container.scrollWidth) {
				this.scrollBy(this.layout.delta, 0, true);
			} else {
				section = this.views.last().section.next();
			}
		} else if (this.isPaginated && this.settings.axis === AXIS_H && dir === "rtl") {

			this.scrollLeft = this.container.scrollLeft;

			if (this.settings.rtlScrollType === "default") {
				left = this.container.scrollLeft;

				if (left > 0) {
					this.scrollBy(this.layout.delta, 0, true);
				} else {
					section = this.views.last().section.next();
				}
			} else {
				left = this.container.scrollLeft + (this.layout.delta * -1);

				if (left > this.container.scrollWidth * -1) {
					this.scrollBy(this.layout.delta, 0, true);
				} else {
					section = this.views.last().section.next();
				}
			}

		} else if (this.isPaginated && this.settings.axis === AXIS_V) {

			this.scrollTop = this.container.scrollTop;
			const top = this.container.scrollTop + this.container.offsetHeight;

			if (top < this.container.scrollHeight) {
				this.scrollBy(0, this.layout.height, true);
			} else {
				section = this.views.last().section.next();
			}

		} else {
			section = this.views.last().section.next();
		}

		if (section) {
			this.clear();
			// The new section may have a different 
			// writing-mode from the old section. 
			// Thus, we need to update layout.
			this.updateLayout();

			let forceRight = false;
			if (this.layout.name === "pre-paginated" && 
				this.layout.divisor === 2 && 
				section.properties.includes("page-spread-right")) {
				forceRight = true;
			}

			return this.append(section, forceRight).then(() => {
				return this.handleNextPrePaginated(forceRight, section, this.append);
			}, (err) => {
				return err;
			}).then(() => {

				// Reset position to start for scrolled-doc vertical-rl in default mode
				if (!this.isPaginated &&
					this.settings.axis === AXIS_H &&
					this.layout.direction === "rtl" &&
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

		let left, section;
		const dir = this.layout.direction;

		if (this.views.length === 0) {
			return null;
		} else if (this.isPaginated && this.settings.axis === AXIS_H && dir === "ltr") {

			this.scrollLeft = this.container.scrollLeft;

			left = this.container.scrollLeft;

			if (left > 0) {
				this.scrollBy(-this.layout.delta, 0, true);
			} else {
				section = this.views.first().section.prev();
			}

		} else if (this.isPaginated && this.settings.axis === AXIS_H && dir === "rtl") {

			this.scrollLeft = this.container.scrollLeft;

			if (this.settings.rtlScrollType === "default") {
				left = this.container.scrollLeft + this.container.offsetWidth;

				if (left < this.container.scrollWidth) {
					this.scrollBy(-this.layout.delta, 0, true);
				} else {
					section = this.views.first().section.prev();
				}
			}
			else {
				left = this.container.scrollLeft;

				if (left < 0) {
					this.scrollBy(-this.layout.delta, 0, true);
				} else {
					section = this.views.first().section.prev();
				}
			}

		} else if (this.isPaginated && this.settings.axis === AXIS_V) {

			this.scrollTop = this.container.scrollTop;
			const top = this.container.scrollTop;

			if (top > 0) {
				this.scrollBy(0, -(this.layout.height), true);
			} else {
				section = this.views.first().section.prev();
			}

		} else {
			section = this.views.first().section.prev();
		}

		if (section) {
			this.clear();
			// The new section may have a different 
			// writing-mode from the old section. 
			// Thus, we need to update layout.
			this.updateLayout();

			let forceRight = false;
			if (this.layout.name === "pre-paginated" && 
				this.layout.divisor === 2 && 
				typeof section.prev() !== "object") {
				forceRight = true;
			}

			return this.prepend(section, forceRight).then(() => {

				if (this.layout.name === "pre-paginated" && this.layout.divisor > 1) {
					const left = section.prev();
					if (left) {
						return this.prepend(left);
					}
				}
			}, (err) => {
				return err;
			}).then(() => {
				if (this.isPaginated && this.settings.axis === AXIS_H) {
					if (this.layout.direction === "rtl") {
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
	 * Get current visible view
	 * @returns {*} view
	 */
	current() {

		const views = this.visible();
		if (views.length) {
			// Current is the last visible view
			return views[views.length - 1];
		}
		return null;
	}

	/**
	 * clear views
	 */
	clear() {

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
		if (this.isPaginated && this.settings.axis === AXIS_H) {
			this.location = this.paginatedLocation();
		} else {
			this.location = this.scrolledLocation();
		}
		return this.location;
	}

	/**
	 * Get location from scrolled flow
	 * @returns {object[]} Location sections
	 * @private
	 */
	scrolledLocation() {

		let offset = 0, used = 0;
		if (this.settings.fullsize) {
			offset = this.settings.axis === AXIS_V ? window.scrollY : window.scrollX;
		}
		
		const container = this.container.getBoundingClientRect();
		const pageHeight = container.height < window.innerHeight ? container.height : window.innerHeight;
		const pageWidth = container.width < window.innerWidth ? container.width : window.innerWidth;
		const views = this.visible();
		const sections = views.map((view) => {

			const { index, href } = view.section;
			const position = view.position();

			let startPos;
			let endPos;
			let stopPos;
			let totalPages;

			if (this.settings.axis === AXIS_V) {
				startPos = offset + container.top - position.top + used;
				endPos = startPos + pageHeight - used;
				stopPos = pageHeight;
				totalPages = this.layout.count(view.height, pageHeight).pages;
			} else {
				startPos = offset + container.left - position.left + used;
				endPos = startPos + pageWidth - used;
				stopPos = pageWidth;
				totalPages = this.layout.count(view.width, pageWidth).pages;
			}

			let currPage = Math.ceil(startPos / stopPos);
			let endPage = Math.ceil(endPos / stopPos);

			// Reverse page counts for horizontal rtl
			if (this.settings.axis === AXIS_H && 
				this.layout.direction === "rtl") {
				const tmp = currPage;
				currPage = totalPages - endPage;
				endPage = totalPages - tmp;
			}

			const pages = [];
			for (let i = currPage; i <= endPage; i++) {
				pages.push(i + 1);
			}

			const mapping = this.mapping.page(
				view.contents, 
				view.section.cfiBase, 
				startPos, 
				endPos
			);

			return {
				axis: this.settings.axis,
				href,
				index,
				pages,
				totalPages,
				mapping
			}
		});

		return sections;
	}

	/**
	 * Get location from paginated flow
	 * @returns {object[]} sections
	 * @private
	 */
	paginatedLocation() {

		let left = 0, used = 0;
		if (this.settings.fullsize) {
			left = window.scrollX;
		}
		
		const container = this.container.getBoundingClientRect();
		const views = this.visible();
		const sections = views.map((view) => {

			const { index, href } = view.section;
			const position = view.position();

			// Find mapping
			let offset;
			let startPos;
			let endPos;
			let pageWidth;

			if (this.layout.direction === "rtl") {
				offset = container.right - left;
				pageWidth = Math.min(Math.abs(offset - position.left), this.layout.width) - used;
				endPos = position.width - (position.right - offset) - used;
				startPos = endPos - pageWidth;
			} else {
				offset = container.left + left;
				pageWidth = Math.min(position.right - offset, this.layout.width) - used;
				startPos = offset - position.left + used;
				endPos = startPos + pageWidth;
			}

			used += pageWidth;

			let startPage = Math.floor(startPos / this.layout.pageWidth);
			let endPage = Math.floor(endPos / this.layout.pageWidth);

			// start page should not be negative
			if (startPage < 0) {
				startPage = 0;
				endPage = endPage + 1;
			}

			const totalPages = this.layout.count(view.width).pages;
			// Reverse page counts for rtl
			if (this.layout.direction === "rtl") {
				const tmp = startPage;
				startPage = totalPages - endPage;
				endPage = totalPages - tmp;
			}

			const pages = [];
			for (let i = startPage; i <= endPage; i++) {
				pages.push(i + 1);
			}

			const mapping = this.mapping.page(
				view.contents, 
				view.section.cfiBase, 
				startPos, 
				endPos
			);
			
			return {
				axis: this.settings.axis,
				href,
				index,
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

		if (this.settings.axis === AXIS_H &&
			position.right > container.left - offsetPrev &&
			position.left < container.right + offsetNext) {

			return true;

		} else if (this.settings.axis === AXIS_V &&
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

		const dir = this.layout.direction === "rtl" ? -1 : 1;

		if (silent) {
			this.ignore = true;
		}

		if (this.settings.fullsize) {
			window.scrollBy(x * dir, y * dir);
		} else {
			if (x) this.container.scrollLeft += x * dir;
			if (y) this.container.scrollTop += y;
		}
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

		if (this.settings.fullsize) {
			window.scrollTo(x, y);
		} else {
			this.container.scrollLeft = x;
			this.container.scrollTop = y;
		}
	}

	/**
	 * onScroll event handler
	 * @private
	 */
	onScroll() {

		let scrollTop;
		let scrollLeft;

		if (this.settings.fullsize) {
			scrollTop = window.scrollY;
			scrollLeft = window.scrollX;
		} else {
			scrollTop = this.container.scrollTop;
			scrollLeft = this.container.scrollLeft;
		}

		this.scrollTop = scrollTop;
		this.scrollLeft = scrollLeft;

		if (this.ignore) {
			this.ignore = false;
		} else {
			this.emit(EVENTS.MANAGERS.SCROLL, {
				top: scrollTop,
				left: scrollLeft
			});

			clearTimeout(this.afterScrolled);
			this.afterScrolled = setTimeout(() => {
				this.emit(EVENTS.MANAGERS.SCROLLED, {
					top: scrollTop,
					left: scrollLeft
				});
			}, 20);
		}
	}

	/**
	 * Get bounds
	 * @returns {DOMRect}
	 */
	bounds() {

		return this.stage.bounds();
	}

	/**
	 * Update Layout
	 */
	updateLayout() {

		this.stageSize = this.stage.size();

		if (this.isPaginated) {
			this.layout.calculate(
				this.stageSize.width,
				this.stageSize.height,
				this.settings.gap
			);
			// Set the look ahead offset for what is visible
			this.settings.offset = this.layout.delta / this.layout.divisor;
		} else {
			this.layout.calculate(
				this.stageSize.width,
				this.stageSize.height
			);
		}

		/**
		 * @member {Mapping} mapping
		 * @memberof DefaultViewManager
		 * @readonly
		 */
		this.mapping = new Mapping(this.layout, this.settings.axis);

		if (this.views.length > 0 &&
			this.layout.name === "pre-paginated") {
			this.display(this.views.first().section);
		}
	}

	/**
	 * Update writing mode
	 * @param {string} mode 
	 * @private
	 */
	updateWritingMode(mode) {

		this.writingMode = mode; // unused
	}

	/**
	 * Update axis
	 * @param {string} axis
	 * @param {boolean} [forceUpdate=false] force update
	 * @private
	 */
	updateAxis(axis, forceUpdate = false) {

		if (axis === this.settings.axis &&
			forceUpdate === false) {
			return;
		}

		this.settings.axis = axis;
		this.stage.axis(axis);

		if (this.mapping) {
			this.mapping = new Mapping(this.layout, axis);
		}
	}

	/**
	 * Get contents array from views
	 * @returns {object[]} [view.contents]
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
	 * isRendered
	 * @returns {boolean}
	 */
	isRendered() {

		return this.rendered;
	}
}

EventEmitter(DefaultViewManager.prototype);

export default DefaultViewManager;