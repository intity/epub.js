import proxyMouse from "./events";

const NS_URI = "http://www.w3.org/2000/svg";

/**
 * Marks class
 */
class Pane {
    /**
     * Constructor
     * @param {Node} target view
     * @param {Node} [container=document.body] epub-view container
     */
    constructor(target, container = document.body) {
        
        this.target = target;
        this.element = document.createElementNS(NS_URI, "svg");
        this.element.style.position = "absolute";
        this.element.setAttribute("pointer-events", "none");
        /**
         * @member {object[]} marks
         * @memberof Pane
         * @readonly
         */
        this.marks = [];
        // Set up mouse event proxying between the target element and the marks
        proxyMouse(this.target, this.marks);
        
        this.container = container;
        this.container.appendChild(this.element);
        this.render();
    }

    /**
     * Add mark
     * @param {Mark} mark 
     * @returns {Mark}
     */
    addMark(mark) {

        const g = document.createElementNS(NS_URI, "g");
        this.element.appendChild(g);
        mark.bind(g, this.container);
        this.marks.push(mark);
        mark.render();
        return mark;
    }

    /**
     * Remove mark
     * @param {Mark} mark 
     * @returns {void}
     */
    removeMark(mark) {

        const index = this.marks.indexOf(mark);
        if (index === -1) {
            return;
        }
        const el = mark.unbind();
        this.element.removeChild(el);
        this.marks.splice(index, 1);
    }

    /**
     * render
     */
    render() {

        this.updateStyle(this.element);
        for (const mark of this.marks) {
            mark.render();
        }
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

export default Pane;