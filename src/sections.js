import EpubCFI from "./epubcfi";
import Hook from "./utils/hook";
import Section from "./section";
import {
    replaceBase,
    replaceMeta,
    replaceCanonical
} from "./utils/replacements";

/**
 * Sections class
 */
class Sections extends Array {

    constructor() {

        super();
        this.spineByHref = {};
        this.spineById = {};
        /**
         * @member {Object} hooks
         * @property {Hook} content
         * @property {Hook} serialize
         * @memberof Spine
         * @readonly
         */
        this.hooks = {
            content: new Hook(),
            serialize: new Hook()
        };
        // Register replacements
        this.hooks.content.register(replaceBase);
        this.hooks.content.register(replaceMeta);
        this.hooks.content.register(replaceCanonical);
        /**
         * @member {Boolean} loaded
         * @memberof Spine
         * @readonly
         */
        this.loaded = false;
    }

    /**
     * Get an item from the spine
     * @param {String|Number} [target]
     * @return {Section|null} section
     * @example sections.get();
     * @example sections.get(1);
     * @example sections.get("chap1.html");
     * @example sections.get("#id1234");
     */
    get(target) {

        let index = 0;

        if (typeof target === "undefined") {
            while (index < this.length) {
                let next = this[index];
                if (next && next.linear) {
                    break;
                }
                index += 1;
            }
        } else if (typeof target === "number" && isNaN(target) === false) {
            index = target;
        } else if (typeof target === "string") {
            if (target.indexOf("#") === 0) {
                index = this.spineById[target.substring(1)];
            } else {
                target = target.split("#")[0]; // Remove fragments
                index = this.spineByHref[target] || this.spineByHref[encodeURI(target)];
            }
        }

        return this[index] || null;
    }

    /**
     * Find the first Section in the Spine
     * @return {Section} first section
     */
    first() {

        let index = 0;

        do {
            const next = this.get(index);
            if (next && next.linear) {
                return next;
            }
            index += 1;
        } while (index < this.length);
    }

    /**
     * Find the last Section in the Spine
     * @return {Section} last section
     */
    last() {

        let index = this.length - 1;

        do {
            const prev = this.get(index);
            if (prev && prev.linear) {
                return prev;
            }
            index -= 1;
        } while (index >= 0);
    }

    /**
     * Append a Section to the Spine
     * @param {Section} section
     * @returns {Number} index
     * @private
     */
    append(section) {

        const index = this.length;
        section.index = index;
        this.push(section);

        // Encode and Decode href lookups
        // see pr for details: https://github.com/futurepress/epub.js/pull/358
        this.spineByHref[decodeURI(section.href)] = index;
        this.spineByHref[encodeURI(section.href)] = index;
        this.spineByHref[section.href] = index;
        this.spineById[section.idref] = index;

        return index;
    }

    /**
     * Prepend a Section to the Spine (unused)
     * @param {Section} section
     * @returns {Number}
     * @private
     */
    prepend(section) {

        this.spineByHref[section.href] = 0;
        this.spineById[section.idref] = 0;

        // Re-index
        this.forEach((item, index) => {
            item.index = index;
        });

        return 0;
    }

    /**
     * Remove a Section from the Spine (unused)
     * @param {Section} section
     * @private
     */
    remove(section) {

        const index = this.indexOf(section);

        if (index > -1) {
            delete this.spineByHref[section.href];
            delete this.spineById[section.idref];
            return this.splice(index, 1);
        }
    }

    /**
     * Unpack items from a opf into spine items
     * @param {Packaging} packaging
     * @param {Function} resolve URL resolve
     * @param {Function} canonical Resolve canonical url
     */
    unpack(packaging, resolve, canonical) {

        const manifest = packaging.manifest;
        const spine = packaging.spine;
        spine.forEach((item, key) => {

            const manifestItem = manifest.get(key);

            item.cfiBase = EpubCFI.prototype.generateChapterComponent(
                spine.nodeIndex,
                item.index,
                item.id
            );

            if (manifestItem) {
                item.href = manifestItem.href;
                item.url = resolve(item.href, true);
                item.canonical = canonical(item.href);

                if (manifestItem.properties.length) {
                    item.properties.push.apply(
                        item.properties,
                        manifestItem.properties
                    );
                }
            }

            if (item.linear === "yes") {
                item.prev = () => {
                    let prevIndex = item.index;
                    while (prevIndex > 0) {
                        let prev = this.get(prevIndex - 1);
                        if (prev && prev.linear) {
                            return prev;
                        }
                        prevIndex -= 1;
                    }
                    return null;
                };
                item.next = () => {
                    let nextIndex = item.index;
                    while (nextIndex < this.length - 1) {
                        let next = this.get(nextIndex + 1);
                        if (next && next.linear) {
                            return next;
                        }
                        nextIndex += 1;
                    }
                    return null;
                };
            } else {
                item.prev = () => {
                    return null;
                }
                item.next = () => {
                    return null;
                }
            }

            const section = new Section(item, this.hooks);
            this.append(section);
        });

        this.loaded = true;
    }

    /**
     * destroy
     */
    destroy() {

        this.forEach((i) => i.destroy());
        this.splice(0);

        this.spineByHref = undefined;
        this.spineById = undefined;

        this.hooks.serialize.clear();
        this.hooks.content.clear();
        this.hooks = undefined;

        this.loaded = false;
    }
}

export default Sections;