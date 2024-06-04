import EventEmitter from "event-emitter";
import { EVENTS } from "./utils/constants";

/**
 * Annotation object
 * @class
 * @param {object} options
 * @param {string} options.type Type of annotation to add: "highlight", "underline", "mark"
 * @param {EpubCFI} options.cfiRange EpubCFI range to attach annotation to
 * @param {object} options.data Data to assign to annotation
 * @param {number} options.sectionIndex Index in the Spine of the Section annotation belongs to
 * @param {method} [options.cb] Callback after annotation is clicked
 * @param {string} [options.className] CSS class to assign to annotation
 * @param {object} [options.styles] CSS styles to assign to annotation
 * @returns {Annotation} annotation
 */
class Annotation {

    constructor({
        type,
        cfiRange,
        data,
        sectionIndex,
        cb,
        className,
        styles
    }) {
        this.type = type;
        this.cfiRange = cfiRange;
        this.data = data;
        this.sectionIndex = sectionIndex;
        this.mark = undefined;
        this.cb = cb;
        this.className = className;
        this.styles = styles;
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
     */
    attach(view) {

        let result;
        if (this.type === "highlight") {
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
         * @memberof Annotation
         */
        this.emit(EVENTS.ANNOTATION.ATTACH, result);
        return result;
    }

    /**
     * Remove from a view
     * @param {View} view
     */
    detach(view) {

        let result;
        if (!view) {
            return;
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

export default Annotation