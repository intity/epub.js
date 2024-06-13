import { extend, requestAnimationFrame } from "../../utils/core";
import Defer from "../../utils/defer";
import DefaultViewManager from "../default";
import Snap from "../helpers/snap";
import { EVENTS } from "../../utils/constants";
import debounce from "lodash/debounce";

/**
 * Continuous view manager
 * @extends {DefaultViewManager}
 */
class ContinuousViewManager extends DefaultViewManager {
	/**
	 * Constructor
	 * @param {Book} book
	 * @param {object} [options]
	 * @param {string} [options.axis]
	 * @param {object} [options.snap]
	 * @param {string} [options.method] values: `"blobUrl"` OR `"srcdoc"` OR `"write"`
	 * @param {string} [options.ignoreClass='']
	 * @param {string|object} [options.view='iframe']
	 */
	constructor(book, layout, options) {

		super(book, layout, options);
		/**
		 * @member {string} name
		 * @memberof ContinuousViewManager
		 * @readonly
		 */
		this.name = "continuous";
		this.settings = extend({
			axis: null,
			snap: null,
			view: "iframe",
			method: null,
			offset: 500,
			offsetDelta: 250,
			ignoreClass: "",
			writingMode: undefined,
			allowPopups: false,
			afterScrolledTimeout: 10,
			allowScriptedContent: false,
			resizeOnOrientationChange: true,
			forceEvenPages: false
		}, options || {});

		this.scrollTop = 0;
		this.scrollLeft = 0;
	}

	/**
	 * render
	 * @param {Element} element 
	 * @param {object} size 
	 * @override
	 */
	render(element, size) {

		super.render(element, size);

		if (this.paginated && this.settings.snap) {
			this.snapper = new Snap(this, this.settings.snap);
		}
	}

	/**
	 * display
	 * @param {Section} section 
	 * @param {string|number} [target] 
	 * @returns {Promise} displaying promise
	 * @override
	 */
	async display(section, target) {

		return super.display(section, target).then(() => this.fill());
	}

	/**
	 * fill
	 * @param {Defer} value
	 * @returns {Promise}
	 */
	fill(value) {

		const full = value || new Defer();

		this.q.enqueue(() => {
			return this.check();
		}).then((result) => {
			if (result) {
				this.fill(full); // recursive call
			} else {
				full.resolve();
			}
		});

		return full.promise;
	}

	/**
	 * moveTo
	 * @param {object} offset 
	 * @override
	 */
	moveTo(offset) {

		let distX = 0, distY = 0;
		//let offsetX = 0, offsetY = 0; // unused

		if (this.paginated) {
			distX = Math.floor(offset.left / this.layout.delta) * this.layout.delta;
			//offsetX = distX + this.settings.offsetDelta;
		} else {
			distY = offset.top;
			//offsetY = offset.top + this.settings.offsetDelta;
		}

		if (distX > 0 || distY > 0) {
			this.scrollBy(distX, distY, true);
		}
	}

	/**
	 * Remove Previous Listeners if present
	 * @param {*} view 
	 */
	removeShownListeners(view) {

		view.off(EVENTS.VIEWS.DISPLAYED);
	}

	/**
	 * add
	 * @param {Section} section 
	 * @returns {Promise}
	 * @override
	 */
	add(section) {

		const view = this.createView(section);

		view.on(EVENTS.VIEWS.DISPLAYED, () => {
			this.afterDisplayed(view);
		});

		view.on(EVENTS.VIEWS.RESIZED, (bounds) => {
			this.afterResized(view);
		});

		view.on(EVENTS.VIEWS.AXIS, (axis) => {
			this.updateAxis(axis);
		});

		view.on(EVENTS.VIEWS.WRITING_MODE, (mode) => {
			this.updateWritingMode(mode);
		});

		this.views.append(view);

		return view.display(this.request);
	}

	/**
	 * Append view
	 * @param {Section} section 
	 * @returns {*} view
	 * @override
	 */
	append(section) {

		const view = this.createView(section);

		view.on(EVENTS.VIEWS.DISPLAYED, () => {
			this.afterDisplayed(view);
		});

		view.on(EVENTS.VIEWS.RESIZED, (bounds) => {
			this.afterResized(view);
		});

		view.on(EVENTS.VIEWS.AXIS, (axis) => {
			this.updateAxis(axis);
		});

		view.on(EVENTS.VIEWS.WRITING_MODE, (mode) => {
			this.updateWritingMode(mode);
		});

		this.views.append(view);

		return view;
	}

	/**
	 * Prepend view
	 * @param {Section} section 
	 * @returns {*} view
	 * @override
	 */
	prepend(section) {

		const view = this.createView(section);

		view.on(EVENTS.VIEWS.DISPLAYED, () => {
			this.afterDisplayed(view);
		});

		view.on(EVENTS.VIEWS.RESIZED, (bounds) => {
			this.counter(bounds);
			this.afterResized(view);
		});

		view.on(EVENTS.VIEWS.AXIS, (axis) => {
			this.updateAxis(axis);
		});

		view.on(EVENTS.VIEWS.WRITING_MODE, (mode) => {
			this.updateWritingMode(mode);
		});

		this.views.prepend(view);

		return view;
	}

	/**
	 * update
	 * @param {number} [offset] 
	 * @returns {Promise}
	 */
	async update(offset) {

		const rect = this.bounds();
		const views = this.views;
		const _offset = typeof offset !== "undefined" ? offset : (this.settings.offset || 0);
		const updating = new Defer();
		const promises = [];

		for (let i = 0; i < views.length; i++) {

			const view = views[i];
			const isVisible = this.isVisible(view, _offset, _offset, rect);

			if (isVisible === true) {
				if (view.displayed) {
					view.show();
				} else {
					const displayed = view.display(this.request)
						.then((view) => {
							view.show();
						}, (err) => {
							view.hide();
							console.error(err);
						});
					promises.push(displayed);
				}
			} else {
				this.q.enqueue(view.destroy.bind(view));
				// console.log("hidden " + view.section.index, view.displayed);

				clearTimeout(this.trimTimeout);
				this.trimTimeout = setTimeout(() => {
					this.q.enqueue(this.trim.bind(this));
				}, 250);
			}
		}

		if (promises.length) {
			return Promise.all(promises).catch((err) => {
				updating.reject(err);
			});
		} else {
			updating.resolve();
			return updating.promise;
		}
	}

	/**
	 * check
	 * @param {number} [offsetLeft]
	 * @param {number} [offsetTop]
	 * @returns {Promise}
	 */
	check(offsetLeft, offsetTop) {

		const checking = new Defer();
		const newViews = [];
		const horizontal = (this.settings.axis === "horizontal");
		let delta = this.settings.offset || 0;

		if (offsetLeft && horizontal) {
			delta = offsetLeft;
		}

		if (offsetTop && !horizontal) {
			delta = offsetTop;
		}

		const bounds = this.bounds(); // bounds saved this until resize
		const visibleLength = horizontal ? Math.floor(bounds.width) : bounds.height;
		const contentLength = horizontal ? this.container.scrollWidth : this.container.scrollHeight;
		const writingMode = (this.writingMode && this.writingMode.indexOf("vertical") === 0) ? "vertical" : "horizontal";
		const rtlScrollType = this.settings.rtlScrollType;
		const rtl = this.layout.direction === "rtl";
		let offset = horizontal ? this.scrollLeft : this.scrollTop;

		if (this.settings.fullsize) {
			// Scroll offset starts at 0 and goes negative
			if ((horizontal && rtl && rtlScrollType === "negative") ||
				(!horizontal && rtl && rtlScrollType === "default")) {
				offset = offset * -1;
			}
		} else {
			// Scroll offset starts at width of element
			if (rtl && rtlScrollType === "default" && writingMode === "horizontal") {
				offset = contentLength - visibleLength - offset;
			}
			// Scroll offset starts at 0 and goes negative
			if (rtl && rtlScrollType === "negative" && writingMode === "horizontal") {
				offset = offset * -1;
			}
		}

		const append = () => {

			const last = this.views.last();
			const next = last && last.section.next();

			if (next) {
				newViews.push(this.append(next));
			}
		};

		const prepend = () => {

			const first = this.views.first();
			const prev = first && first.section.prev();

			if (prev) {
				newViews.push(this.prepend(prev));
			}
		};

		const end = offset + visibleLength + delta;
		const start = offset - delta;

		if (end >= contentLength) {
			append();
		}

		if (start < 0) {
			prepend();
		}

		const promises = newViews.map((view) => {
			return view.display(this.request);
		});

		if (newViews.length) {
			return Promise.all(promises).then(() => {
				return this.check();
			}).then(() => {
				// Check to see if anything new is on screen after rendering
				return this.update(delta);
			}, (err) => {
				return err;
			});
		} else {
			this.q.enqueue(() => {
				this.update();
			});
			checking.resolve(false);
			return checking.promise;
		}
	}

	/**
	 * trim
	 * @returns {Promise}
	 */
	trim() {

		const task = new Defer();
		const displayed = this.views.displayed();
		const first = displayed[0];
		const last = displayed[displayed.length - 1];
		const firstIndex = this.views.indexOf(first);
		const lastIndex = this.views.indexOf(last);
		const above = this.views.slice(0, firstIndex);
		const below = this.views.slice(lastIndex + 1);

		// Erase all but last above
		for (let i = 0; i < above.length - 1; i++) {
			this.erase(above[i], above);
		}

		// Erase all except first below
		for (let j = 1; j < below.length; j++) {
			this.erase(below[j]);
		}

		task.resolve();
		return task.promise;
	}

	/**
	 * erase
	 * @param {*} view 
	 * @param {*} above 
	 */
	erase(view, above) {

		let prevTop;
		let prevLeft;

		if (this.settings.fullsize) {
			prevTop = window.scrollY;
			prevLeft = window.scrollX;
		} else {
			prevTop = this.container.scrollTop;
			prevLeft = this.container.scrollLeft;
		}

		const bounds = view.bounds();
		this.views.remove(view);

		if (above) {
			if (this.settings.axis === "vertical") {
				this.scrollTo(0, prevTop - bounds.height, true);
			} else {
				if (this.layout.direction === "rtl") {
					if (!this.settings.fullsize) {
						this.scrollTo(prevLeft, 0, true);
					} else {
						this.scrollTo(prevLeft + Math.floor(bounds.width), 0, true);
					}
				} else {
					this.scrollTo(prevLeft - Math.floor(bounds.width), 0, true);
				}
			}
		}
	}

	/**
	 * addEventListeners
	 * @override
	 */
	addEventListeners() {

		window.onpagehide = (e) => {
			this.ignore = true;
			this.destroy();
		};

		this.addScrollListeners();
	}

	/**
	 * addScrollListeners
	 * @private
	 */
	addScrollListeners() {

		this.tick = requestAnimationFrame;

		let dir;
		if (this.layout.direction === "rtl" &&
			this.settings.rtlScrollType === "default") {
			dir = -1;
		} else {
			dir = 1;
		}

		this.scrollDeltaVert = 0;
		this.scrollDeltaHorz = 0;

		let scroller;
		if (!this.settings.fullsize) {
			scroller = this.container;
			this.scrollTop = this.container.scrollTop;
			this.scrollLeft = this.container.scrollLeft;
		} else {
			scroller = window;
			this.scrollTop = window.scrollY * dir;
			this.scrollLeft = window.scrollX * dir;
		}

		scroller.addEventListener("scroll", this.onScroll.bind(this));
		this._scrolled = debounce(this.scrolled.bind(this), 30);
		this.didScroll = false;
	}

	/**
	 * removeEventListeners
	 * @override
	 */
	removeEventListeners() {

		let scroller;
		if (this.settings.fullsize) {
			scroller = window;
		} else {
			scroller = this.container;
		}

		scroller.removeEventListener("scroll", this.onScroll.bind(this));
	}

	/**
	 * onScroll
	 * @override
	 */
	onScroll() {

		let scrollTop;
		let scrollLeft;
		let dir;
		if (this.layout.direction === "rtl" &&
			this.settings.rtlScrollType === "default") {
			dir = -1;
		} else {
			dir = 1;
		}

		if (!this.settings.fullsize) {
			scrollTop = this.container.scrollTop;
			scrollLeft = this.container.scrollLeft;
		} else {
			scrollTop = window.scrollY * dir;
			scrollLeft = window.scrollX * dir;
		}

		this.scrollTop = scrollTop;
		this.scrollLeft = scrollLeft;

		if (!this.ignore) {

			this._scrolled();

		} else {
			this.ignore = false;
		}

		this.scrollDeltaVert += Math.abs(scrollTop - this.prevScrollTop);
		this.scrollDeltaHorz += Math.abs(scrollLeft - this.prevScrollLeft);

		this.prevScrollTop = scrollTop;
		this.prevScrollLeft = scrollLeft;

		clearTimeout(this.scrollTimeout);
		this.scrollTimeout = setTimeout(() => {
			this.scrollDeltaVert = 0;
			this.scrollDeltaHorz = 0;
		}, 150);

		clearTimeout(this.afterScrolled);

		this.didScroll = false;
	}

	/**
	 * scrolled
	 * @private
	 */
	scrolled() {

		this.q.enqueue(() => {
			return this.check();
		});

		this.emit(EVENTS.MANAGERS.SCROLL, {
			top: this.scrollTop,
			left: this.scrollLeft
		});

		clearTimeout(this.afterScrolled);
		this.afterScrolled = setTimeout(() => {

			// Don't report scroll if we are about the snap
			if (this.snapper &&
				this.snapper.supportsTouch() &&
				this.snapper.needsSnap()) {
				return;
			}

			this.emit(EVENTS.MANAGERS.SCROLLED, {
				top: this.scrollTop,
				left: this.scrollLeft
			});

		}, this.settings.afterScrolledTimeout);
	}

	/**
	 * next
	 * @override
	 */
	next() {

		let delta;
		if (this.layout.name === "pre-paginated" &&
			this.layout.spread === "auto") {
			delta = this.layout.delta * 2;
		} else {
			delta = this.layout.delta;
		}

		if (this.views.length === 0) return;
		if (this.paginated &&
			this.settings.axis === "horizontal") {
			this.scrollBy(delta, 0, true);
		} else {
			this.scrollBy(0, this.layout.height, true);
		}

		this.q.enqueue(() => {
			return this.check();
		});
	}

	/**
	 * prev
	 * @override
	 */
	prev() {

		let delta;
		if (this.layout.name === "pre-paginated" &&
			this.layout.spread === "auto") {
			delta = this.layout.delta * 2;
		} else {
			delta = this.layout.delta;
		}

		if (this.views.length === 0) return;

		if (this.paginated &&
			this.settings.axis === "horizontal") {
			this.scrollBy(-delta, 0, true);
		} else {
			this.scrollBy(0, -this.layout.height, true);
		}

		this.q.enqueue(() => {
			return this.check();
		});
	}

	/**
	 * destroy
	 * @override
	 */
	destroy() {

		super.destroy();

		if (this.snapper) {
			this.snapper.destroy();
		}
	}
}

export default ContinuousViewManager;