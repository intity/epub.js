const rectContains = (rect, x, y, offset) => {

    const top = rect.top - offset.top;
    const left = rect.left - offset.left;
    const bottom = top + rect.height;
    const right = left + rect.width;

    return (top <= y && left <= x && bottom > y && right > x);
}

/**
 * Check if the item contains the point denoted by the passed coordinates
 * @param {object} item An object with getBoundingClientRect and getClientRects methods.
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 * @private
 */
const contains = (item, target, x, y) => {

    const rect = item.getBoundingClientRect();
    const offset = target.getBoundingClientRect();

    // Check overall bounding box first
    if (!rectContains(rect, x, y, offset)) {
        return false;
    }

    // Then continue to check each child rect
    const rects = item.getClientRects();

    for (let i = 0, len = rects.length; i < len; i++) {
        if (rectContains(rects[i], x, y, offset)) {
            return true;
        }
    }

    return false;
}

const dispatch = (e, target, tracked) => {
    // We walk through the set of tracked elements in reverse order so that
    // events are sent to those most recently added first.
    //
    // This is the least surprising behaviour as it simulates the way the
    // browser would work if items added later were drawn "on top of"
    // earlier ones.
    for (let i = tracked.length - 1; i >= 0; i--) {

        let x = e.clientX
        let y = e.clientY;

        if (e.touches && e.touches.length) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }

        const t = tracked[i];

        if (!contains(t, target, x, y)) {
            continue;
        }

        // The event targets this mark, so dispatch a cloned event:
        t.dispatchEvent(clone(e));
        // We only dispatch the cloned event to the first matching mark.
        break;
    }
}

/**
 * Start proxying all mouse events that occur on the target node to each node in
 * a set of tracked nodes.
 *
 * The items in tracked do not strictly have to be DOM Nodes, but they do have
 * to have dispatchEvent, getBoundingClientRect, and getClientRects methods.
 *
 * @param {Node} target The node on which to listen for mouse events.
 * @param {Node[]} tracked A (possibly mutable) array of nodes to which to proxy events.
 */
const proxyMouse = (target, tracked) => {

    let node = target;
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
            (e) => dispatch(e, target, tracked), false);
    }
}

/**
 * Clone a mouse event object.
 * @param {MouseEvent} e A mouse event object to clone.
 * @returns {MouseEvent}
 */
export const clone = (e) => {

    const opts = Object.assign({}, e, {
        bubbles: false
    });

    return new MouseEvent(e.type, opts);
}

export default proxyMouse;