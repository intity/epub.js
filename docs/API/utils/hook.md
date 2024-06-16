<a name="Hook"></a>

# Hook
Hooks allow for injecting functions that must all complete in order before finishing
They will execute in parallel but all must finish before continuing
Functions may return a promise if they are async.

**Kind**: global class  

* [Hook](#Hook)
    * [new Hook(context)](#new_Hook_new)
    * [.register()](#Hook+register)
    * [.deregister()](#Hook+deregister)
    * [.trigger()](#Hook+trigger) ⇒ <code>Array.&lt;Promise&gt;</code>
    * [.list()](#Hook+list) ⇒ <code>Array</code>
    * [.clear()](#Hook+clear)

<a name="new_Hook_new"></a>

## new Hook(context)
Constructor


| Param | Type | Description |
| --- | --- | --- |
| context | <code>any</code> | scope of this |

**Example**  
```js
this.content = new Hook(this);
```
<a name="Hook+register"></a>

## hook.register()
Adds a function to be run before a hook completes

**Kind**: instance method of [<code>Hook</code>](#Hook)  
**Example**  
```js
this.content.register(() => {...});
```
<a name="Hook+deregister"></a>

## hook.deregister()
Removes a function

**Kind**: instance method of [<code>Hook</code>](#Hook)  
**Example**  
```js
this.content.deregister(() => {...});
```
<a name="Hook+trigger"></a>

## hook.trigger() ⇒ <code>Array.&lt;Promise&gt;</code>
Triggers a hook to run all functions

**Kind**: instance method of [<code>Hook</code>](#Hook)  
**Example**  
```js
this.content.trigger(args).then(() => {...});
```
<a name="Hook+list"></a>

## hook.list() ⇒ <code>Array</code>
list

**Kind**: instance method of [<code>Hook</code>](#Hook)  
<a name="Hook+clear"></a>

## hook.clear()
clear

**Kind**: instance method of [<code>Hook</code>](#Hook)  
