import { parents } from "./core";

/**
 * Lightweight Polyfill for DOM Range
 */
class RangeObject {

	constructor() {

		this.collapsed = false;
		this.commonAncestorContainer = undefined;
		this.endContainer = undefined;
		this.endOffset = undefined;
		this.startContainer = undefined;
		this.startOffset = undefined;
	}

	/**
     * Set start
     * @param {Node} startNode 
     * @param {Node} startOffset 
     */
    setStart(startNode, startOffset) {

		this.startContainer = startNode;
		this.startOffset = startOffset;

		if (!this.endContainer) {
			this.collapse(true);
		} else {
			this.commonAncestorContainer = this._commonAncestorContainer();
		}

		this._checkCollapsed();
	}

	/**
     * Set end
     * @param {Node} endNode 
     * @param {Node} endOffset 
     */
    setEnd(endNode, endOffset) {

		this.endContainer = endNode;
		this.endOffset = endOffset;

		if (!this.startContainer) {
			this.collapse(false);
		} else {
			this.collapsed = false;
			this.commonAncestorContainer = this._commonAncestorContainer();
		}

		this._checkCollapsed();
	}

	/**
     * collapse
     * @param {boolean} toStart 
     */
    collapse(toStart) {

		this.collapsed = true;

		if (toStart) {
			this.endContainer = this.startContainer;
			this.endOffset = this.startOffset;
			this.commonAncestorContainer = this.startContainer.parentNode;
		} else {
			this.startContainer = this.endContainer;
			this.startOffset = this.endOffset;
			this.commonAncestorContainer = this.endOffset.parentNode;
		}
	}

	/**
     * Select Node
     * @param {Node} referenceNode 
     */
    selectNode(referenceNode) {

		const parent = referenceNode.parentNode;
		const index = Array.prototype.indexOf.call(parent.childNodes, referenceNode);
		this.setStart(parent, index);
		this.setEnd(parent, index + 1);
	}

	/**
     * Select Node Contents
     * @param {Node} referenceNode 
     */
    selectNodeContents(referenceNode) {

		const endIndex = (referenceNode.nodeType === Node.TEXT_NODE)
			? referenceNode.textContent.length
			: parent.childNodes.length;
		this.setStart(referenceNode, 0);
		this.setEnd(referenceNode, endIndex);
	}

	_commonAncestorContainer(startContainer, endContainer) {

		const startParents = parents(startContainer || this.startContainer);
		const endParents = parents(endContainer || this.endContainer);

		if (startParents[0] != endParents[0]) return undefined;

		for (let i = 0; i < startParents.length; i++) {
			if (startParents[i] != endParents[i]) {
				return startParents[i - 1];
			}
		}
	}

	_checkCollapsed() {

		if (this.startContainer === this.endContainer &&
			this.startOffset === this.endOffset) {
			this.collapsed = true;
		} else {
			this.collapsed = false;
		}
	}

	toString() {
		// TODO: implement walking between start and end to find text
	}
}

export default RangeObject;