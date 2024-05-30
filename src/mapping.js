import EpubCFI from "./epubcfi";
import { nodeBounds } from "./utils/core";

/**
 * Map text locations to CFI ranges
 */
class Mapping {
	/**
	 * Constructor
	 * @param {Layout} layout Layout to apply
	 * @param {string} [axis="horizontal"] values: `"horizontal"` OR `"vertical"`
	 * @param {boolean} [dev=false] toggle developer highlighting
	 */
	constructor(layout, axis, dev = false) {

		this.layout = layout;
		this.horizontal = axis === "horizontal";
		this.devMode = dev;
	}

	/**
	 * Find CFI pairs for entire section at once
	 * @param {*} view 
	 * @returns {object[]}
	 */
	section(view) {

		const ranges = this.findRanges(view);
		return this.rangeListToCfiList(view.section.cfiBase, ranges);
	}

	/**
	 * Find CFI pairs for a page
	 * @param {Contents} contents Contents from view
	 * @param {string} cfiBase string of the base for a cfi
	 * @param {number} start position to start at
	 * @param {number} end position to end at
	 * @returns {any}
	 */
	page(contents, cfiBase, start, end) {

		const root = contents && contents.document ? contents.document.body : false;

		if (!root) return;

		const result = this.rangePairToCfiPair(cfiBase, {
			start: this.findStart(root, start, end),
			end: this.findEnd(root, start, end)
		});

		if (this.devMode === true) {
			const doc = contents.document;
			const startRange = new EpubCFI(result.start).toRange(doc);
			const endRange = new EpubCFI(result.end).toRange(doc);
			const selection = doc.defaultView.getSelection();
			const range = doc.createRange();
			selection.removeAllRanges();
			range.setStart(startRange.startContainer, startRange.startOffset);
			range.setEnd(endRange.endContainer, endRange.endOffset);
			selection.addRange(range);
		}

		return result;
	}

	/**
	 * Walk a node, preforming a function on each node it finds
	 * @param {Node} root Node to walkToNode
	 * @param {function} func walk function
	 * @return {*} returns the result of the walk function
	 * @private
	 */
	walk(root, func) {

		// IE11 has strange issue, if root is text node IE throws exception on
		// calling treeWalker.nextNode(), saying
		// Unexpected call to method or property access instead of returning null value
		if (root && root.nodeType === Node.TEXT_NODE) {
			return;
		}
		// safeFilter is required so that it can work in IE as filter is a function for IE
		// and for other browser filter is an object.
		const filter = {
			acceptNode: (node) => {
				if (node.data.trim().length > 0) {
					return NodeFilter.FILTER_ACCEPT;
				} else {
					return NodeFilter.FILTER_REJECT;
				}
			}
		};
		const safeFilter = filter.acceptNode;
		safeFilter.acceptNode = filter.acceptNode;

		const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, safeFilter, false);
		let node;
		let result;
		while ((node = treeWalker.nextNode())) {
			result = func(node);
			if (result) break;
		}

		return result;
	}

	/**
	 * findRanges
	 * @param {*} view 
	 * @returns {object[]} columns
	 */
	findRanges(view) {

		const columns = [];
		const scrollWidth = view.contents.scrollWidth();
		const spreads = Math.ceil(scrollWidth / this.layout.spreadWidth);
		const countPages = spreads * this.layout.divisor;
		const columnWidth = this.layout.columnWidth;
		const gap = this.layout.gap;
		const body = view.document.body;

		for (let i = 0; i < countPages; i++) {
			const start = (columnWidth + gap) * i;
			const end = (columnWidth * (i + 1)) + (gap * i);
			columns.push({
				start: this.findStart(body, start, end),
				end: this.findEnd(body, start, end)
			});
		}

		return columns;
	}

	/**
	 * Find Start Range
	 * @private
	 * @param {Node} root root node
	 * @param {number} start position to start at
	 * @param {number} end position to end at
	 * @return {Range}
	 */
	findStart(root, start, end) {

		const stack = [root];
		let prev = root;

		while (stack.length) {

			const el = stack.shift();
			const found = this.walk(el, (node) => {

				let left, right, top, bottom;
				const elPos = nodeBounds(node);

				if (this.horizontal && this.layout.direction === "ltr") {

					left = this.horizontal ? elPos.left : elPos.top;
					right = this.horizontal ? elPos.right : elPos.bottom;

					if (left >= start && left <= end) {
						return node;
					} else if (right > start) {
						return node;
					} else {
						prev = node;
						stack.push(node);
					}
				} else if (this.horizontal && this.layout.direction === "rtl") {

					left = elPos.left;
					right = elPos.right;

					if (right <= end && right >= start) {
						return node;
					} else if (left < end) {
						return node;
					} else {
						prev = node;
						stack.push(node);
					}
				} else {
					top = elPos.top;
					bottom = elPos.bottom;

					if (top >= start && top <= end) {
						return node;
					} else if (bottom > start) {
						return node;
					} else {
						prev = node;
						stack.push(node);
					}
				}
			});

			if (found) {
				return this.findTextStartRange(found, start, end);
			}
		}

		// Return last element
		return this.findTextStartRange(prev, start, end);
	}

	/**
	 * Find End Range
	 * @private
	 * @param {Node} root root node
	 * @param {number} start position to start at
	 * @param {number} end position to end at
	 * @return {Range}
	 */
	findEnd(root, start, end) {

		const stack = [root];
		let prev = root;

		while (stack.length) {

			const el = stack.shift();
			const found = this.walk(el, (node) => {

				let left, right, top, bottom;
				const elPos = nodeBounds(node);

				if (this.horizontal && this.layout.direction === "ltr") {

					left = Math.round(elPos.left);
					right = Math.round(elPos.right);

					if (left > end && prev) {
						return prev;
					} else if (right > end) {
						return node;
					} else {
						prev = node;
						stack.push(node);
					}
				} else if (this.horizontal && this.layout.direction === "rtl") {

					left = Math.round(this.horizontal ? elPos.left : elPos.top);
					right = Math.round(this.horizontal ? elPos.right : elPos.bottom);

					if (right < start && prev) {
						return prev;
					} else if (left < start) {
						return node;
					} else {
						prev = node;
						stack.push(node);
					}
				} else {
					top = Math.round(elPos.top);
					bottom = Math.round(elPos.bottom);

					if (top > end && prev) {
						return prev;
					} else if (bottom > end) {
						return node;
					} else {
						prev = node;
						stack.push(node);
					}
				}
			});

			if (found) {
				return this.findTextEndRange(found, start, end);
			}
		}

		// end of chapter
		return this.findTextEndRange(prev, start, end);
	}

	/**
	 * Find Text Start Range
	 * @private
	 * @param {Node} root root node
	 * @param {number} start position to start at
	 * @param {number} end position to end at
	 * @return {Range}
	 */
	findTextStartRange(node, start, end) {

		const ranges = this.splitTextNodeIntoRanges(node);

		for (let i = 0; i < ranges.length; i++) {

			const range = ranges[i];
			const pos = range.getBoundingClientRect();

			if (this.horizontal && this.layout.direction === "ltr") {
				if (pos.left >= start) {
					return range;
				}
			} else if (this.horizontal && this.layout.direction === "rtl") {
				if (pos.right <= end) {
					return range;
				}
			} else {
				if (pos.top >= start) {
					return range;
				}
			}
		}

		return ranges[0];
	}

	/**
	 * Find Text End Range
	 * @private
	 * @param {Node} root root node
	 * @param {number} start position to start at
	 * @param {number} end position to end at
	 * @return {Range}
	 */
	findTextEndRange(node, start, end) {

		const ranges = this.splitTextNodeIntoRanges(node);
		let prev;

		for (let i = 0; i < ranges.length; i++) {

			const range = ranges[i];
			const pos = range.getBoundingClientRect();

			if (this.horizontal && this.layout.direction === "ltr") {
				if (pos.left > end && prev) {
					return prev;
				} else if (pos.right > end) {
					return range;
				}
			} else if (this.horizontal && this.layout.direction === "rtl") {
				if (pos.right < start && prev) {
					return prev;
				} else if (pos.left < start) {
					return range;
				}
			} else {
				if (pos.top > end && prev) {
					return prev;
				} else if (pos.bottom > end) {
					return range;
				}
			}

			prev = range;
		}

		// Ends before limit
		return ranges[ranges.length - 1];
	}

	/**
	 * Split up a text node into ranges for each word
	 * @private
	 * @param {Node} root root node
	 * @param {string} [splitter=' '] what to split on
	 * @return {Range[]}
	 */
	splitTextNodeIntoRanges(node, splitter = " ") {

		const ranges = [];
		const textContent = node.textContent || "";
		const text = textContent.trim();
		const doc = node.ownerDocument;
		let range;
		let pos = text.indexOf(splitter);
		if (pos === -1 || node.nodeType != Node.TEXT_NODE) {
			range = doc.createRange();
			range.selectNodeContents(node);
			return [range];
		}

		range = doc.createRange();
		range.setStart(node, 0);
		range.setEnd(node, pos);
		ranges.push(range);
		range = false;

		while (pos !== -1) {

			pos = text.indexOf(splitter, pos + 1);
			if (pos > 0) {

				if (range) {
					range.setEnd(node, pos);
					ranges.push(range);
				}

				range = doc.createRange();
				range.setStart(node, pos + 1);
			}
		}

		if (range) {
			range.setEnd(node, text.length);
			ranges.push(range);
		}

		return ranges;
	}

	/**
	 * Turn a pair of ranges into a pair of CFIs
	 * @param {string} cfiBase base string for an EpubCFI
	 * @param {{ start: Range, end: Range }} rangePair Range pair
	 * @return {{ start: string, end: string }} EpubCFI string format pair
	 * @private
	 */
	rangePairToCfiPair(cfiBase, rangePair) {

		const startRange = rangePair.start;
		const endRange = rangePair.end;

		startRange.collapse(true);
		endRange.collapse(false);

		return {
			start: new EpubCFI(startRange, cfiBase).toString(),
			end: new EpubCFI(endRange, cfiBase).toString()
		};
	}

	/**
	 * rangeListToCfiList
	 * @param {*} cfiBase 
	 * @param {*} columns 
	 * @returns {object[]}
	 */
	rangeListToCfiList(cfiBase, columns) {

		const map = [];

		for (let i = 0; i < columns.length; i++) {
			const cifPair = this.rangePairToCfiPair(cfiBase, columns[i]);
			map.push(cifPair);
		}

		return map;
	}

	/**
	 * Set the axis for mapping
	 * @param {string} value `"horizontal"` OR `"vertical"`
	 * @return {boolean} is it horizontal?
	 */
	axis(value) {

		this.horizontal = value === "horizontal";
		return this.horizontal;
	}
}

export default Mapping;