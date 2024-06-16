import { qsa, indexOfNode } from "./utils/core";

/**
 * A collection of Spine Items
 */
class Spine {

	constructor() {

		this.items = [];
		/**
		 * Node index from the package.opf
		 * @member {number} nodeIndex
		 * @memberof Spine
		 * @readonly
		 */
		this.nodeIndex = undefined;
		this.length = undefined;
	}

	/**
	 * Parse element spine
	 * @param {Node} node 
	 */
	parse(node) {

		const items = qsa(node, "itemref");
		items.forEach((item, index) => {

			const props = item.getAttribute("properties") || "";
			const itemref = {
				id: item.getAttribute("id"),
				idref: item.getAttribute("idref"),
				index: index,
				linear: item.getAttribute("linear") || "yes",
				properties: props.length ? props.split(" ") : []
			};
			this.items.push(itemref);
		});

		this.nodeIndex = indexOfNode(node, Node.ELEMENT_NODE);
		this.length = this.items.length;
		return this.items;
	}

	/**
	 * destroy
	 */
	destroy() {

		this.items = undefined;
		this.nodeIndex = undefined;
		this.length = undefined;
	}
}

export default Spine;