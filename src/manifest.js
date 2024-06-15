import { qsa } from "./utils/core";

/**
 * Manifest class
 */
class Manifest extends Map {

    constructor() {
        super();
    }

    /**
     * Parse the manifest node
     * @param {Node} node 
     */
    parse(node) {

		//-- Turn items into an array
		const items = qsa(node, "item");
		//-- Create an object with the id as key
		items.forEach((item) => {
			const id = item.getAttribute("id");
			const props = item.getAttribute("properties") || "";
            this.set(id, {
                href: item.getAttribute("href") || "",
                type: item.getAttribute("media-type") || "",
                overlay: item.getAttribute("media-overlay") || "",
                properties: props.length ? props.split(" ") : []
            });
		});
    }

    /**
     * destroy
     */
    destroy() {

        this.clear();
    }
}

export default Manifest;