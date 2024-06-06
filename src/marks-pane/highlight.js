import Mark from "./mark";

const NS_URI = "http://www.w3.org/2000/svg";

/**
 * Highlight class
 * @extends Mark
 */
class Highlight extends Mark {
    /**
     * Constructor
     * @param {Range} range 
     * @param {object} [options]
     * @param {string} [options.className] 
     * @param {object} [options.data={}] 
     * @param {object} [options.attributes={}] 
     * @param {object[]} [options.listeners=[]]
     */
    constructor(range, {
        className,
        data,
        attributes,
        listeners
    }) {

        super();
        this.range = range;
        this.className = className;
        this.data = data || {};
        this.attributes = attributes || {};
        this.listeners = listeners || [];
    }

    /**
     * bind
     * @param {Node} element 
     * @param {Node} container 
     * @override
     */
    bind(element, container) {

        super.bind(element, container);

        for (const p in this.data) {
            if (this.data.hasOwnProperty(p)) {
                this.element.dataset[p] = this.data[p];
            }
        }

        for (const p in this.attributes) {
            if (this.attributes.hasOwnProperty(p)) {
                this.element.setAttribute(p, this.attributes[p]);
            }
        }

        if (this.className) {
            this.element.classList.add(this.className);
        }
    }

    /**
     * render
     * @override
     */
    render() {

        this.clear();

        const rects = this.range.getClientRects();
        const offset = this.element.getBoundingClientRect();
        const container = this.container.getBoundingClientRect();

        for (let i = 0, len = rects.length; i < len; i++) {

            const r = rects[i];
            const rect = document.createElementNS(NS_URI, "rect");
            rect.setAttribute("x", r.left - offset.left + container.left);
            rect.setAttribute("y", r.top - offset.top + container.top);
            rect.setAttribute("height", r.height);
            rect.setAttribute("width", r.width);
            this.element.appendChild(rect);
        }
    }
}

export default Highlight;