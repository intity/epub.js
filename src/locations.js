import EventEmitter from "event-emitter";
import Queue from "./utils/queue";
import EpubCFI from "./epubcfi";
import { EVENTS } from "./utils/constants";
import { qs, sprint, locationOf, defer } from "./utils/core";

/**
 * Find Locations for a Book
 */
class Locations extends Array {
	/**
	 * Constructor
	 * @param {Spine} [spine]
	 * @param {method} [request]
	 * @param {number} [pause=100]
	 */
	constructor(spine, request, pause) {

		super();
		this.spine = spine;
		this.request = request;
		this.pause = pause || 100;
		this.q = new Queue(this);
		this.epubcfi = new EpubCFI();
		this.break = 150;
		this.current = 0;
		this.currentCfi = "";
		this.currentLocation = "";
		this.processingTimeout = undefined;
	}

	/**
	 * Load all of sections in the book to generate locations
	 * @param {number} [chars] how many chars to split on (default:150)
	 * @return {Promise} locations
	 */
	async generate(chars) {

		if (chars) {
			this.break = Math.round(chars);
		}

		this.q.pause();
		this.spine.each(section => {

			if (section.linear) {
				this.q.enqueue(this.process.bind(this), section);
			}
		});

		return this.q.run().then(() => {

			if (this.currentCfi) {
				this.currentLocation = this.currentCfi;
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
			const completed = new defer();
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
	 * @param {EpubCFI|string} cfi
	 * @return {number}
	 */
	locationFromCfi(cfi) {

		if (EpubCFI.prototype.isCfiString(cfi)) {
			cfi = new EpubCFI(cfi);
		}
		// Check if the location has not been set yet
		if (this.length === 0) {
			return -1;
		}

		const loc = locationOf(cfi, this, this.epubcfi.compare);
		if (loc > this.length - 1) {
			return this.length - 1;
		}

		return loc;
	}

	/**
	 * Get a percentage position in locations from an EpubCFI
	 * @param {EpubCFI} cfi
	 * @return {number}
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
	 * @param {number} loc
	 * @return {number}
	 */
	percentageFromLocation(loc) {

		if (!loc || this.length === 0) {
			return 0;
		}
		return (loc / (this.length -1));
	}

	/**
	 * Get an EpubCFI from location index
	 * @param {number} loc
	 * @return {EpubCFI} cfi
	 */
	cfiFromLocation(loc) {

		let cfi = -1;
		// check that pg is an int
		if (typeof loc !== "number") {
			loc = parseInt(loc);
		}

		if (loc >= 0 && loc < this.length) {
			cfi = this[loc];
		}

		return cfi;
	}

	/**
	 * Get an EpubCFI from location percentage
	 * @param {number} percentage
	 * @return {EpubCFI} cfi
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
	 * @param {json} locations
	 */
	load(locations) {

		if (typeof locations === "string") {
			locations = JSON.parse(locations);
		}
		this.splice(0);
		locations.forEach(i => this.push(i));

		return this;
	}

	/**
	 * Save locations to JSON
	 * @return {json}
	 */
	save() {

		return JSON.stringify(this);
	}

	/**
	 * Get current location index
	 * @returns {number}
	 */
	getCurrent() {

		return this.current;
	}

	/**
	 * Set current location
	 * @param {number|string} value Location index OR EpubCFI string format
	 */
	setCurrent(value) {

		if (typeof value == "string") {
			this.currentCfi = value;
		} else if (typeof value == "number") {
			this.current = value;
		} else {
			return;
		}

		if (this.length === 0) {
			return;
		}

		let loc;
		if (typeof value == "string") {
			loc = this.locationFromCfi(value);
			this.current = loc;
		} else {
			loc = value;
		}

		this.emit(EVENTS.LOCATIONS.CHANGED, {
			percentage: this.percentageFromLocation(loc)
		});
	}

	/**
	 * Get the current location
	 */
	get currentLocation() {

		return this.current;
	}

	/**
	 * Set the current location
	 */
	set currentLocation(value) {

		this.setCurrent(value);
	}

	destroy() {

		this.spine = undefined;
		this.pause = undefined;
		this.break = undefined;
		this.request = undefined;
		this.q.stop();
		this.q = undefined;
		this.epubcfi = undefined;
		this.splice(0);
		this.current = undefined;
		this.currentCfi = undefined;
		this.currentLocation = undefined;
		clearTimeout(this.processingTimeout);
	}
}

EventEmitter(Locations.prototype);

export default Locations;