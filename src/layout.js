import { EVENTS } from "./utils/constants";
import EventEmitter from "event-emitter";

/**
 * Figures out the CSS values to apply for a layout
 */
class Layout {
	/**
	 * Constructor
	 * @param {object} options 
	 * @param {string} [options.name='reflowable'] values: `"reflowable"` OR `"pre-paginated"`
	 * @param {string} [options.flow='paginated'] values: `"paginated"` OR `"scrolled"`
	 * @param {string} [options.spread='auto'] values: `"auto"` OR `"none"`
	 * @param {string} [options.direction='ltr'] values: `"ltr"` OR `"rtl"`
	 * @param {string} [options.orientation='auto'] values: `"auto"` OR `"landscape"` OR `"portrait"`
	 * @param {number} [options.minSpreadWidth=800]
	 */
	constructor(options) {
		/**
		 * @member {string} name Layout name
		 * @memberof Layout
		 * @protected
		 */
		this.name = "reflowable";
		/**
		 * @member {string} flow
		 * @memberof
		 * @readonly
		 */
		this.flow = "paginated";
		/**
		 * @member {boolean} spread
		 * @memberof Layout
		 * @readonly
		 */
		this.spread = "auto";
		/**
		 * @member {string} direction
		 * @memberof Layout
		 * @readonly
		 */
		this.direction = "ltr";
		/**
		 * @member {string} orientation no implementation
		 * @memberof Layout
		 * @readonly
		 */
		this.orientation = "auto";
		/**
		 * @member {string} viewport no implementation
		 * @memberof Layout
		 * @readonly
		 */
		this.viewport = "";
		/**
		 * @member {number} minSpreadWidth
		 * @memberof Layout
		 * @readonly
		 */
		this.minSpreadWidth = 800;
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

		this.set({
			name: options && options.name,
			flow: options && options.flow,
			spread: options && options.spread,
			direction: options && options.direction,
			orientation: options && options.orientation,
			minSpreadWidth: options && options.minSpreadWidth
		});
	}

	/**
	 * Set options
	 * @param {object} options
	 */
	set(options) {

		const error = (name) => console.error(`Invalid '${name}' property type`);
		Object.keys(options).forEach(opt => {
			const value = options[opt];
			if (this[opt] === value || typeof value === "undefined") {
				delete options[opt];
			} else if (opt === "name" || opt === "direction" || opt === "orientation") {
				if (typeof value === "string") {
					this[opt] = options[opt];
				} else error(opt);
			} else if (opt === "flow") {
				if (typeof value === "string") {
					switch (value) {
						case "scrolled":
						case "scrolled-doc":
						case "scrolled-continuous":
							this.flow = "scrolled";
							this.spread = "none"; // autocomplete
							break;
						default:
							this.flow = "paginated";
							break;
					}
				} else error(opt);
			} else if (opt === "spread") {
				if (typeof value === "string") {
					switch (value) {
						case "auto":
						case "both":
							this.spread = "auto";
							break;
						default:
							this.spread = "none";
							break;
					}
				} else error(opt);
			} else if (
				opt === "width" ||
				opt === "height" || 
				opt === "gap" || 
				opt === "minSpreadWidth") {
				if (typeof value === "number") {
					if (value >= 0) {
						this[opt] = options[opt];
					}
				} else error(opt);
			}
		});

		this.calculate();

		if (Object.keys(options).length) {
			this.emit(EVENTS.LAYOUT.UPDATED, this, options);
		}
	}

	/**
	 * Calculate the dimensions of the pagination
	 * @param {number} [width] width of the rendering
	 * @param {number} [height] height of the rendering
	 * @param {number} [gap] width of the gap between columns
	 */
	calculate(width, height, gap) {

		if (typeof width === "undefined") {
			width = this.width;
		}
		if (typeof height === "undefined") {
			height = this.height;
		}

		//-- Check the width and create even width columns

		let divisor;
		if (this.spread === "auto" && width >= this.minSpreadWidth) {
			divisor = 2;
		} else {
			divisor = 1;
		}

		const section = Math.floor(width / 12);

		if (this.name === "reflowable" && this.flow === "paginated" && !(gap >= 0)) {
			gap = ((section % 2 === 0) ? section : section - 1);
		}
		if (this.name === "pre-paginated") {
			gap = 0;
		}
		if (typeof gap === "undefined") {
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
		this.gap = gap;
		this.divisor = divisor;
	}

	/**
	 * Apply Css to a Document
	 * @param {Contents} contents
	 * @param {Section} [section] 
	 * @param {string} [axis] 
	 * @return {Promise}
	 */
	format(contents, section, axis) {

		let formating;
		if (this.name === "pre-paginated") {
			formating = contents.fit(this.columnWidth, this.height, section);
		} else if (this.flow === "paginated") {
			formating = contents.columns(this.width, this.height, this.columnWidth, this.gap, this.direction);
		} else if (axis && axis === "horizontal") {
			formating = contents.size(null, this.height);
		} else {
			formating = contents.size(this.width, null);
		}

		return formating; // might be a promise in some View Managers
	}

	/**
	 * Count number of pages
	 * @param {number} totalLength
	 * @param {number} [pageLength]
	 * @return {{spreads: number, pages: number}}
	 */
	count(totalLength, pageLength) {

		let spreads, pages;

		if (this.name === "pre-paginated") {
			spreads = 1;
			pages = 1;
		} else if (this.flow === "paginated") {
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
}

EventEmitter(Layout.prototype);

export default Layout;