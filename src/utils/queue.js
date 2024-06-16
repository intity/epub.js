import Defer from "./defer";
import { requestAnimationFrame } from "./core";

/**
 * Queue for handling tasks one at a time
 */
class Queue {
    /**
     * Constructor
     * @param {object} context what this will resolve to in the tasks
     */
    constructor(context) {

        this._q = [];
        this.context = context;
        this.tick = requestAnimationFrame;
        this.running = false;
        this.paused = false;
    }

    /**
     * Add an item to the queue
     * @return {Promise}
     */
    enqueue() {

        const task = [].shift.call(arguments);

        if (!task) {
            throw new Error("No Task Provided");
        }

        let queued;
        if (typeof task === "function") {
            const deferred = new Defer();
            const promise = deferred.promise;
            queued = {
                task: task,
                args: arguments,
                //context: context,
                deferred: deferred,
                promise: promise
            };
        } else {
            // Task is a promise
            queued = {
                "promise": task
            };
        }

        this._q.push(queued);

        // Wait to start queue flush
        if (this.paused == false && !this.running) {
            // setTimeout(this.flush.bind(this), 0);
            // this.tick.call(window, this.run.bind(this));
            this.run();
        }

        return queued.promise;
    }

    /**
     * Run one item
     * @return {Promise}
     */
    dequeue() {

        let inwait;
        if (this._q.length && !this.paused) {
            inwait = this._q.shift();
            const task = inwait.task;
            if (task) {
                const result = task.apply(this.context, inwait.args);

                if (result && typeof result["then"] === "function") {
                    // Task is a function that returns a promise
                    return result.then(() => {
                        inwait.deferred.resolve.apply(this.context, arguments);
                    }, () => {
                        inwait.deferred.reject.apply(this.context, arguments);
                    });
                } else {
                    // Task resolves immediately
                    inwait.deferred.resolve.apply(this.context, result);
                    return inwait.promise;
                }
            } else if (inwait.promise) {
                // Task is a promise
                return inwait.promise;
            }
        } else {
            inwait = new Defer();
            inwait.deferred.resolve();
            return inwait.promise;
        }
    }

    /**
     * Run All Immediately
     */
    dump() {

        while (this._q.length) {
            this.dequeue();
        }
    }

    /**
     * Run all tasks sequentially, at convince
     * @return {Promise}
     */
    run() {

        if (!this.running) {
            this.running = true;
            this.defered = new Defer();
        }

        this.tick.call(window, () => {

            if (this._q.length) {
                this.dequeue().then(() => {
                    this.run();
                });
            } else {
                this.defered.resolve();
                this.running = undefined;
            }
        });

        // Unpause
        if (this.paused == true) {
            this.paused = false;
        }

        return this.defered.promise;
    }

    /**
     * Flush all, as quickly as possible
     * @return {Promise}
     */
    flush() {

        if (this.running) {
            return this.running;
        }

        if (this._q.length) {
            this.running = this.dequeue().then(() => {
                this.running = undefined;
                return this.flush();
            });
            return this.running;
        }
    }

    /**
     * Clear all items in wait
     */
    clear() {
        this._q = [];
    }

    /**
     * Get the number of tasks in the queue
     * @return {number} tasks
     */
    length() {
        return this._q.length;
    }

    /**
     * Pause a running queue
     */
    pause() {
        this.paused = true;
    }

    /**
     * End the queue
     */
    stop() {

        this._q = [];
        this.running = false;
        this.paused = true;
    }
}

export default Queue;