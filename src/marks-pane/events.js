const rectContains = (rect, x, y, offset) => {

    const top = rect.top - offset.top;
    const left = rect.left - offset.left;
    const bottom = top + rect.height;
    const right = left + rect.width;

    return (top <= y && left <= x && bottom > y && right > x);
}

/**
 * Check if the item contains the point denoted by the passed coordinates
 * @param {Mark} mark the mark object
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 * @private
 */
const contains = (mark, target, x, y) => {

    const rect = mark.getBoundingClientRect();
    const offset = target.getBoundingClientRect();

    // Check overall bounding box first
    if (!rectContains(rect, x, y, offset)) {
        return false;
    }

    // Then continue to check each child rect
    const rects = mark.getClientRects();

    for (let i = 0, len = rects.length; i < len; i++) {
        if (rectContains(rects[i], x, y, offset)) {
            return true;
        }
    }

    return false;
}

/**
 * Clone a mouse event object.
 * @param {MouseEvent} e A mouse event object to clone.
 * @returns {MouseEvent}
 * @private
 */
const clone = (e) => {

    const opts = Object.assign({}, e, {
        bubbles: false
    });

    return new MouseEvent(e.type, opts);
}

const dispatch = (e, target, marks) => {

    let x = e.clientX;
    let y = e.clientY;

    if (e.touches && e.touches.length) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
    }

    marks.forEach((mark, key) => {
        if (contains(mark, target, x, y)) {
            mark.dispatchEvent(clone(e));
        }
    });
}

/**
 * Start proxying all mouse events that occur on the target node to each node in
 * a set of tracked marks.
 *
 * The marks in tracked do not strictly have to be DOM Nodes, but they do have
 * to have dispatchEvent, getBoundingClientRect, and getClientRects methods.
 *
 * @param {Node} target The node on which to listen for mouse events.
 * @param {Mark[]} marks A (possibly mutable) array of marks to which to proxy events.
 */
const proxyMouse = (target, marks) => {

    let node;
    if (target.nodeName === "iframe" ||
        target.nodeName === "IFRAME") {
        node = target.contentDocument;
    } else {
        node = target;
    }

    const events = [
        "mouseup",
        "mousedown",
        "click",
        "touchstart"
    ];

    for (const event of events) {
        node.addEventListener(event,
            (e) => dispatch(e, target, marks), false);
    }
}

export default proxyMouse;