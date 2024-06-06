import Highlight from "./highlight";

const NS_URI = "http://www.w3.org/2000/svg";

/**
 * Underline class
 * @extends Highlight
 */
class Underline extends Highlight {
    /**
     * Constructor
     * @param {Range} range 
     * @param {string} [className] 
     * @param {object} [data={}] 
     * @param {object} [attributes={}] 
     */
    constructor(range, className, data, attributes) {

        super(range, className, data, attributes);
    }

    /**
     * render
     * @override
     */
    render() {

        this.clear();

        const ranges = this.range.getClientRects();
        const offset = this.element.getBoundingClientRect();
        const container = this.container.getBoundingClientRect();

        for (let i = 0, len = ranges.length; i < len; i++) {

            const r = ranges[i];
            const rect = document.createElementNS(NS_URI, "rect");
            const line = document.createElementNS(NS_URI, "line");

            rect.setAttribute("x", r.left - offset.left + container.left);
            rect.setAttribute("y", r.top - offset.top + container.top);
            rect.setAttribute("height", r.height);
            rect.setAttribute("width", r.width);
            rect.setAttribute("fill", "none");

            line.setAttribute("x1", r.left - offset.left + container.left);
            line.setAttribute("x2", r.left - offset.left + container.left + r.width);
            line.setAttribute("y1", r.top - offset.top + container.top + r.height - 1);
            line.setAttribute("y2", r.top - offset.top + container.top + r.height - 1);

            line.setAttribute("stroke-width", 1);
            line.setAttribute("stroke", "black"); //TODO: match text color?
            line.setAttribute("stroke-linecap", "square");

            this.element.appendChild(rect);
            this.element.appendChild(line);
        }
    }
}

export default Underline;