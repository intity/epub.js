import EpubCFI from "./epubcfi";
import Annotation from "./annotation";

/**
 * Handles managing adding & removing Annotations
 */
class Annotations extends Map {
	/**
	 * Constructor
	 * @param {Rendition} rendition
	 */
	constructor(rendition) {

		super();
		this.rendition = rendition;
		this.rendition.hooks.render.register(this.inject.bind(this));
		this.rendition.hooks.unloaded.register(this.reject.bind(this));
	}

	/**
	 * Append an annotation to store
	 * @param {string} type Type of annotation to append: `"highlight"` OR `"underline"` OR `"mark"`
	 * @param {string} cfiRange EpubCFI range to attach annotation to
	 * @param {object} [options]
	 * @param {object} [options.data] Data to assign to annotation
	 * @param {method} [options.cb] Callback after annotation is added
	 * @param {string} [options.className] CSS class to assign to annotation
	 * @param {object} [options.styles] CSS styles to assign to annotation
	 * @returns {Annotation} Annotation that was append
	 */
	append(type, cfiRange, { data, cb, className, styles }) {

		const key = encodeURI(type + ":" + cfiRange);
		const cfi = new EpubCFI(cfiRange);
		const sectionIndex = cfi.spinePos;
		const annotation = new Annotation({
			type,
			cfiRange,
			sectionIndex,
			data,
			cb,
			className,
			styles
		});

		this.rendition.views().forEach((view) => {
			const index = view.section.index;
			if (annotation.sectionIndex === index) {
				annotation.attach(view);
			}
		});

		this.set(key, annotation);
		return annotation;
	}

	/**
	 * Remove an annotation from store
	 * @param {string} type Type of annotation to remove: `"highlight"` OR `"underline"` OR `"mark"`
	 * @param {string} cfiRange EpubCFI range to attach annotation to
	 */
	remove(type, cfiRange) {

		const key = encodeURI(type + ":" + cfiRange);
		const annotation = this.get(key);

		if (annotation) {
			this.rendition.views().forEach((view) => {
				const index = view.section.index;
				if (annotation.sectionIndex === index) {
					annotation.detach(view);
				}
			});
			this.delete(key);
		}
	}

	/**
	 * Add a highlight to the store
	 * @param {string} cfiRange EpubCFI range to attach annotation to
	 * @param {object} [options]
	 * @param {object} [options.data] Data to assign to annotation
	 * @param {method} [options.cb] Callback after annotation is clicked
	 * @param {string} [options.className] CSS class to assign to annotation
	 * @param {object} [options.styles] CSS styles to assign to annotation
	 */
	highlight(cfiRange, { data, cb, className, styles }) {

		return this.append("highlight", cfiRange, {
			data,
			cb,
			className,
			styles
		});
	}

	/**
	 * Add a underline to the store
	 * @param {string} cfiRange EpubCFI range to attach annotation to
	 * @param {object} [options]
	 * @param {object} [options.data] Data to assign to annotation
	 * @param {method} [options.cb] Callback after annotation is clicked
	 * @param {string} [options.className] CSS class to assign to annotation
	 * @param {object} [options.styles] CSS styles to assign to annotation
	 */
	underline(cfiRange, { data, cb, className, styles }) {

		return this.append("underline", cfiRange, {
			data,
			cb,
			className,
			styles
		});
	}

	/**
	 * Add a mark to the store
	 * @param {string} cfiRange EpubCFI range to attach annotation to
	 * @param {object} [options]
	 * @param {object} [options.data] Data to assign to annotation
	 * @param {method} [options.cb] Callback after annotation is clicked
	 */
	mark(cfiRange, { data, cb }) {

		return this.append("mark", cfiRange, { data, cb });
	}

	/**
	 * Hook for injecting annotation into a view
	 * @param {View} view
	 * @private
	 */
	inject(view) {

		const index = view.section.index;
		this.forEach((note, key) => {
			if (note.sectionIndex === index) {
				note.attach(view);
			}
		});
	}

	/**
	 * Hook for removing annotation from a view
	 * @param {View} view
	 * @private
	 */
	reject(view) {

		const index = view.section.index;
		this.forEach((note, key) => {
			if (note.sectionIndex === index) {
				note.detach(view);
			}
		});
	}

	/**
	 * [Not Implemented] Show annotations
	 * @TODO: needs implementation in View
	 */
	show() { }

	/**
	 * [Not Implemented] Hide annotations
	 * @TODO: needs implementation in View
	 */
	hide() { }
}

export default Annotations