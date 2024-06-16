/**
 * @module core
 */

import { DOMParser as XMLDOMParser } from "@xmldom/xmldom";

/**
 * Vendor prefixed requestAnimationFrame
 * @returns {function} requestAnimationFrame
 */
export const requestAnimationFrame = (typeof window != "undefined") ? (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame) : false;
const _URL = typeof URL != "undefined" ? URL : (typeof window != "undefined" ? (window.URL || window.webkitURL || window.mozURL) : undefined);

/**
 * Generates a UUID
 * @link https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
 * @returns {string} uuid
 */
export const uuid = () => {

	let d = new Date().getTime();
	const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		const r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c == "x" ? r : (r & 0x7 | 0x8)).toString(16);
	});
	return uuid;
}

/**
 * Gets the height of a document
 * @returns {number} height
 */
export const documentHeight = () => {

	return Math.max(
		document.documentElement.clientHeight,
		document.body.scrollHeight,
		document.documentElement.scrollHeight,
		document.body.offsetHeight,
		document.documentElement.offsetHeight
	);
}

/**
 * Checks if a node is an element
 * @param {object} obj
 * @returns {boolean}
 */
export const isElement = (obj) => {

	return !!(obj && obj.nodeType == Node.ELEMENT_NODE);
}

/**
 * isNumber
 * @param {any} n
 * @returns {boolean}
 */
export const isNumber = (n) => {

	return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * isFloat
 * @param {any} n
 * @returns {boolean}
 */
export const isFloat = (n) => {

	const f = parseFloat(n);

	if (isNumber(n) === false) {
		return false;
	}

	if (typeof n === "string" && n.indexOf(".") > -1) {
		return true;
	}

	return Math.floor(f) !== f;
}

/**
 * Get a prefixed css property
 * @param {string} unprefixed
 * @returns {string}
 */
export const prefixed = (unprefixed) => {

	const vendors = ["Webkit", "webkit", "Moz", "O", "ms"];
	const prefixes = ["-webkit-", "-webkit-", "-moz-", "-o-", "-ms-"];
	const lower = unprefixed.toLowerCase();
	const length = vendors.length;

	if (typeof (document) === "undefined" || typeof (document.body.style[lower]) !== "undefined") {
		return unprefixed;
	}

	for (let i = 0; i < length; i++) {
		if (typeof (document.body.style[prefixes[i] + lower]) !== "undefined") {
			return prefixes[i] + lower;
		}
	}

	return unprefixed;
}

/**
 * Apply defaults to an object
 * @param {object} obj
 * @returns {object}
 */
export const defaults = (obj, ...args) => {

	for (let i = 1, length = args.length; i < length; i++) {
		const source = args[i];
		for (const prop in source) {
			if (obj[prop] === void 0) obj[prop] = source[prop];
		}
	}
	return obj;
}

/**
 * Extend properties of an object
 * @param {object} target
 * @returns {object}
 */
export const extend = (target, ...args) => {

	args.forEach((source) => {
		if (!source) return;
		Object.getOwnPropertyNames(source).forEach((prop) => {
			Object.defineProperty(
				target,
				prop,
				Object.getOwnPropertyDescriptor(source, prop)
			);
		});
	});
	return target;
}

/**
 * Finds where something would fit into a sorted array
 * @param {any} item
 * @param {array} array
 * @param {function} [compareFunction]
 * @param {function} [start]
 * @param {function} [end]
 * @returns {number} location (in array)
 */
export const locationOf = (item, array, compareFunction, start, end) => {

	const _start = start || 0;
	const _end = end || array.length;
	const pivot = parseInt(_start + (_end - _start) / 2);

	if (!compareFunction) {
		compareFunction = (a, b) => {
			if (a > b) return 1;
			if (a < b) return -1;
			if (a == b) return 0;
		};
	}
	if (_end - _start <= 0) {
		return pivot;
	}

	const compared = compareFunction(array[pivot], item);

	if (_end - _start === 1) {
		return compared >= 0 ? pivot : pivot + 1;
	}
	if (compared === 0) {
		return pivot;
	}
	if (compared === -1) {
		return locationOf(item, array, compareFunction, pivot, _end);
	} else {
		return locationOf(item, array, compareFunction, _start, pivot);
	}
}

/**
 * Fast quicksort insert for sorted array -- based on:
 * @link https://stackoverflow.com/questions/1344500/efficient-way-to-insert-a-number-into-a-sorted-array-of-numbers
 * @param {any} item
 * @param {array} array
 * @param {function} [compareFunction]
 * @returns {number} location (in array)
 */
export const insert = (item, array, compareFunction) => {

	const location = locationOf(item, array, compareFunction);
	array.splice(location, 0, item);

	return location;
}

/**
 * Finds index of something in a sorted array
 * Returns -1 if not found
 * @param {any} item
 * @param {array} array
 * @param {function} [compareFunction]
 * @param {function} [start]
 * @param {function} [end]
 * @returns {number} index (in array) or -1
 */
export const indexOfSorted = (item, array, compareFunction, start, end) => {

	const _start = start || 0;
	const _end = end || array.length;
	const pivot = parseInt(_start + (_end - _start) / 2);

	if (!compareFunction) {
		compareFunction = (a, b) => {
			if (a > b) return 1;
			if (a < b) return -1;
			if (a == b) return 0;
		};
	}
	if (_end - _start <= 0) {
		return -1; // Not found
	}

	const compared = compareFunction(array[pivot], item);

	if (_end - _start === 1) {
		return compared === 0 ? pivot : -1;
	}
	if (compared === 0) {
		return pivot; // Found
	}
	if (compared === -1) {
		return indexOfSorted(item, array, compareFunction, pivot, _end);
	} else {
		return indexOfSorted(item, array, compareFunction, _start, pivot);
	}
}

/**
 * Find the bounds of an element
 * taking padding and margin into account
 * @param {Element} el
 * @returns {{ height: Number, width: Number }}
 */
export const bounds = (el) => {

	const style = window.getComputedStyle(el);
	const widthProps = [
		"width",
		"paddingRight",
		"paddingLeft",
		"marginRight",
		"marginLeft",
		"borderRightWidth",
		"borderLeftWidth"
	];
	const heightProps = [
		"height",
		"paddingTop",
		"paddingBottom",
		"marginTop",
		"marginBottom",
		"borderTopWidth",
		"borderBottomWidth"
	];
	const ret = {
		height: 0,
		width: 0
	};

	widthProps.forEach((prop) => {
		ret.width += parseFloat(style[prop]) || 0;
	});

	heightProps.forEach((prop) => {
		ret.height += parseFloat(style[prop]) || 0;
	});

	return ret;
}

/**
 * Find the bounds of an element
 * taking padding, margin and borders into account
 * @param {Element} el
 * @returns {{ height: Number, width: Number }}
 */
export const borders = (el) => {

	const style = window.getComputedStyle(el);
	const widthProps = [
		"paddingRight",
		"paddingLeft",
		"marginRight",
		"marginLeft",
		"borderRightWidth",
		"borderLeftWidth"
	];
	const heightProps = [
		"paddingTop",
		"paddingBottom",
		"marginTop",
		"marginBottom",
		"borderTopWidth",
		"borderBottomWidth"
	];
	const ret = {
		height: 0,
		width: 0
	};

	widthProps.forEach((prop) => {
		ret.width += parseFloat(style[prop]) || 0;
	});

	heightProps.forEach((prop) => {
		ret.height += parseFloat(style[prop]) || 0;
	});

	return ret;
}

/**
 * Find the bounds of any node
 * allows for getting bounds of text nodes by wrapping them in a range
 * @param {Node} node
 * @returns {DOMRect}
 */
export const nodeBounds = (node) => {

	let rect;
	const doc = node.ownerDocument;
	if (node.nodeType == Node.TEXT_NODE) {
		const range = doc.createRange();
		range.selectNodeContents(node);
		rect = range.getBoundingClientRect();
	} else {
		rect = node.getBoundingClientRect();
	}
	return rect;
}

/**
 * Find the equivalent of getBoundingClientRect of a browser window
 * @returns {{ width: Number, height: Number, top: Number, left: Number, right: Number, bottom: Number }}
 */
export const windowBounds = () => {

	const width = window.innerWidth;
	const height = window.innerHeight;

	return {
		top: 0,
		left: 0,
		right: width,
		bottom: height,
		width: width,
		height: height
	};
}

/**
 * Gets the index of a node in its parent
 * @param {Node} node
 * @param {string} typeId
 * @return {number} index
 */
export const indexOfNode = (node, typeId) => {

	const parent = node.parentNode;
	const children = parent.childNodes;
	let index = -1;

	for (let i = 0; i < children.length; i++) {
		const sib = children[i];
		if (sib.nodeType === typeId) {
			index++;
		}
		if (sib == node) break;
	}

	return index;
}

/**
 * Gets the index of a text node in its parent
 * @param {Node} textNode
 * @returns {number} index
 */
export const indexOfTextNode = (textNode) => {

	return indexOfNode(textNode, Node.TEXT_NODE);
}

/**
 * Gets the index of an element node in its parent
 * @param {Element} elementNode
 * @returns {number} index
 */
export const indexOfElementNode = (elementNode) => {

	return indexOfNode(elementNode, Node.ELEMENT_NODE);
}

/**
 * Check if extension is xml
 * @param {string} ext
 * @returns {boolean}
 */
export const isXml = (ext) => {

	return ["xml", "opf", "ncx"].indexOf(ext) > -1;
}

/**
 * Create a new blob
 * @param {any} content
 * @param {string} mime
 * @returns {Blob}
 */
export const createBlob = (content, mime) => {

	return new Blob([content], { type: mime });
}

/**
 * Create a new blob url
 * @param {any} content
 * @param {string} mime
 * @returns {string} url
 */
export const createBlobUrl = (content, mime) => {

	const blob = createBlob(content, mime);
	return _URL.createObjectURL(blob);
}

/**
 * Remove a blob url
 * @param {string} url
 */
export const revokeBlobUrl = (url) => {

	return _URL.revokeObjectURL(url);
}

/**
 * Create a new base64 encoded url
 * @param {any} content
 * @param {string} mime
 * @returns {string} url
 */
export const createBase64Url = (content, mime) => {

	if (typeof (content) !== "string") {
		// Only handles strings
		return;
	}

	const data = btoa(content);
	const datauri = "data:" + mime + ";base64," + data;

	return datauri;
}

/**
 * Get type of an object
 * @param {object} obj
 * @returns {string} type
 */
export const type = (obj) => {

	return Object.prototype.toString.call(obj).slice(8, -1);
}

/**
 * Parse xml (or html) markup
 * @param {string} markup
 * @param {string} mime
 * @param {boolean} forceXMLDom force using xmlDom to parse instead of native parser
 * @returns {Document} document
 */
export const parse = (markup, mime, forceXMLDom) => {

	let Parser;
	if (typeof DOMParser === "undefined" || forceXMLDom) {
		Parser = XMLDOMParser;
	} else {
		Parser = DOMParser;
	}

	// Remove byte order mark before parsing
	// https://www.w3.org/International/questions/qa-byte-order-mark
	if (markup.charCodeAt(0) === 0xFEFF) {
		markup = markup.slice(1);
	}

	return new Parser().parseFromString(markup, mime);
}

/**
 * querySelector polyfill
 * @param {Element} el
 * @param {string} sel selector string
 * @returns {Element} element
 */
export const qs = (el, sel) => {

	if (!el) {
		throw new Error("No Element Provided");
	}

	if (typeof el.querySelector !== "undefined") {
		return el.querySelector(sel);
	} else {
		const elements = el.getElementsByTagName(sel);
		if (elements.length) {
			return elements[0];
		}
	}
}

/**
 * querySelectorAll polyfill
 * @param {Element} el
 * @param {string} sel selector string
 * @returns {Element[]} elements
 */
export const qsa = (el, sel) => {

	if (typeof el.querySelector !== "undefined") {
		return el.querySelectorAll(sel);
	} else {
		return el.getElementsByTagName(sel);
	}
}

/**
 * querySelector by property
 * @param {Element} el
 * @param {string} sel selector string
 * @param {object[]} props
 * @returns {Element[]} elements
 */
export const qsp = (el, sel, props) => {

	if (typeof el.querySelector !== "undefined") {
		sel += "[";
		for (const prop in props) {
			sel += prop + "~='" + props[prop] + "'";
		}
		sel += "]";
		return el.querySelector(sel);
	} else {
		const q = el.getElementsByTagName(sel);
		const filtered = Array.prototype.slice.call(q, 0).filter((el) => {
			for (const prop in props) {
				if (el.getAttribute(prop) === props[prop]) {
					return true;
				}
			}
			return false;
		});

		if (filtered) {
			return filtered[0];
		}
	}
}

/**
 * Sprint through all text nodes in a document
 * @param {Element} root element to start with
 * @param {function} func function to run on each element
 */
export const sprint = (root, func) => {

	const doc = root.ownerDocument || root;
	if (typeof (doc.createTreeWalker) !== "undefined") {
		treeWalker(root, func, NodeFilter.SHOW_TEXT);
	} else {
		walk(root, (node) => {
			if (node && node.nodeType === Node.TEXT_NODE) {
				func(node);
			}
		}, true);
	}
}

/**
 * Create a treeWalker
 * @param {Element} root element to start with
 * @param {function} func function to run on each element
 * @param {function|object} filter function or object to filter with
 */
export const treeWalker = (root, func, filter) => {

	const treeWalker = document.createTreeWalker(root, filter, null, false);
	let node;
	while (node = treeWalker.nextNode()) {
		func(node);
	}
}

/**
 * @param {Node} node
 * @param {method} callback false for continue,true for break inside callback
 * @returns {boolean}
 */
export const walk = (node, callback) => {

	if (callback(node)) {
		return true;
	}
	node = node.firstChild;
	if (node) {
		do {
			let walked = walk(node, callback); // recursive call
			if (walked) {
				return true;
			}
			node = node.nextSibling;
		} while (node);
	}
	return false;
}

/**
 * Convert a blob to a base64 encoded string
 * @param {Blog} blob
 * @returns {Promise}
 */
export const blob2base64 = (blob) => {

	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(blob);
		reader.onloadend = () => {
			resolve(reader.result);
		};
	});
}

/**
 * querySelector with filter by epub type
 * @param {Element} html
 * @param {string} element element type to find
 * @param {string} type epub type to find
 * @returns {Element[]} elements
 */
export const querySelectorByType = (html, element, type) => {

	let query;
	if (typeof html.querySelector !== "undefined") {
		query = html.querySelector(`${element}[*|type="${type}"]`);
	}
	// Handle IE not supporting namespaced epub:type in querySelector
	if (!query || query.length === 0) {
		query = qsa(html, element);
		for (let i = 0; i < query.length; i++) {
			if (query[i].getAttributeNS("http://www.idpf.org/2007/ops", "type") === type ||
				query[i].getAttribute("epub:type") === type) {
				return query[i];
			}
		}
	} else {
		return query;
	}
}

/**
 * Find direct descendents of an element
 * @param {Element} el
 * @returns {Element[]} children
 */
export const findChildren = (el) => {

	const result = [];
	const childNodes = el.childNodes;
	for (let i = 0; i < childNodes.length; i++) {
		const node = childNodes[i];
		if (node.nodeType === Node.ELEMENT_NODE) {
			result.push(node);
		}
	}
	return result;
}

/**
 * Find all parents (ancestors) of an element
 * @param {Node} node
 * @returns {Node[]} parents
 */
export const parents = (node) => {

	const nodes = [node];
	for (; node; node = node.parentNode) {
		nodes.unshift(node);
	}
	return nodes
}

/**
 * Find all direct descendents of a specific type
 * @param {Element} el
 * @param {string} nodeName
 * @param {boolean} [single]
 * @returns {Element[]} children
 */
export const filterChildren = (el, nodeName, single) => {

	const result = [];
	const childNodes = el.childNodes;
	for (let i = 0; i < childNodes.length; i++) {
		const node = childNodes[i];
		if (node.nodeType === Node.ELEMENT_NODE &&
			node.nodeName.toLowerCase() === nodeName) {
			if (single) {
				return node;
			} else {
				result.push(node);
			}
		}
	}
	if (!single) {
		return result;
	}
}

/**
 * Filter all parents (ancestors) with tag name
 * @param {Node} node
 * @param {string} tagname
 * @returns {Node[]} parents
 */
export const getParentByTagName = (node, tagname) => {

	if (node === null || tagname === "") return;
	let parent = node.parentNode;
	while (parent.nodeType === Node.ELEMENT_NODE) {
		if (parent.tagName.toLowerCase() === tagname) {
			return parent;
		}
		parent = parent.parentNode;
	}
}