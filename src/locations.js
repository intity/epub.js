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
		this.words = [];
		this.total = 0;
		this.break = 150;
		this._wordCounter = 0;
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

			this.total = this.length - 1;

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
	 * Load all of sections in the book to generate locations
	 * @param  {string} startCfi start position
	 * @param  {int} wordCount how many words to split on
	 * @param  {int} count result count
	 * @return {object} locations
	 */
	generateFromWords(startCfi, wordCount, count) {

		const start = startCfi ? new EpubCFI(startCfi) : undefined;
		this.q.pause();
		this.words = [];
		this._wordCounter = 0;
		this.spine.each(section => {
			if (section.linear) {
				if (start) {
					if (section.index >= start.spinePos) {
						this.q.enqueue(this.processWords.bind(this), section, wordCount, start, count);
					}
				} else {
					this.q.enqueue(this.processWords.bind(this), section, wordCount, start, count);
				}
			}
		});

		return this.q.run().then(() => {

			if (this.currentCfi) {
				this.currentLocation = this.currentCfi;
			}

			return this.words;
		});
	}

	/**
	 * processWords
	 * @param {Section} section 
	 * @param {number} wordCount 
	 * @param {*} startCfi 
	 * @param {number} [count] 
	 * @returns {Promise}
	 */
	async processWords(section, wordCount, startCfi, count) {

		if (count && this.words.length >= count) {
			return Promise.resolve();
		}

		return section.load(this.request).then((contents) => {
			const completed = new defer();
			const locations = this.parseWords(contents, section, wordCount, startCfi);
			const remainingCount = count - this.words.length;
			this.words = this.words.concat(locations.length >= count ? locations.slice(0, remainingCount) : locations);

			section.unload();

			this.processingTimeout = setTimeout(() => completed.resolve(locations), this.pause);
			return completed.promise;
		});
	}

	/**
	 * countWords
	 * 
	 * http://stackoverflow.com/questions/18679576/counting-words-in-string
	 * @param {string} s 
	 * @returns 
	 */
	countWords(s) {
		s = s.replace(/(^\s*)|(\s*$)/gi, "");//exclude  start and end white-space
		s = s.replace(/[ ]{2,}/gi, " ");//2 or more space to 1
		s = s.replace(/\n /, "\n"); // exclude newline with a start spacing
		return s.split(" ").length;
	}

	/**
	 * parseWords
	 * @param {Element} contents 
	 * @param {Section} section 
	 * @param {number} wordCount 
	 * @param {*} [startCfi] 
	 * @returns {object[]}
	 */
	parseWords(contents, section, wordCount, startCfi) {

		const cfiBase = section.cfiBase;
		const locations = [];
		const doc = contents.ownerDocument;
		const body = qs(doc, "body");
		let prev;
		let foundStartNode = startCfi ? startCfi.spinePos !== section.index : true;
		let startNode;
		if (startCfi && section.index === startCfi.spinePos) {
			startNode = startCfi.findNode(startCfi.range ? startCfi.path.steps.concat(startCfi.start.steps) : startCfi.path.steps, contents.ownerDocument);
		}
		const parser = (node) => {

			if (!foundStartNode) {
				if (node === startNode) {
					foundStartNode = true;
				} else {
					return false;
				}
			}

			if (node.textContent.length < 10) {
				if (node.textContent.trim().length === 0) {
					return false;
				}
			}

			const len = this.countWords(node.textContent);

			if (len === 0) {
				return false; // continue
			}

			const _break = wordCount;
			let dist = _break - this._wordCounter;
			let pos = 0;

			// Node is smaller than a break,
			// skip over it
			if (dist > len) {
				this._wordCounter += len;
				pos = len;
			}


			while (pos < len) {
				dist = _break - this._wordCounter;

				// Gone over
				if (pos + dist >= len) {
					// Continue counter for next node
					this._wordCounter += len - pos;
					// break
					pos = len;
					// At End
				} else {
					// Advance pos
					pos += dist;

					let cfi = new EpubCFI(node, cfiBase);
					locations.push({
						cfi: cfi.toString(),
						wordCount: this._wordCounter
					});
					this._wordCounter = 0;
				}
			}
			prev = node;
		};

		sprint(body, parser.bind(this));

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
		if (loc > this.total) {
			return this.total;
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
			return null;
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

		if (!loc || !this.total) {
			return 0;
		}
		return (loc / this.total);
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
			const cfi = new EpubCFI(this[this.total]);
			cfi.collapse();
			return cfi.toString();
		}

		const loc = Math.ceil(this.total * percentage);
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
		this.total = this.length - 1;

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
		this.request = undefined;
		this.pause = undefined;

		this.q.stop();
		this.q = undefined;
		this.epubcfi = undefined;

		this.splice(0);
		this.total = undefined;

		this.break = undefined;
		this.current = undefined;

		this.currentLocation = undefined;
		this.currentCfi = undefined;
		clearTimeout(this.processingTimeout);
	}
}

EventEmitter(Locations.prototype);

export default Locations;