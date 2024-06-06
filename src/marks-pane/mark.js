/**
 * Mark class
 */
class Mark {
    constructor() {
        /**
         * @member {Node} element the mark container to rects
         * @memberof Mark
         * @readonly
         */
        this.element = null;
        this.range = null;
    }

    /**
     * bind
     * @param {Node} element the mark container to rects
     * @param {Node} container the epub-view container
     */
    bind(element, container) {

        this.element = element;
        this.container = container;
    }

    /**
     * unbind
     * @returns {Node}
     */
    unbind() {

        const el = this.element;
        this.element = null;
        return el;
    }

    /**
     * Clear the mark container
     */
    clear() {

        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }
    }

    /**
     * render
     * @abstract
     */
    render() { }
}

export default Mark;