import {extend, type, findChildren, RangeObject, isNumber} from "./utils/core";

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const COMMENT_NODE = 8;
const DOCUMENT_NODE = 9;

/**
	* Parsing and creation of EpubCFIs: http://www.idpf.org/epub/linking/cfi/epub-cfi.html

	* Implements:
	* - Character Offset: epubcfi(/6/4[chap01ref]!/4[body01]/10[para05]/2/1:3)
	* - Simple Ranges : epubcfi(/6/4[chap01ref]!/4[body01]/10[para05],/2/1:1,/3:4)

	* Does Not Implement:
	* - Temporal Offset (~)
	* - Spatial Offset (@)
	* - Temporal-Spatial Offset (~ + @)
	* - Text Location Assertion ([)
	* @class
	@param {string | Range | Node } [cfiFrom]
	@param {string | object} [base]
	@param {string} [ignoreClass] class to ignore when parsing DOM
*/
class EpubCFI {
	constructor(cfiFrom, base, ignoreClass) {

		this.str = "";
		this.base = {};
		this.spinePos = 0; // For compatibility
		this.range = false; // true || false;
		this.path = {};
		this.start = null;
		this.end = null;

		// Allow instantiation without the "new" keyword
		if (!(this instanceof EpubCFI)) {
			return new EpubCFI(cfiFrom, base, ignoreClass);
		}

		if (typeof base === "string") {
			this.base = this.parseComponent(base);
		} else if (typeof base === "object" && base.steps) {
			this.base = base;
		}

		const type = this.checkType(cfiFrom);

		if (type === "string") {
			this.str = cfiFrom;
			return extend(this, this.parse(cfiFrom));
		} else if (type === "range") {
			return extend(this, this.fromRange(cfiFrom, this.base, ignoreClass));
		} else if (type === "node") {
			return extend(this, this.fromNode(cfiFrom, this.base, ignoreClass));
		} else if (type === "EpubCFI" && cfiFrom.path) {
			return cfiFrom;
		} else if (!cfiFrom) {
			return this;
		} else {
			throw new TypeError("not a valid argument for EpubCFI");
		}
	}

	/**
	 * Check the type of constructor input
	 * @private
	 */
	checkType(cfi) {

		if (this.isCfiString(cfi)) {
			return "string";
			// Is a range object
		} else if (cfi && typeof cfi === "object" && (type(cfi) === "Range" || typeof (cfi.startContainer) != "undefined")) {
			return "range";
		} else if (cfi && typeof cfi === "object" && typeof (cfi.nodeType) != "undefined") { // || typeof cfi === "function"
			return "node";
		} else if (cfi && typeof cfi === "object" && cfi instanceof EpubCFI) {
			return "EpubCFI";
		} else {
			return false;
		}
	}

	/**
	 * Parse a cfi string to a CFI object representation
	 * @param {string} cfiStr
	 * @returns {object} cfi
	 */
	parse(cfiStr) {

		const cfi = {
			spinePos: -1,
			range: false,
			base: {},
			path: {},
			start: null,
			end: null
		};

		if (typeof cfiStr !== "string") {
			return { spinePos: -1 };
		}

		if (cfiStr.indexOf("epubcfi(") === 0 && cfiStr[cfiStr.length - 1] === ")") {
			// Remove intial epubcfi( and ending )
			cfiStr = cfiStr.slice(8, cfiStr.length - 1);
		}

		const baseComponent = this.getChapterComponent(cfiStr);

		// Make sure this is a valid cfi or return
		if (!baseComponent) {
			return { spinePos: -1 };
		}

		cfi.base = this.parseComponent(baseComponent);

		const pathComponent = this.getPathComponent(cfiStr);
		cfi.path = this.parseComponent(pathComponent);

		const range = this.getRange(cfiStr);

		if (range) {
			cfi.range = true;
			cfi.start = this.parseComponent(range[0]);
			cfi.end = this.parseComponent(range[1]);
		}

		// Get spine node position
		// cfi.spineSegment = cfi.base.steps[1];

		// Chapter segment is always the second step
		cfi.spinePos = cfi.base.steps[1].index;

		return cfi;
	}

	parseComponent(componentStr) {

		const component = {
			steps: [],
			terminal: {
				offset: null,
				assertion: null
			}
		};
		const parts = componentStr.split(":");
		const steps = parts[0].split("/");

		if (parts.length > 1) {
			const terminal = parts[1];
			component.terminal = this.parseTerminal(terminal);
		}

		if (steps[0] === "") {
			steps.shift(); // Ignore the first slash
		}

		component.steps = steps.map(function (step) {
			return this.parseStep(step);
		}.bind(this));

		return component;
	}

	parseStep(stepStr) {

		let type, index, id;

		const hasBrackets = stepStr.match(/\[(.*)\]/);
		if (hasBrackets && hasBrackets[1]) {
			id = hasBrackets[1];
		}

		//-- Check if step is a text node or element
		const num = parseInt(stepStr);

		if (isNaN(num)) {
			return;
		}

		if (num % 2 === 0) { // Even = is an element
			type = "element";
			index = num / 2 - 1;
		} else {
			type = "text";
			index = (num - 1) / 2;
		}

		return {
			"type": type,
			"index": index,
			"id": id || null
		};
	}

	parseTerminal(termialStr) {

		let characterOffset, textLocationAssertion;
		const assertion = termialStr.match(/\[(.*)\]/);

		if (assertion && assertion[1]) {
			characterOffset = parseInt(termialStr.split("[")[0]);
			textLocationAssertion = assertion[1];
		} else {
			characterOffset = parseInt(termialStr);
		}

		if (!isNumber(characterOffset)) {
			characterOffset = null;
		}

		return {
			"offset": characterOffset,
			"assertion": textLocationAssertion
		};
	}

	getChapterComponent(cfiStr) {

		const indirection = cfiStr.split("!");
		return indirection[0];
	}

	getPathComponent(cfiStr) {

		const indirection = cfiStr.split("!");

		if (indirection[1]) {
			const ranges = indirection[1].split(",");
			return ranges[0];
		}
	}

	getRange(cfiStr) {

		const ranges = cfiStr.split(",");

		if (ranges.length === 3) {
			return [
				ranges[1],
				ranges[2]
			];
		}

		return false;
	}

	getCharecterOffsetComponent(cfiStr) {

		const splitStr = cfiStr.split(":");
		return splitStr[1] || "";
	}

	joinSteps(steps) {

		if (!steps) {
			return "";
		}

		return steps.map(function (part) {
			let segment = "";

			if (part.type === "element") {
				segment += (part.index + 1) * 2;
			}

			if (part.type === "text") {
				segment += 1 + (2 * part.index); // TODO: double check that this is odd
			}

			if (part.id && part.id !== "inline-view") {
				segment += "[" + part.id + "]";
			}

			return segment;

		}).join("/");
	}

	segmentString(segment) {

		let segmentString = "/";

		segmentString += this.joinSteps(segment.steps);

		if (segment.terminal && segment.terminal.offset != null) {
			segmentString += ":" + segment.terminal.offset;
		}

		if (segment.terminal && segment.terminal.assertion != null) {
			segmentString += "[" + segment.terminal.assertion + "]";
		}

		return segmentString;
	}

	/**
	 * Convert CFI to a epubcfi(...) string
	 * @returns {string} epubcfi
	 */
	toString() {

		let cfiString = "epubcfi(";

		cfiString += this.segmentString(this.base);

		cfiString += "!";
		cfiString += this.segmentString(this.path);

		// Add Range, if present
		if (this.range && this.start) {
			cfiString += ",";
			cfiString += this.segmentString(this.start);
		}

		if (this.range && this.end) {
			cfiString += ",";
			cfiString += this.segmentString(this.end);
		}

		cfiString += ")";

		return cfiString;
	}


	/**
	 * Compare which of two CFIs is earlier in the text
	 * @returns {number} First is earlier = -1, Second is earlier = 1, They are equal = 0
	 */
	compare(cfiOne, cfiTwo) {

		let stepsA, stepsB;
		let terminalA, terminalB;

		// var rangeAStartSteps, rangeAEndSteps;
		// var rangeBEndSteps, rangeBEndSteps;
		// var rangeAStartTerminal, rangeAEndTerminal;
		// var rangeBStartTerminal, rangeBEndTerminal;

		if (typeof cfiOne === "string") {
			cfiOne = new EpubCFI(cfiOne);
		}
		if (typeof cfiTwo === "string") {
			cfiTwo = new EpubCFI(cfiTwo);
		}
		// Compare Spine Positions
		if (cfiOne.spinePos > cfiTwo.spinePos) {
			return 1;
		}
		if (cfiOne.spinePos < cfiTwo.spinePos) {
			return -1;
		}

		if (cfiOne.range) {
			stepsA = cfiOne.path.steps.concat(cfiOne.start.steps);
			terminalA = cfiOne.start.terminal;
		} else {
			stepsA = cfiOne.path.steps;
			terminalA = cfiOne.path.terminal;
		}

		if (cfiTwo.range) {
			stepsB = cfiTwo.path.steps.concat(cfiTwo.start.steps);
			terminalB = cfiTwo.start.terminal;
		} else {
			stepsB = cfiTwo.path.steps;
			terminalB = cfiTwo.path.terminal;
		}

		// Compare Each Step in the First item
		for (var i = 0; i < stepsA.length; i++) {
			if (!stepsA[i]) {
				return -1;
			}
			if (!stepsB[i]) {
				return 1;
			}
			if (stepsA[i].index > stepsB[i].index) {
				return 1;
			}
			if (stepsA[i].index < stepsB[i].index) {
				return -1;
			}
			// Otherwise continue checking
		}

		// All steps in First equal to Second and First is Less Specific
		if (stepsA.length < stepsB.length) {
			return -1;
		}

		// Compare the charecter offset of the text node
		if (terminalA.offset > terminalB.offset) {
			return 1;
		}
		if (terminalA.offset < terminalB.offset) {
			return -1;
		}

		// CFI's are equal
		return 0;
	}

	step(node) {

		const nodeType = (node.nodeType === TEXT_NODE) ? "text" : "element";

		return {
			"id": node.id,
			"tagName": node.tagName,
			"type": nodeType,
			"index": this.position(node)
		};
	}

	filteredStep(node, ignoreClass) {

		const filteredNode = this.filter(node, ignoreClass);

		// Node filtered, so ignore
		if (!filteredNode) {
			return;
		}

		// Otherwise add the filter node in
		const nodeType = (filteredNode.nodeType === TEXT_NODE) ? "text" : "element";

		return {
			"id": filteredNode.id,
			"tagName": filteredNode.tagName,
			"type": nodeType,
			"index": this.filteredPosition(filteredNode, ignoreClass)
		};
	}

	pathTo(node, offset, ignoreClass) {

		const segment = {
			steps: [],
			terminal: {
				offset: null,
				assertion: null
			}
		};
		let step;
		let currentNode = node;

		while (this.requiredPosition(currentNode)) {

			if (ignoreClass) {
				step = this.filteredStep(currentNode, ignoreClass);
			} else {
				step = this.step(currentNode);
			}

			if (step) {
				segment.steps.unshift(step);
			}

			currentNode = currentNode.parentNode;
		}

		if (offset != null && offset >= 0) {

			segment.terminal.offset = offset;

			// Make sure we are getting to a textNode if there is an offset
			if (segment.steps[segment.steps.length - 1].type != "text") {
				segment.steps.push({
					"type": "text",
					"index": 0
				});
			}
		}

		return segment;
	}

	requiredPosition(node) {

		if (node && node.parentNode) {
			if (node.ownerDocument.isEqualNode(document)) {
				return node.id !== "viewer";
			} else {
				return node.parentNode.nodeType !== DOCUMENT_NODE;
			}
		}
		return false;
	}

	equalStep(stepA, stepB) {

		if (!stepA || !stepB) {
			return false;
		}

		if (stepA.index === stepB.index &&
			stepA.id === stepB.id &&
			stepA.type === stepB.type) {
			return true;
		}

		return false;
	}

	/**
	 * Create a CFI object from a Range
	 * @param {Range} range
	 * @param {string | object} base
	 * @param {string} [ignoreClass]
	 * @returns {object} cfi
	 */
	fromRange(range, base, ignoreClass) {

		const cfi = {
			range: false,
			base: {},
			path: {},
			start: null,
			end: null
		};

		const start = range.startContainer;
		const end = range.endContainer;

		let startOffset = range.startOffset;
		let endOffset = range.endOffset;

		let needsIgnoring = false;

		if (ignoreClass) {
			// Tell pathTo if / what to ignore
			needsIgnoring = (start.ownerDocument.querySelector("." + ignoreClass) != null);
		}

		if (typeof base === "string") {
			cfi.base = this.parseComponent(base);
			cfi.spinePos = cfi.base.steps[1].index;
		} else if (typeof base === "object") {
			cfi.base = base;
		}

		if (range.collapsed) {
			if (needsIgnoring) {
				startOffset = this.patchOffset(start, startOffset, ignoreClass);
			}
			cfi.path = this.pathTo(start, startOffset, ignoreClass);
		} else {
			cfi.range = true;

			if (needsIgnoring) {
				startOffset = this.patchOffset(start, startOffset, ignoreClass);
			}

			cfi.start = this.pathTo(start, startOffset, ignoreClass);
			if (needsIgnoring) {
				endOffset = this.patchOffset(end, endOffset, ignoreClass);
			}

			cfi.end = this.pathTo(end, endOffset, ignoreClass);

			// Create a new empty path
			cfi.path = {
				steps: [],
				terminal: null
			};

			// Push steps that are shared between start and end to the common path
			const len = cfi.start.steps.length;

			for (let i = 0; i < len; i++) {
				if (this.equalStep(cfi.start.steps[i], cfi.end.steps[i])) {
					if (i === len - 1) {
						// Last step is equal, check terminals
						if (cfi.start.terminal === cfi.end.terminal) {
							// CFI's are equal
							cfi.path.steps.push(cfi.start.steps[i]);
							// Not a range
							cfi.range = false;
						}
					} else {
						cfi.path.steps.push(cfi.start.steps[i]);
					}

				} else {
					break;
				}
			}

			cfi.start.steps = cfi.start.steps.slice(cfi.path.steps.length);
			cfi.end.steps = cfi.end.steps.slice(cfi.path.steps.length);

			// TODO: Add Sanity check to make sure that the end if greater than the start
		}

		return cfi;
	}

	/**
	 * Create a CFI object from a Node
	 * @param {Node} anchor
	 * @param {string | object} base
	 * @param {string} [ignoreClass]
	 * @returns {object} cfi
	 */
	fromNode(anchor, base, ignoreClass) {

		const cfi = {
			range: false,
			base: {},
			path: {},
			start: null,
			end: null
		};

		if (typeof base === "string") {
			cfi.base = this.parseComponent(base);
			cfi.spinePos = cfi.base.steps[1].index;
		} else if (typeof base === "object") {
			cfi.base = base;
		}

		cfi.path = this.pathTo(anchor, null, ignoreClass);

		return cfi;
	}

	filter(anchor, ignoreClass) {

		let needsIgnoring;
		let parent;
		let isText = false;

		if (anchor.nodeType === TEXT_NODE) {
			isText = true;
			parent = anchor.parentNode;
			needsIgnoring = anchor.parentNode.classList.contains(ignoreClass);
		} else {
			isText = false;
			needsIgnoring = anchor.classList.contains(ignoreClass);
		}

		if (needsIgnoring && isText) {
			const previousSibling = parent.previousSibling;
			const nextSibling = parent.nextSibling;
			let sibling; // to join with

			// If the sibling is a text node, join the nodes
			if (previousSibling && previousSibling.nodeType === TEXT_NODE) {
				sibling = previousSibling;
			} else if (nextSibling && nextSibling.nodeType === TEXT_NODE) {
				sibling = nextSibling;
			}

			if (sibling) {
				return sibling;
			} else {
				// Parent will be ignored on next step
				return anchor;
			}

		} else if (needsIgnoring && !isText) {
			// Otherwise just skip the element node
			return false;
		} else {
			// No need to filter
			return anchor;
		}
	}

	patchOffset(anchor, offset, ignoreClass) {

		if (anchor.nodeType != TEXT_NODE) {
			throw new Error("Anchor must be a text node");
		}

		let curr = anchor;
		let totalOffset = offset;

		// If the parent is a ignored node, get offset from it's start
		if (anchor.parentNode.classList.contains(ignoreClass)) {
			curr = anchor.parentNode;
		}

		while (curr.previousSibling) {
			if (curr.previousSibling.nodeType === ELEMENT_NODE) {
				// Originally a text node, so join
				if (curr.previousSibling.classList.contains(ignoreClass)) {
					totalOffset += curr.previousSibling.textContent.length;
				} else {
					break; // Normal node, dont join
				}
			} else {
				// If the previous sibling is a text node, join the nodes
				totalOffset += curr.previousSibling.textContent.length;
			}

			curr = curr.previousSibling;
		}

		return totalOffset;
	}

	normalizedMap(children, nodeType, ignoreClass) {

		let output = {};
		let prevIndex = -1;
		let prevNodeType;
		const len = children.length;

		for (let i = 0; i < len; i++) {

			const currNodeType = children[i].nodeType;

			// Check if needs ignoring
			if (currNodeType === ELEMENT_NODE &&
				children[i].classList.contains(ignoreClass)) {
				currNodeType = TEXT_NODE;
			}

			if (i > 0 &&
				currNodeType === TEXT_NODE &&
				prevNodeType === TEXT_NODE) {
				// join text nodes
				output[i] = prevIndex;
			} else if (nodeType === currNodeType) {
				prevIndex = prevIndex + 1;
				output[i] = prevIndex;
			}

			prevNodeType = currNodeType;
		}

		return output;
	}

	position(anchor) {

		let children, index;

		if (anchor.nodeType === ELEMENT_NODE) {
			children = anchor.parentNode.children;
			if (!children) {
				children = findChildren(anchor.parentNode);
			}
			index = Array.prototype.indexOf.call(children, anchor);
		} else {
			children = this.textNodes(anchor.parentNode);
			index = children.indexOf(anchor);
		}

		return index;
	}

	filteredPosition(anchor, ignoreClass) {

		let children, index, map;

		if (anchor.nodeType === ELEMENT_NODE) {
			children = anchor.parentNode.children;
			map = this.normalizedMap(children, ELEMENT_NODE, ignoreClass);
		} else {
			children = anchor.parentNode.childNodes;
			// Inside an ignored node
			if (anchor.parentNode.classList.contains(ignoreClass)) {
				anchor = anchor.parentNode;
				children = anchor.parentNode.childNodes;
			}
			map = this.normalizedMap(children, TEXT_NODE, ignoreClass);
		}

		index = Array.prototype.indexOf.call(children, anchor);

		return map[index];
	}

	stepsToXpath(steps) {

		const xpath = [".", "*"];

		steps.forEach(function (step) {
			const position = step.index + 1;
			
			if (step.id) {
				xpath.push("*[position()=" + position + " and @id='" + step.id + "']");
			} else if (step.type === "text") {
				xpath.push("text()[" + position + "]");
			} else {
				xpath.push("*[" + position + "]");
			}
		});

		return xpath.join("/");
	}

	/*

	To get the last step if needed:

	// Get the terminal step
	lastStep = steps[steps.length-1];
	// Get the query string
	query = this.stepsToQuery(steps);
	// Find the containing element
	startContainerParent = doc.querySelector(query);
	// Find the text node within that element
	if(startContainerParent && lastStep.type == "text") {
		container = startContainerParent.childNodes[lastStep.index];
	}
	*/
	stepsToQuerySelector(steps) {

		const query = ["html"];

		steps.forEach(function (step) {
			const position = step.index + 1;

			if (step.id) {
				query.push("#" + step.id);
			} else if (step.type === "text") {
				// unsupported in querySelector
				// query.push("text()[" + position + "]");
			} else {
				query.push("*:nth-child(" + position + ")");
			}
		});

		return query.join(">");
	}

	textNodes(container, ignoreClass) {

		return Array.prototype.slice.call(container.childNodes).filter(function (node) {
			if (node.nodeType === TEXT_NODE) {
				return true;
			} else if (ignoreClass && node.classList.contains(ignoreClass)) {
				return true;
			}
			return false;
		});
	}

	walkToNode(steps, _doc, ignoreClass) {

		const doc = _doc || document;
		let container = doc.documentElement;
		let children;
		const len = steps.length;

		for (let i = 0; i < len; i++) {
			const step = steps[i];

			if (step.type === "element") {
				//better to get a container using id as some times step.index may not be correct
				//For ex.https://github.com/futurepress/epub.js/issues/561
				if (step.id) {
					container = doc.getElementById(step.id);
				}
				else {
					children = container.children || findChildren(container);
					container = children[step.index];
				}
			} else if (step.type === "text") {
				container = this.textNodes(container, ignoreClass)[step.index];
			}
			if (!container) {
				//Break the for loop as due to incorrect index we can get error if
				//container is undefined so that other functionailties works fine
				//like navigation
				break;
			}
		}

		return container;
	}

	findNode(steps, _doc, ignoreClass) {

		const doc = _doc || document;
		let container;

		if (!ignoreClass && typeof doc.evaluate != "undefined") {
			const xpath = this.stepsToXpath(steps);
			let element = doc;
			if (doc === document) {
				element = doc.querySelector("#viewer").parentNode;
			}
			const resultType = XPathResult.FIRST_ORDERED_NODE_TYPE;
			const result = doc.evaluate(xpath, element, null, resultType, null);
			container = result.singleNodeValue;
		} else if (ignoreClass) {
			container = this.walkToNode(steps, doc, ignoreClass);
		} else {
			container = this.walkToNode(steps, doc);
		}

		return container;
	}

	fixMiss(steps, offset, _doc, ignoreClass) {

		let container = this.findNode(steps.slice(0, -1), _doc, ignoreClass);
		const children = container.childNodes;
		const map = this.normalizedMap(children, TEXT_NODE, ignoreClass);
		const lastStepIndex = steps[steps.length - 1].index;

		for (let childIndex in map) {
			if (!map.hasOwnProperty(childIndex)) return;

			if (map[childIndex] === lastStepIndex) {
				const child = children[childIndex];
				const len = child.textContent.length;
				if (offset > len) {
					offset = offset - len;
				} else {
					if (child.nodeType === ELEMENT_NODE) {
						container = child.childNodes[0];
					} else {
						container = child;
					}
					break;
				}
			}
		}

		return {
			container: container,
			offset: offset
		};
	}

	/**
	 * Creates a DOM range representing a CFI
	 * @param {document} _doc document referenced in the base
	 * @param {string} [ignoreClass]
	 * @return {Range}
	 */
	toRange(_doc, ignoreClass) {

		const doc = _doc || document;
		const cfi = this;
		const needsIgnoring = ignoreClass ? (doc.querySelector("." + ignoreClass) != null) : false;
		let range;
		let start, end, startContainer, endContainer;
		let startSteps, endSteps;
		let missed;

		if (typeof (doc.createRange) !== "undefined") {
			range = doc.createRange();
		} else {
			range = new RangeObject();
		}

		if (cfi.range) {
			start = cfi.start;
			startSteps = cfi.path.steps.concat(start.steps);
			startContainer = this.findNode(startSteps, doc, needsIgnoring ? ignoreClass : null);
			end = cfi.end;
			endSteps = cfi.path.steps.concat(end.steps);
			endContainer = this.findNode(endSteps, doc, needsIgnoring ? ignoreClass : null);
		} else {
			start = cfi.path;
			startSteps = cfi.path.steps;
			startContainer = this.findNode(cfi.path.steps, doc, needsIgnoring ? ignoreClass : null);
		}

		if (startContainer) {
			try {

				if (start.terminal.offset != null) {
					range.setStart(startContainer, start.terminal.offset);
				} else {
					range.setStart(startContainer, 0);
				}

			} catch (e) {
				missed = this.fixMiss(startSteps, start.terminal.offset, doc, needsIgnoring ? ignoreClass : null);
				range.setStart(missed.container, missed.offset);
			}
		} else {
			console.log("No startContainer found for", this.toString());
			// No start found
			return null;
		}

		if (endContainer) {
			try {

				if (end.terminal.offset != null) {
					range.setEnd(endContainer, end.terminal.offset);
				} else {
					range.setEnd(endContainer, 0);
				}

			} catch (e) {
				missed = this.fixMiss(endSteps, cfi.end.terminal.offset, doc, needsIgnoring ? ignoreClass : null);
				range.setEnd(missed.container, missed.offset);
			}
		}

		// doc.defaultView.getSelection().addRange(range);
		return range;
	}

	/**
	 * Check if a string is wrapped with "epubcfi()"
	 * @param {string} str
	 * @returns {boolean}
	 */
	isCfiString(str) {

		if (typeof str === "string" &&
			str.indexOf("epubcfi(") === 0 &&
			str[str.length - 1] === ")") {
			return true;
		}

		return false;
	}

	generateChapterComponent(_spineNodeIndex, _pos, id) {

		var pos = parseInt(_pos),
			spineNodeIndex = (_spineNodeIndex + 1) * 2,
			cfi = "/" + spineNodeIndex + "/";

		cfi += (pos + 1) * 2;

		if (id) {
			cfi += "[" + id + "]";
		}

		return cfi;
	}

	/**
	 * Collapse a CFI Range to a single CFI Position
	 * @param {boolean} [toStart=false]
	 */
	collapse(toStart) {

		if (!this.range) {
			return;
		}

		this.range = false;

		if (toStart) {
			this.path.steps = this.path.steps.concat(this.start.steps);
			this.path.terminal = this.start.terminal;
		} else {
			this.path.steps = this.path.steps.concat(this.end.steps);
			this.path.terminal = this.end.terminal;
		}

	}
}

export default EpubCFI;
