/**
 * Hooks allow for injecting functions that must all complete in order before finishing
 * They will execute in parallel but all must finish before continuing
 * Functions may return a promise if they are async.
 */
class Hook {
	/**
	 * Constructor
	 * @param {any} context scope of this
	 * @example this.content = new Hook(this);
	 */
	constructor(context) {

		this.context = context || this;
		this.tasks = [];
	}

	/**
	 * Adds a function to be run before a hook completes
	 * @example this.content.register(() => {...});
	 */
	register() {

		for (let i = 0; i < arguments.length; ++i) {
			if (typeof arguments[i] === "function") {
				this.tasks.push(arguments[i]);
			} else if (arguments[i] instanceof Array) {
				// unpack array
				this.register(arguments[i]); // recursive call
			} else {
				throw new TypeError("Invalid argument type");
			}
		}
	}

	/**
	 * Removes a function
	 * @example this.content.deregister(() => {...});
	 */
	deregister(func) {

		for (let i = 0; i < this.tasks.length; i++) {
			if (this.tasks[i] === func) {
				this.tasks.splice(i, 1);
				break;
			}
		}
	}

	/**
	 * Triggers a hook to run all functions
	 * @example this.content.trigger(args).then(() => {...});
	 * @returns {Promise[]}
	 */
	trigger() {

		const args = arguments;
		const context = this.context;
		const promises = [];
		let executing;

		this.tasks.forEach((task) => {
			try {
				executing = task.apply(context, args);
			} catch (err) {
				console.error(err);
			}

			if (executing && typeof executing["then"] === "function") {
				// Task is a function that returns a promise
				promises.push(executing);
			}
		});

		return Promise.all(promises);
	}

	/**
	 * list
	 * @returns {Array}
	 */
	list() {

		return this.tasks;
	}

	/**
	 * clear
	 */
	clear() {

		this.tasks = [];
	}
}

export default Hook;