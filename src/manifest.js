import { qsa } from "./utils/core";

/**
 * Manifest class
 * @extends {Map}
 */
class Manifest extends Map {

    constructor() {

        super();
        /**
         * @member {string} navPath
         * @memberof Manifest
         * @readonly
         */
        this.navPath = null;
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
            const href = item.getAttribute("href") || "";
            const type = item.getAttribute("media-type") || "";
			const props = item.getAttribute("properties") || "";
            this.set(id, {
                href: href,
                type: type,
                overlay: item.getAttribute("media-overlay") || "",
                properties: props.length ? props.split(" ") : []
            });
            if (this.navPath) {
                return;
            } else if (props === "nav") {
                this.navPath = href;
            } else if (type === "application/x-dtbncx+xml") {
                this.navPath = href;
            }
		});
    }

    /**
     * destroy
     */
    destroy() {

        this.clear();
        this.navPath = undefined;
    }
}

export default Manifest;