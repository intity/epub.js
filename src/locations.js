import EventEmitter from "event-emitter";
import Queue from "./utils/queue";
import EpubCFI from "./epubcfi";
import Defer from "./utils/defer";
import { EVENTS } from "./utils/constants";
import { qs, sprint, locationOf } from "./utils/core";

/**
 * Find Locations for a Book
 */
class Locations extends Array {
	/**
	 * Constructor
	 * @param {Sections} [sections]
	 * @param {method} [request]
	 * @param {number} [pause=100]
	 */
	constructor(sections, request, pause) {

		super();
		this.sections = sections;
		this.pause = pause || 100;
		this.break = 150;
		this.request = request;
		/**
		 * @member {object} current Current Location
		 * @property {string} current.cfi
		 * @property {number} current.index
		 * @property {number} current.percentage
		 * @memberof Locations
		 * @readonly
		 */
		this.current = {
			cfi: null,
			index: -1,
			percentage: 0
		};
		this.processingTimeout = undefined;
		this.q = new Queue(this);
	}

	/**
	 * Load all of sections in the book to generate locations
	 * @param {number} [chars] how many chars to split on (default:150)
	 * @return {Promise} locations
	 */
	async generate(chars) {

		if (Number.isInteger(chars)) {
			this.break = chars;
		} else {
			this.break = parseInt(chars)
			console.warn("The input value type is not an integer")
		}

		this.q.pause();
		this.sections.each(section => {

			if (section.linear) {
				this.q.enqueue(this.process.bind(this), section);
			}
		});

		return this.q.run().then(() => {

			if (this.length) {
				this.current.cfi = [0];
				this.current.index = 0;
				this.current.percentage = 0;
			}
			return this;
		});
	}

	/**
	 * createRange
	 * @returns {object}
	 */
	createRange() {

		return {
			startContainer: undefined,
			startOffset: undefined,
			endContainer: undefined,
			endOffset: undefined
		};
	}

	/**
	 * process
	 * @param {Section} section 
	 * @returns {Promise}
	 */
	async process(section) {

		return section.load(this.request).then((contents) => {
			const completed = new Defer();
			const locations = this.parse(contents, section.cfiBase);
			locations.forEach(i => this.push(i));

			section.unload();

			this.processingTimeout = setTimeout(() => completed.resolve(locations), this.pause);
			return completed.promise;
		});
	}

	/**
	 * parse
	 * @param {Element} contents 
	 * @param {string} cfiBase 
	 * @param {number} [chars] 
	 * @returns {Locations}
	 */
	parse(contents, cfiBase, chars) {

		const locations = new Locations();
		locations.break = chars || this.break;
		let range;
		let counter = 0;
		let prev;
		const parser = (node) => {

			if (node.textContent.trim().length === 0) {
				return false; // continue
			}

			// Start range
			if (counter == 0) {
				range = this.createRange();
				range.startContainer = node;
				range.startOffset = 0;
			}

			const len = node.length;
			let dist = locations.break - counter;
			let pos = 0;

			// Node is smaller than a break,
			// skip over it
			if (dist > len) {
				counter += len;
				pos = len;
			}

			while (pos < len) {
				dist = locations.break - counter;

				if (counter === 0) {
					// Start new range
					pos += 1;
					range = this.createRange();
					range.startContainer = node;
					range.startOffset = pos;
				}

				// Gone over
				if (pos + dist >= len) {
					// Continue counter for next node
					counter += len - pos;
					// break
					pos = len;
					// At End
				} else {
					// Advance pos
					pos += dist;
					// End the previous range
					range.endContainer = node;
					range.endOffset = pos;
					const cfi = new EpubCFI(range, cfiBase).toString();
					locations.push(cfi);
					counter = 0;
				}
			}
			prev = node;
		};

		const doc = contents.ownerDocument;
		const body = qs(doc, "body");
		sprint(body, parser.bind(this));

		// Close remaining
		if (range && range.startContainer && prev) {
			range.endContainer = prev;
			range.endOffset = prev.length;
			const cfi = new EpubCFI(range, cfiBase).toString();
			locations.push(cfi);
			counter = 0;
		}

		return locations;
	}

	/**
	 * Get a location from an EpubCFI
	 * @param {string} value EpubCFI string format
	 * @return {number} Location index
	 */
	locationFromCfi(value) {

		if (this.length === 0) return -1;
		const cmp = EpubCFI.prototype.compare;
		const cfi = new EpubCFI(value);
		const loc = locationOf(cfi, this, cmp);
		const ind = this.length - 1;
		return loc > ind ? ind : loc;
	}

	/**
	 * Get a percentage position in locations from an EpubCFI
	 * @param {string} cfi EpubCFI string format
	 * @return {number} Percentage
	 */
	percentageFromCfi(cfi) {

		if (this.length === 0) {
			return 0;
		}
		// Find closest cfi
		const loc = this.locationFromCfi(cfi);
		// Get percentage in total
		return this.percentageFromLocation(loc);
	}

	/**
	 * Get a percentage position from a location index
	 * @param {number} loc Location index
	 * @return {number} Percentage
	 */
	percentageFromLocation(loc) {

		if (this.length === 0 ||
			this.length >= loc && loc < 0) {
			return 0;
		}
		return (loc / (this.length - 1));
	}

	/**
	 * Get an EpubCFI from location index
	 * @param {number} loc Location index
	 * @return {string|null} EpubCFI string format
	 */
	cfiFromLocation(loc) {

		if (this.length === 0 ||
			this.length >= loc && loc < 0) {
			return null;
		}

		return this[loc];
	}

	/**
	 * Get an EpubCFI from location percentage
	 * @param {number} percentage
	 * @return {string|null} EpubCFI string format
	 */
	cfiFromPercentage(percentage) {

		if (percentage > 1) {
			console.warn("Normalize cfiFromPercentage value to between 0 - 1");
		}

		// Make sure 1 goes to very end
		if (percentage >= 1) {
			const cfi = new EpubCFI(this[this.length - 1]);
			cfi.collapse();
			return cfi.toString();
		}

		const loc = Math.ceil((this.length - 1) * percentage);
		return this.cfiFromLocation(loc);
	}

	/**
	 * Load locations from JSON
	 * @param {string} locations
	 */
	load(locations) {

		if (typeof locations === "string") {
			this.splice(0);
			const data = JSON.parse(locations);
			data.items.forEach(i => this.push(i));
			this.break = data.break;
			this.pause = data.pause;
			this.current.cfi = this[data.index];
			this.current.index = data.index;
			this.current.percentage = this.percentageFromLocation(data.index);
		} else {
			console.error("Invalid argument type");
		}

		return this;
	}

	/**
	 * Save locations to JSON
	 * @return {json}
	 */
	save() {

		return JSON.stringify({
			items: this,
			index: this.current.index,
			break: this.break,
			pause: this.pause
		});
	}

	/**
	 * Set current location
	 * @param {object} options
	 * @param {string} [options.cfi] EpubCFI string format
	 * @param {number} [options.index] Location index
	 * @param {number} [options.percentage] Percentage
	 */
	set(options) {

		if (this.length === 0) return;

		const setup = (index, value) => {

			if (index >= 0 && index < this.length) {
				this.current.cfi = this[index];
				this.current.index = index;
				this.current.percentage = value || index / (this.length - 1);
			}
		};

		Object.keys(options).forEach(opt => {
			const value = options[opt];
			if (this.current[opt] === value || typeof value === "undefined") {
				delete options[opt];
			} else if (typeof value === "string") {
				if (opt === "cfi" && EpubCFI.prototype.isCfiString(value)) {
					const index = this.locationFromCfi(value);
					setup(index);
				}
			} else if (typeof value === "number") {
				if (opt === "index") {
					setup(value);
				} else if (opt === "percentage") {
					if (value >= 0 && value <= 1) {
						const index = Math.ceil((this.length - 1) * value);
						setup(index, value);
					} else if (value > 1) {
						const cfi = new EpubCFI(this[this.length - 1]);
						cfi.collapse();
						this.current.cfi = cfi.toString();
						this.current.index = this.locationFromCfi(this.current.cfi);
						this.current.percentage = value;
						console.warn("The input value must be normalized in the range 0-1");
					}
				}
			} else {
				console.error("Invalid value type to " + opt);
			}
		});

		if (Object.keys(options).length) {
			/**
			 * Current location changed
			 * @event changed
			 * @param {object} current Current location
			 * @param {object} changed Changed properties
			 * @memberof Locations
			 */
			this.emit(EVENTS.LOCATIONS.CHANGED, this.current, options);
		}
	}

	/**
	 * destroy
	 */
	destroy() {

		this.sections = undefined;
		this.pause = undefined;
		this.break = undefined;
		this.request = undefined;
		this.current.cfi = null;
		this.current.index = -1;
		this.current.percentage = 0;
		this.q.stop();
		this.q = undefined;
		this.splice(0);
		clearTimeout(this.processingTimeout);
	}
}

EventEmitter(Locations.prototype);

export default Locations;