import proxyMouse from "./events";

const NS_URI = "http://www.w3.org/2000/svg";

/**
 * Marks class
 */
class Marks extends Map {
    /**
     * Constructor
     * @param {Node} target view
     * @param {Node} [container=document.body] epub-view container
     */
    constructor(target, container = document.body) {

        super();
        this.target = target;
        /**
         * @member {Node} element the marks container
         * @memberof Marks
         * @readonly
         */
        this.element = document.createElementNS(NS_URI, "svg");
        this.element.style.position = "absolute";
        this.element.setAttribute("pointer-events", "none");
        // Set up mouse event proxying between the target element and the marks
        proxyMouse(this.target, this);

        this.container = container;
        this.container.appendChild(this.element);
        this.render();
    }

    /**
     * Append mark
     * @param {string} key 
     * @param {Mark} mark 
     * @returns {Mark}
     */
    appendMark(key, mark) {

        const g = document.createElementNS(NS_URI, "g");
        this.element.appendChild(g);
        mark.bind(g, this.container);
        mark.render();
        this.set(key, mark);
        return mark;
    }

    /**
     * Remove mark
     * @param {string} key 
     * @returns {void}
     */
    removeMark(key) {

        const mark = this.get(key);

        if (mark) {
            const el = mark.unbind();
            this.element.removeChild(el);
            this.delete(key)
        }
    }

    /**
     * render
     */
    render() {

        this.updateStyle(this.element);
        this.forEach((mark, key) => mark.render());
    }

    /**
     * Update style
     * @param {Node} el the marks container
     * @private 
     */
    updateStyle(el) {

        const rect = this.target.getBoundingClientRect();
        const offset = this.container.getBoundingClientRect();
        const top = rect.top - offset.top;
        const left = rect.left - offset.left;
        const width = this.target.scrollWidth;
        const height = this.target.scrollHeight;

        el.style.setProperty("top", `${top}px`, "important");
        el.style.setProperty("left", `${left}px`, "important");
        el.style.setProperty("width", `${width}px`, "important");
        el.style.setProperty("height", `${height}px`, "important");
    }
}

export default Marks;