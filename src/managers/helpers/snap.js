import EventEmitter from "event-emitter";
import Defer from "../../utils/defer";
import { extend } from "../../utils/core";
import { EVENTS } from "../../utils/constants";

// easing equations from https://github.com/danro/easing-js/blob/master/easing.js
const PI_D2 = (Math.PI / 2);
const EASING_EQUATIONS = {
	easeOutSine: (pos) => {
		return Math.sin(pos * PI_D2);
	},
	easeInOutSine: (pos) => {
		return (-0.5 * (Math.cos(Math.PI * pos) - 1));
	},
	easeInOutQuint: (pos) => {
		if ((pos /= 0.5) < 1) {
			return 0.5 * Math.pow(pos, 5);
		}
		return 0.5 * (Math.pow((pos - 2), 5) + 2);
	},
	easeInCubic: (pos) => {
		return Math.pow(pos, 3);
	}
};

/**
 * Snap
 */
class Snap {
	/**
	 * Constructor
	 * @param {*} manager
	 * @param {object} [options]
	 * @param {number} [options.duration=300]
	 * @param {number} [options.minVelocity=0.2]
	 * @param {number} [options.minDistance=10]
	 */
	constructor(manager, options) {

		this.settings = extend({
			duration: 300,
			minVelocity: 0.2,
			minDistance: 10,
			easing: EASING_EQUATIONS['easeInCubic']
		}, options || {});

		if (this.supportsTouch()) {
			this.setup(manager);
		}
	}

	/**
	 * setup
	 * @param {*} manager 
	 */
	setup(manager) {

		this.manager = manager;
		this.layout = this.manager.layout;
		this.fullsize = this.manager.settings.fullsize;

		if (this.fullsize) {
			this.element = this.manager.stage.element;
			this.scroller = window;
			this.disableScroll();
		} else {
			this.element = this.manager.stage.container;
			this.scroller = this.element;
		}

		// set lookahead offset to page width
		this.manager.settings.offset = this.layout.width;
		this.manager.settings.afterScrolledTimeout = this.settings.duration * 2;
		this.isVertical = this.manager.settings.axis === "vertical";

		// disable snapping if not paginated or axis in not horizontal
		if (!this.manager.paginated || this.isVertical) {
			return;
		}

		this.touchCanceler = false;
		this.resizeCanceler = false;
		this.snapping = false;

		this.scrollLeft;
		this.scrollTop;

		this.startTouchX = undefined;
		this.startTouchY = undefined;
		this.startTime = undefined;
		this.endTouchX = undefined;
		this.endTouchY = undefined;
		this.endTime = undefined;

		this.addListeners();
	}

	/**
	 * supportsTouch
	 * @returns {boolean}
	 */
	supportsTouch() {

		return ("ontouchstart" in window) || window.DocumentTouch && document instanceof DocumentTouch;
	}

	/**
	 * disableScroll
	 * @private
	 */
	disableScroll() {

		//this.element.style.overflow = "hidden";
	}

	/**
	 * enableScroll
	 * @private
	 */
	enableScroll() {

		//this.element.style.overflow = null;
	}

	/**
	 * addListeners
	 * @private
	 */
	addListeners() {

		window.addEventListener("resize", this.onResize.bind(this));

		this.scroller.addEventListener("scroll", this.onScroll.bind(this));
		this.scroller.addEventListener("touchstart", this.onTouchStart.bind(this), { passive: true });
		this.scroller.addEventListener("touchmove", this.onTouchMove.bind(this), { passive: true });
		this.scroller.addEventListener("touchend", this.onTouchEnd.bind(this), { passive: true });

		this.on("touchstart", this.onTouchStart.bind(this));
		this.on("touchmove", this.onTouchMove.bind(this));
		this.on("touchend", this.onTouchEnd.bind(this));

		this.manager.on(EVENTS.MANAGERS.ADDED, this.afterDisplayed.bind(this));
	}

	/**
	 * removeListeners
	 * @private
	 */
	removeListeners() {

		window.removeEventListener("resize", this.onResize.bind(this));

		this.scroller.removeEventListener("scroll", this.onScroll.bind(this));
		this.scroller.removeEventListener("touchstart", this.onTouchStart.bind(this), { passive: true });
		this.scroller.removeEventListener("touchmove", this.onTouchMove.bind(this), { passive: true });
		this.scroller.removeEventListener("touchend", this.onTouchEnd.bind(this), { passive: true });

		this.off("touchstart", this.onTouchStart.bind(this));
		this.off("touchmove", this.onTouchMove.bind(this));
		this.off("touchend", this.onTouchEnd.bind(this));

		this.manager.off(EVENTS.MANAGERS.ADDED, this.afterDisplayed.bind(this));
	}

	/**
	 * afterDisplayed
	 * @param {*} view
	 * @private
	 */
	afterDisplayed(view) {

		const contents = view.contents;
		["touchstart", "touchmove", "touchend"].forEach((e) => {
			contents.on(e, (ev) => this.triggerViewEvent(ev, contents));
		});
	}

	/**
	 * triggerViewEvent
	 * @param {Event} e 
	 * @param {Contents} contents 
	 * @private
	 */
	triggerViewEvent(e, contents) {

		this.emit(e.type, e, contents);
	}

	/**
	 * onScroll
	 * @param {Event} e 
	 * @private
	 */
	onScroll(e) {

		this.scrollLeft = this.fullsize ? window.scrollX : this.scroller.scrollLeft;
		this.scrollTop = this.fullsize ? window.scrollY : this.scroller.scrollTop;
	}

	/**
	 * onResize
	 * @param {Event} e 
	 * @private
	 */
	onResize(e) {

		this.resizeCanceler = true;
	}

	/**
	 * onTouchStart
	 * @param {Event} e 
	 * @private
	 */
	onTouchStart(e) {

		const { screenX, screenY } = e.touches[0];

		if (this.fullsize) {
			this.enableScroll();
		}

		this.touchCanceler = true;

		if (!this.startTouchX) {
			this.startTouchX = screenX;
			this.startTouchY = screenY;
			this.startTime = new Date().getTime();
		}

		this.endTouchX = screenX;
		this.endTouchY = screenY;
		this.endTime = new Date().getTime();
	}

	/**
	 * onTouchMove
	 * @param {Event} e 
	 * @private
	 */
	onTouchMove(e) {

		const { screenX, screenY } = e.touches[0];
		const deltaY = Math.abs(screenY - this.endTouchY);

		this.touchCanceler = true;

		if (!this.fullsize && deltaY < 10) {
			this.element.scrollLeft -= screenX - this.endTouchX;
		}

		this.endTouchX = screenX;
		this.endTouchY = screenY;
		this.endTime = new Date().getTime();
	}

	/**
	 * onTouchEnd
	 * @param {Event} e 
	 * @private
	 */
	onTouchEnd(e) {

		if (this.fullsize) {
			this.disableScroll();
		}

		this.touchCanceler = false;
		let swipped = this.wasSwiped();

		if (swipped !== 0) {
			this.snap(swipped);
		} else {
			this.snap();
		}

		this.startTouchX = undefined;
		this.startTouchY = undefined;
		this.startTime = undefined;
		this.endTouchX = undefined;
		this.endTouchY = undefined;
		this.endTime = undefined;
	}

	/**
	 * wasSwiped
	 * @returns {number}
	 */
	wasSwiped() {

		const snapWidth = this.layout.pageWidth * this.layout.divisor;
		const distance = (this.endTouchX - this.startTouchX);
		const absolute = Math.abs(distance);
		const time = this.endTime - this.startTime;
		const velocity = (distance / time);
		const minVelocity = this.settings.minVelocity;

		if (absolute <= this.settings.minDistance || absolute >= snapWidth) {
			return 0;
		}

		if (velocity > minVelocity) {
			return -1; // previous
		} else if (velocity < -minVelocity) {
			return 1; // next
		}
	}

	/**
	 * needsSnap
	 * @returns {boolean}
	 */
	needsSnap() {

		const left = this.scrollLeft;
		const snapWidth = this.layout.pageWidth * this.layout.divisor;
		return (left % snapWidth) !== 0;
	}

	/**
	 * snap
	 * @param {number} [howMany=0] 
	 * @returns {Promise}
	 */
	snap(howMany = 0) {

		const left = this.scrollLeft;
		const snapWidth = this.layout.pageWidth * this.layout.divisor;
		let snapTo = Math.round(left / snapWidth) * snapWidth;

		if (howMany) {
			snapTo += (howMany * snapWidth);
		}

		return this.smoothScrollTo(snapTo);
	}

	/**
	 * smoothScrollTo
	 * @param {number} destination 
	 * @returns {Promise}
	 */
	smoothScrollTo(destination) {

		const deferred = new Defer();
		const start = this.scrollLeft;
		const startTime = new Date().getTime();
		const duration = this.settings.duration;

		this.snapping = true;

		// add animation loop
		const tick = () => {

			const now = new Date().getTime();
			const time = Math.min(1, ((now - startTime) / duration));

			if (this.touchCanceler || this.resizeCanceler) {
				this.resizeCanceler = false;
				this.snapping = false;
				deferred.resolve();
				return;
			}

			if (time < 1) {
				window.requestAnimationFrame(tick.bind(this));
				this.scrollTo(start + ((destination - start) * time), 0);
			} else {
				this.scrollTo(destination, 0);
				this.snapping = false;
				deferred.resolve();
			}
		}

		tick.call(this);

		return deferred.promise;
	}

	/**
	 * scrollTo
	 * @param {number} [left=0] 
	 * @param {number} [top=0] 
	 */
	scrollTo(left = 0, top = 0) {

		if (this.fullsize) {
			window.scroll(left, top);
		} else {
			this.scroller.scrollLeft = left;
			this.scroller.scrollTop = top;
		}
	}

	/**
	 * destroy
	 * @returns {void}
	 */
	destroy() {

		if (typeof this.scroller === "undefined") {
			return;
		}

		if (this.fullsize) {
			this.enableScroll();
		}

		this.removeListeners();
		this.scroller = undefined;
	}
}

EventEmitter(Snap.prototype);

export default Snap;