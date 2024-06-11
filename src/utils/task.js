/**
 * Create a new task from a callback
 */
class Task {
    /**
     * Constructor
     * @param {object} task
     * @param {object} context
     * @param {...*} args 
     */
    constructor(task, context, ...args) {

        return this.run(task, context, args);
    }

    run(task, context) {

        const toApply = arguments || [];

        return new Promise((resolve, reject) => {

            const callback = (value, err) => {
                if (!value && err) {
                    reject(err);
                } else {
                    resolve(value);
                }
            };
            // Add the callback to the arguments list
            toApply.push(callback);

            // Apply all arguments to the functions
            task.apply(context || this, toApply);
        });
    }
}

export default Task;