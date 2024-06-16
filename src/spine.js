import { qsa, indexOfNode } from "./utils/core";

/**
 * A collection of Spine Items
 * @extends {Map}
 */
class Spine extends Map {

	constructor() {

		super();
		/**
		 * Node index from the package.opf
		 * @member {number} nodeIndex
		 * @memberof Spine
		 * @readonly
		 */
		this.nodeIndex = undefined;
	}

	/**
	 * Parse element spine
	 * @param {Node} node 
	 */
	parse(node) {

		const items = qsa(node, "itemref");
		items.forEach((item, index) => {

			const props = item.getAttribute("properties") || "";
			const idref = item.getAttribute("idref");
			this.set(idref, {
				id: item.getAttribute("id"),
				idref: idref,
				index: index,
				linear: item.getAttribute("linear") || "yes",
				properties: props.length ? props.split(" ") : []
			})
		});
		this.nodeIndex = indexOfNode(node, Node.ELEMENT_NODE);
	}

	/**
	 * destroy
	 */
	destroy() {

		this.clear();
		this.nodeIndex = undefined;
	}
}

export default Spine;