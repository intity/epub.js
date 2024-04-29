import { extend } from "./utils/core";
import { EVENTS } from "./utils/constants";
import EventEmitter from "event-emitter";

/**
 * Figures out the CSS values to apply for a layout
 */
class Layout {
	/**
	 * Constructor
	 * @param {object} options 
	 * @param {string} [options.layout='reflowable'] values: `"reflowable"` OR `"pre-paginated"`
	 * @param {string} [options.spread] values: `"none"` OR `"auto"`
	 * @param {number} [options.minSpreadWidth=800]
	 * @param {boolean} [options.evenSpreads=false]
	 */
	constructor(options) {

		this.settings = options;
		/**
		 * @member {string} name Layout name
		 * @memberof Layout
		 * @protected
		 */
		this.name = options.layout || "reflowable";
		this._spread = (options.spread === "none") ? false : true;
		/**
		 * @member {number} minSpreadWidth
		 * @memberof Layout
		 * @readonly
		 */
		this.minSpreadWidth = options.minSpreadWidth || 800;
		/**
		 * @member {boolean} evenSpreads
		 * @memberof Layout
		 * @readonlys
		 */
		this.evenSpreads = options.evenSpreads || false;
		this.flow(options.flow);
		/**
		 * @member {number} width Layout width
		 * @memberof Layout
		 * @readonly
		 */
		this.width = 0;
		/**
		 * @member {number} height Layout height
		 * @memberof Layout
		 * @readonly
		 */
		this.height = 0;
		/**
		 * @member {number} spreadWidth Spread width
		 * @memberof Layout
		 * @readonly
		 */
		this.spreadWidth = 0;
		/**
		 * @member {number} delta
		 * @memberof Layout
		 * @readonly
		 */
		this.delta = 0;
		/**
		 * @member {number} columnWidth Column width
		 * @memberof Layout
		 * @readonly
		 */
		this.columnWidth = 0;
		/**
		 * @member {number} gap
		 * @memberof Layout
		 * @readonly
		 */
		this.gap = 0;
		/**
		 * @member {number} divisor
		 * @memberof Layout
		 * @readonly
		 */
		this.divisor = 1;
	}

	/**
	 * Switch the flow between paginated and scrolled
	 * @param {string} str `"paginated"` OR `"scrolled"`
	 * @return {string} Simplified flow
	 */
	flow(str) {

		if (typeof str === "string") {
			if (str === "scrolled" ||
				str === "scrolled-continuous" ||
				str === "scrolled-doc") {
				this._flow = "scrolled";
			} else {
				this._flow = "paginated";
			}
		}
		return this._flow;
	}

	/**
	 * Switch between using spreads or not, and set the
	 * width at which they switch to single.
	 * @param  {string} [spread] `"none"` OR `"always"` OR `"auto"`
	 * @param  {number} [min] integer in pixels
	 * @return {boolean} true OR false
	 */
	spread(spread, min) {

		if (spread) {
			this._spread = spread === "none" ? false : true;
		}

		if (min >= 0) {
			this.minSpreadWidth = min;
		}

		return this._spread;
	}

	/**
	 * Calculate the dimensions of the pagination
	 * @param  {number} width width of the rendering
	 * @param  {number} height height of the rendering
	 * @param  {number} [gap] width of the gap between columns
	 */
	calculate(width, height, gap) {

		//-- Check the width and create even width columns

		let divisor;
		if (this._spread && width >= this.minSpreadWidth) {
			divisor = 2;
		} else {
			divisor = 1;
		}

		const section = Math.floor(width / 12);

		if (this.name === "reflowable" && this._flow === "paginated" && !(gap >= 0)) {
			gap = ((section % 2 === 0) ? section : section - 1);
		}

		if (this.name === "pre-paginated") {
			gap = 0;
		}

		let columnWidth;
		let pageWidth;
		//-- Double Page
		if (divisor > 1) {
			columnWidth = (width / divisor) - gap;
			pageWidth = columnWidth + gap;
		} else {
			columnWidth = width;
			pageWidth = width;
		}

		if (this.name === "pre-paginated" && divisor > 1) {
			width = columnWidth;
		}

		this.width = width;
		this.height = height;
		this.spreadWidth = (columnWidth * divisor) + gap;
		this.pageWidth = pageWidth;
		this.delta = width;
		this.columnWidth = columnWidth;
		this.gap = gap || 0;
		this.divisor = divisor;
	}

	/**
	 * Apply Css to a Document
	 * @param  {Contents} contents
	 * @return {Promise}
	 */
	format(contents, section, axis) {

		let formating;
		if (this.name === "pre-paginated") {
			formating = contents.fit(this.columnWidth, this.height, section);
		} else if (this._flow === "paginated") {
			formating = contents.columns(this.width, this.height, this.columnWidth, this.gap, this.settings.direction);
		} else if (axis && axis === "horizontal") {
			formating = contents.size(null, this.height);
		} else {
			formating = contents.size(this.width, null);
		}

		return formating; // might be a promise in some View Managers
	}

	/**
	 * Count number of pages
	 * @param  {number} totalLength
	 * @param  {number} pageLength
	 * @return {{spreads: Number, pages: Number}}
	 */
	count(totalLength, pageLength) {

		let spreads, pages;

		if (this.name === "pre-paginated") {
			spreads = 1;
			pages = 1;
		} else if (this._flow === "paginated") {
			pageLength = pageLength || this.delta;
			spreads = Math.ceil(totalLength / pageLength);
			pages = spreads * this.divisor;
		} else { // scrolled
			pageLength = pageLength || this.height;
			spreads = Math.ceil(totalLength / pageLength);
			pages = spreads;
		}

		return {
			spreads,
			pages
		}
	}

	/**
	 * Update props that have changed (unused)
	 * @param  {object} props
	 * @private
	 */
	update(props) {
		// Remove props that haven't changed
		Object.keys(props).forEach((propName) => {
			if (this.props[propName] === props[propName]) {
				delete props[propName];
			}
		});

		if (Object.keys(props).length > 0) {
			let newProps = extend(this.props, props);
			this.emit(EVENTS.LAYOUT.UPDATED, newProps, props);
		}
	}
}

EventEmitter(Layout.prototype);

export default Layout;