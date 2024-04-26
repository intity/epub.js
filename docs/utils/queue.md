<a name="Queue"></a>

# Queue
Queue for handling tasks one at a time

**Kind**: global class  

* [Queue](#Queue)
    * [new Queue(context)](#new_Queue_new)
    * [.enqueue()](#Queue+enqueue) ⇒ <code>Promise</code>
    * [.dequeue()](#Queue+dequeue) ⇒ <code>Promise</code>
    * [.run()](#Queue+run) ⇒ <code>Promise</code>
    * [.flush()](#Queue+flush) ⇒ <code>Promise</code>
    * [.clear()](#Queue+clear)
    * [.length()](#Queue+length) ⇒ <code>number</code>
    * [.pause()](#Queue+pause)
    * [.stop()](#Queue+stop)

<a name="new_Queue_new"></a>

## new Queue(context)

| Param | Type | Description |
| --- | --- | --- |
| context | <code>scope</code> | what this will resolve to in the tasks |

<a name="Queue+enqueue"></a>

## queue.enqueue() ⇒ <code>Promise</code>
Add an item to the queue

**Kind**: instance method of [<code>Queue</code>](#Queue)  
<a name="Queue+dequeue"></a>

## queue.dequeue() ⇒ <code>Promise</code>
Run one item

**Kind**: instance method of [<code>Queue</code>](#Queue)  
<a name="Queue+run"></a>

## queue.run() ⇒ <code>Promise</code>
Run all tasks sequentially, at convince

**Kind**: instance method of [<code>Queue</code>](#Queue)  
<a name="Queue+flush"></a>

## queue.flush() ⇒ <code>Promise</code>
Flush all, as quickly as possible

**Kind**: instance method of [<code>Queue</code>](#Queue)  
<a name="Queue+clear"></a>

## queue.clear()
Clear all items in wait

**Kind**: instance method of [<code>Queue</code>](#Queue)  
<a name="Queue+length"></a>

## queue.length() ⇒ <code>number</code>
Get the number of tasks in the queue

**Kind**: instance method of [<code>Queue</code>](#Queue)  
**Returns**: <code>number</code> - tasks  
<a name="Queue+pause"></a>

## queue.pause()
Pause a running queue

**Kind**: instance method of [<code>Queue</code>](#Queue)  
<a name="Queue+stop"></a>

## queue.stop()
End the queue

**Kind**: instance method of [<code>Queue</code>](#Queue)  
