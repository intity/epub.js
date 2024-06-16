import { uuid } from "./core";

/**
 * Creates a new pending promise and provides methods to resolve or reject it.
 */
class Defer {
    constructor() {
        /**
         * @member {string} id
         * @memberof Defer
         * @readonly
         */
        this.id = uuid();
        /**
         * A method to resolve the associated Promise with the value passed.
         * If the promise is already settled it does nothing.
         * @member {method} resolve
         * @param {anything} value : This value is used to resolve the promise
         * If the value is a Promise then the associated promise assumes the state
         * of Promise passed as value.
         * @memberof Defer
         * @readonly
         */
        this.resolve = null;
        /**
         * A method to reject the associated Promise with the value passed.
         * If the promise is already settled it does nothing.
         * @member {method} reject
         * @param {anything} reason: The reason for the rejection of the Promise.
         * Generally its an Error object. If however a Promise is passed, then the Promise
         * itself will be the reason for rejection no matter the state of the Promise.
         * @memberof Defer
         * @readonly
         */
        this.reject = null;
        /**
         * A newly created Pomise object.
         * Initially in pending state.
         * @member {Promise} promise
         * @memberof Defer
         * @readonly
         */
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}

export default Defer;