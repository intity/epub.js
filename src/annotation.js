import EventEmitter from "event-emitter";
import { EVENTS } from "./utils/constants";

/**
 * Annotation object
 * @class
 * @param {object} options
 * @param {string} options.type Type of annotation to add: `"highlight"` OR `"underline"` OR `"mark"`
 * @param {string} options.cfiRange EpubCFI range to attach annotation to
 * @param {number} options.sectionIndex Index in the Spine of the Section annotation belongs to
 * @param {object} [options.data] Data to assign to annotation
 * @param {method} [options.cb] Callback after annotation is clicked
 * @param {string} [options.className] CSS class to assign to annotation
 * @param {object} [options.styles] CSS styles to assign to annotation
 * @returns {Annotation} annotation
 */
class Annotation {

    constructor({
        type,
        cfiRange,
        sectionIndex,
        data,
        cb,
        className,
        styles
    }) {
        this.type = type;
        this.cfiRange = cfiRange;
        this.sectionIndex = sectionIndex;
        this.data = data;
        this.cb = cb;
        this.className = className;
        this.styles = styles;
        this.mark = undefined;
    }

    /**
     * Update stored data
     * @param {object} data
     */
    update(data) {

        this.data = data;
    }

    /**
     * Add to a view
     * @param {View} view
     * @returns {object|null}
     */
    attach(view) {

        let result;
        if (!view) {
            return null;
        } else if (this.type === "highlight") {
            result = view.highlight(
                this.cfiRange,
                this.data,
                this.cb,
                this.className,
                this.styles
            );
        } else if (this.type === "underline") {
            result = view.underline(
                this.cfiRange,
                this.data,
                this.cb,
                this.className,
                this.styles
            );
        } else if (this.type === "mark") {
            result = view.mark(
                this.cfiRange,
                this.data,
                this.cb
            );
        }

        this.mark = result;
        /**
         * @event attach
         * @param {any} result
         * @memberof Annotation
         */
        this.emit(EVENTS.ANNOTATION.ATTACH, result);
        return result;
    }

    /**
     * Remove from a view
     * @param {View} view
     * @returns {boolean}
     */
    detach(view) {

        let result = false;
        if (!view) {
            return result;
        } else if (this.type === "highlight") {
            result = view.unhighlight(this.cfiRange);
        } else if (this.type === "underline") {
            result = view.ununderline(this.cfiRange);
        } else if (this.type === "mark") {
            result = view.unmark(this.cfiRange);
        }

        this.mark = undefined;
        /**
         * @event detach
         * @param {boolean} result
         * @memberof Annotation
         */
        this.emit(EVENTS.ANNOTATION.DETACH, result);
        return result;
    }

    /**
     * [Not Implemented] Get text of an annotation
     * @TODO: needs implementation in contents
     */
    text() { }
}

EventEmitter(Annotation.prototype);

export default Annotation;