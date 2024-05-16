import EpubCFI from "./epubcfi";
import Hook from "./utils/hook";
import { defer, sprint } from "./utils/core";
import { replaceBase } from "./utils/replacements";
import { DOMParser as XMLDOMSerializer } from "@xmldom/xmldom";

/**
 * Represents a Section of the Book
 * In most books this is equivalent to a Chapter
 */
class Section {
	/**
	 * Constructor
	 * @param {object} item 
	 * @param {object} hooks 
	 */
	constructor(item, hooks) {
		/**
		 * @member {string} idref
		 * @memberof Section
		 * @readonly
		 */
		this.idref = item.idref;
		/**
		 * @member {boolean} linear
		 * @memberof Section
		 * @readonly
		 */
		this.linear = item.linear === "yes";
		/**
		 * @member {number} index
		 * @memberof Section
		 * @readonly
		 */
		this.index = item.index;
		/**
		 * @member {string} href
		 * @memberof Section
		 * @readonly
		 */
		this.href = item.href;
		/**
		 * @member {string} url
		 * @memberof Section
		 * @readonly
		 */
		this.url = item.url;
		/**
		 * @member {string} canonical
		 * @memberof Section
		 * @readonly
		 */
		this.canonical = item.canonical;
		/**
		 * @member {string} cfiBase
		 * @memberof Section
		 * @readonly
		 */
		this.cfiBase = item.cfiBase;
		/**
		 * @member {function} next
		 * @memberof Section
		 * @readonly
		 */
		this.next = item.next;
		/**
		 * @member {function} prev
		 * @memberof Section
		 * @readonly
		 */
		this.prev = item.prev;
		/**
		 * @member {object[]} properties
		 * @memberof Section
		 * @readonly
		 */
		this.properties = item.properties;

		if (hooks) {
			this.hooks = hooks;
		} else {
			this.hooks = {};
			this.hooks.serialize = new Hook(this);
			this.hooks.content = new Hook(this);
		}

		this.document = undefined;
		this.contents = undefined;
		this.output = undefined;
	}

	/**
	 * Load the section from its url
	 * @param {function} request a request method to use for loading
	 * @return {Promise} a promise with the xml document
	 */
	load(request) {

		const loading = new defer();
		const loaded = loading.promise;

		if (this.contents) {
			loading.resolve(this.contents);
		} else {
			request(this.url).then((xml) => {
				this.document = xml;
				this.contents = xml.documentElement;
				return this.hooks.content.trigger(this.document, this);
			}).then(() => {
				loading.resolve(this.contents);
			}).catch((error) => {
				loading.reject(error);
			});
		}

		return loaded;
	}

	/**
	 * Adds a base tag for resolving urls in the section (unused)
	 * @private
	 */
	base() {

		return replaceBase(this.document, this);
	}

	/**
	 * Render the contents of a section
	 * @param {function} request a request method to use for loading
	 * @return {Promise} output a serialized XML Document
	 */
	render(request) {

		const rendering = new defer();
		const rendered = rendering.promise;
		this.output; // TODO: better way to return this from hooks?
		this.load(request).then((contents) => {
			const serializer = new XMLSerializer();
			this.output = serializer.serializeToString(contents);
			return this.output;
		}).then(() => {
			return this.hooks.serialize.trigger(this.output, this);
		}).then(() => {
			rendering.resolve(this.output);
		}).catch((error) => {
			rendering.reject(error);
		});

		return rendered;
	}

	/**
	 * Find a string in a section
	 * @param {string} query The query string to find
	 * @return {object[]} A list of matches, with form {cfi, excerpt}
	 */
	find(query) {

		const section = this;
		const matches = [];
		const q = query.toLowerCase();
		const find = (node) => {

			const text = node.textContent.toLowerCase();
			const limit = 150;
			let pos, last = -1;

			while (pos !== -1) {
				// Search for the query
				pos = text.indexOf(q, last + 1);

				if (pos !== -1) {
					// We found it! Generate a CFI
					const range = section.document.createRange();
					range.setStart(node, pos);
					range.setEnd(node, pos + q.length);

					const cfi = section.cfiFromRange(range);

					let excerpt;
					// Generate the excerpt
					if (node.textContent.length < limit) {
						excerpt = node.textContent;
					}
					else {
						excerpt = node.textContent.substring(pos - limit / 2, pos + limit / 2);
						excerpt = "..." + excerpt + "...";
					}

					// Add the CFI to the matches list
					matches.push({
						cfi: cfi,
						excerpt: excerpt
					});
				}

				last = pos;
			}
		}

		sprint(section.document, (node) => find(node));

		return matches;
	}

	/**
	 * Search a string in multiple sequential Element of the section.
	 * If the document.createTreeWalker api is missed(eg: IE8), use 
	 * `find` as a fallback.
	 * @param {string} query The query string to search
	 * @param {number} [maxSeqEle=5] The maximum number of Element that are combined for search, default value is 5.
	 * @return {object[]} A list of matches, with form {cfi, excerpt}
	 */
	search(query, maxSeqEle = 5) {

		if (typeof (document.createTreeWalker) == "undefined") {
			return this.find(query);
		}
		const matches = [];
		const excerptLimit = 150;
		const section = this;
		const q = query.toLowerCase();
		const search = (nodeList) => {
			const textWithCase = nodeList.reduce((acc, current) => {
				return acc + current.textContent;
			}, "");
			const text = textWithCase.toLowerCase();
			const pos = text.indexOf(q);
			if (pos !== -1) {
				const startNodeIndex = 0, endPos = pos + q.length;
				let endNodeIndex = 0, len = 0;
				if (pos < nodeList[startNodeIndex].length) {
					while (endNodeIndex < nodeList.length - 1) {
						len += nodeList[endNodeIndex].length;
						if (endPos <= len) {
							break;
						}
						endNodeIndex += 1;
					}

					const startNode = nodeList[startNodeIndex];
					const endNode = nodeList[endNodeIndex];
					const range = section.document.createRange();
					range.setStart(startNode, pos);
					const beforeEndLengthCount = nodeList.slice(0, endNodeIndex).reduce((acc, current) => {
						return acc + current.textContent.length;
					}, 0);
					range.setEnd(endNode, beforeEndLengthCount > endPos ? endPos : endPos - beforeEndLengthCount);
					const cfi = section.cfiFromRange(range);

					let excerpt = nodeList.slice(0, endNodeIndex + 1).reduce((acc, current) => {
						return acc + current.textContent;
					}, "");
					if (excerpt.length > excerptLimit) {
						excerpt = excerpt.substring(pos - excerptLimit / 2, pos + excerptLimit / 2);
						excerpt = "..." + excerpt + "...";
					}
					matches.push({
						cfi: cfi,
						excerpt: excerpt
					});
				}
			}
		}

		const treeWalker = document.createTreeWalker(section.document, NodeFilter.SHOW_TEXT, null, false);
		let node, nodeList = [];
		while (node = treeWalker.nextNode()) {
			nodeList.push(node);
			if (nodeList.length == maxSeqEle) {
				search(nodeList.slice(0, maxSeqEle));
				nodeList = nodeList.slice(1, maxSeqEle);
			}
		}
		if (nodeList.length > 0) {
			search(nodeList);
		}
		return matches;
	}

	/**
	* Reconciles the current chapters layout properties with
	* the global layout properties.
	* @param {object} globalLayout The global layout settings object, chapter properties string
	* @return {object} layoutProperties Object with layout properties
	*/
	reconcileLayoutSettings(globalLayout) {
		//-- Get the global defaults
		const settings = {
			layout: globalLayout.layout,
			spread: globalLayout.spread,
			orientation: globalLayout.orientation
		};

		//-- Get the chapter's display type
		this.properties.forEach(prop => {
			const rendition = prop.replace("rendition:", "");
			const split = rendition.indexOf("-");

			if (split !== -1) {
				const property = rendition.slice(0, split);
				const value = rendition.slice(split + 1);
				settings[property] = value;
			}
		});

		return settings;
	}

	/**
	 * Get a CFI from a Range in the Section
	 * @param {range} range
	 * @return {string} cfi an EpubCFI string
	 */
	cfiFromRange(range) {

		return new EpubCFI(range, this.cfiBase).toString();
	}

	/**
	 * Get a CFI from an Element in the Section
	 * @param {element} el
	 * @return {string} cfi an EpubCFI string
	 */
	cfiFromElement(el) {

		return new EpubCFI(el, this.cfiBase).toString();
	}

	/**
	 * Unload the section document
	 */
	unload() {

		this.document = undefined;
		this.contents = undefined;
		this.output = undefined;
	}

	/**
	 * destroy
	 */
	destroy() {

		this.unload();
		this.hooks.serialize.clear();
		this.hooks.content.clear();
		this.hooks = undefined;
		this.idref = undefined;
		this.linear = undefined;
		this.properties = undefined;
		this.index = undefined;
		this.href = undefined;
		this.url = undefined;
		this.next = undefined;
		this.prev = undefined;
		this.cfiBase = undefined;
	}
}

export default Section;