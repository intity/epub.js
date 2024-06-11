<a name="ContinuousViewManager"></a>

# ContinuousViewManager ⇐ <code>DefaultViewManager</code>
Continuous view manager

**Kind**: global class  
**Extends**: <code>DefaultViewManager</code>  

* [ContinuousViewManager](#ContinuousViewManager) ⇐ <code>DefaultViewManager</code>
    * [new ContinuousViewManager(book, [options])](#new_ContinuousViewManager_new)
    * _instance_
        * [.render(element, size)](#ContinuousViewManager+render)
        * [.display(section, [target])](#ContinuousViewManager+display) ⇒ <code>Promise</code>
        * [.fill(value)](#ContinuousViewManager+fill) ⇒ <code>Promise</code>
        * [.moveTo(offset)](#ContinuousViewManager+moveTo)
        * [.removeShownListeners(view)](#ContinuousViewManager+removeShownListeners)
        * [.add(section)](#ContinuousViewManager+add) ⇒ <code>Promise</code>
        * [.append(section)](#ContinuousViewManager+append) ⇒ <code>\*</code>
        * [.prepend(section)](#ContinuousViewManager+prepend) ⇒ <code>\*</code>
        * [.update([offset])](#ContinuousViewManager+update) ⇒ <code>Promise</code>
        * [.check([offsetLeft], [offsetTop])](#ContinuousViewManager+check) ⇒ <code>Promise</code>
        * [.trim()](#ContinuousViewManager+trim) ⇒ <code>Promise</code>
        * [.erase(view, above)](#ContinuousViewManager+erase)
        * [.addEventListeners()](#ContinuousViewManager+addEventListeners)
        * [.removeEventListeners()](#ContinuousViewManager+removeEventListeners)
        * [.onScroll()](#ContinuousViewManager+onScroll)
        * [.next()](#ContinuousViewManager+next)
        * [.prev()](#ContinuousViewManager+prev)
        * [.destroy()](#ContinuousViewManager+destroy)
    * _static_
        * [.name](#ContinuousViewManager.name) : <code>string</code>

<a name="new_ContinuousViewManager_new"></a>

## new ContinuousViewManager(book, [options])
Constructor


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| book | <code>Book</code> |  |  |
| [options] | <code>object</code> |  |  |
| [options.axis] | <code>string</code> |  |  |
| [options.snap] | <code>object</code> |  |  |
| [options.method] | <code>string</code> |  | values: `"blobUrl"` OR `"srcdoc"` OR `"write"` |
| [options.ignoreClass] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> |  |
| [options.view] | <code>string</code> \| <code>object</code> | <code>&quot;&#x27;iframe&#x27;&quot;</code> |  |

<a name="ContinuousViewManager+render"></a>

## continuousViewManager.render(element, size)
render

**Kind**: instance method of [<code>ContinuousViewManager</code>](#ContinuousViewManager)  

| Param | Type |
| --- | --- |
| element | <code>Element</code> | 
| size | <code>object</code> | 

<a name="ContinuousViewManager+display"></a>

## continuousViewManager.display(section, [target]) ⇒ <code>Promise</code>
display

**Kind**: instance method of [<code>ContinuousViewManager</code>](#ContinuousViewManager)  
**Returns**: <code>Promise</code> - displaying promise  

| Param | Type |
| --- | --- |
| section | <code>Section</code> | 
| [target] | <code>string</code> \| <code>number</code> | 

<a name="ContinuousViewManager+fill"></a>

## continuousViewManager.fill(value) ⇒ <code>Promise</code>
fill

**Kind**: instance method of [<code>ContinuousViewManager</code>](#ContinuousViewManager)  

| Param | Type |
| --- | --- |
| value | <code>Defer</code> | 

<a name="ContinuousViewManager+moveTo"></a>

## continuousViewManager.moveTo(offset)
moveTo

**Kind**: instance method of [<code>ContinuousViewManager</code>](#ContinuousViewManager)  

| Param | Type |
| --- | --- |
| offset | <code>object</code> | 

<a name="ContinuousViewManager+removeShownListeners"></a>

## continuousViewManager.removeShownListeners(view)
Remove Previous Listeners if present

**Kind**: instance method of [<code>ContinuousViewManager</code>](#ContinuousViewManager)  

| Param | Type |
| --- | --- |
| view | <code>\*</code> | 

<a name="ContinuousViewManager+add"></a>

## continuousViewManager.add(section) ⇒ <code>Promise</code>
add

**Kind**: instance method of [<code>ContinuousViewManager</code>](#ContinuousViewManager)  

| Param | Type |
| --- | --- |
| section | <code>Section</code> | 

<a name="ContinuousViewManager+append"></a>

## continuousViewManager.append(section) ⇒ <code>\*</code>
Append view

**Kind**: instance method of [<code>ContinuousViewManager</code>](#ContinuousViewManager)  
**Returns**: <code>\*</code> - view  

| Param | Type |
| --- | --- |
| section | <code>Section</code> | 

<a name="ContinuousViewManager+prepend"></a>

## continuousViewManager.prepend(section) ⇒ <code>\*</code>
Prepend view

**Kind**: instance method of [<code>ContinuousViewManager</code>](#ContinuousViewManager)  
**Returns**: <code>\*</code> - view  

| Param | Type |
| --- | --- |
| section | <code>Section</code> | 

<a name="ContinuousViewManager+update"></a>

## continuousViewManager.update([offset]) ⇒ <code>Promise</code>
update

**Kind**: instance method of [<code>ContinuousViewManager</code>](#ContinuousViewManager)  

| Param | Type |
| --- | --- |
| [offset] | <code>number</code> | 

<a name="ContinuousViewManager+check"></a>

## continuousViewManager.check([offsetLeft], [offsetTop]) ⇒ <code>Promise</code>
check

**Kind**: instance method of [<code>ContinuousViewManager</code>](#ContinuousViewManager)  

| Param | Type |
| --- | --- |
| [offsetLeft] | <code>number</code> | 
| [offsetTop] | <code>number</code> | 

<a name="ContinuousViewManager+trim"></a>

## continuousViewManager.trim() ⇒ <code>Promise</code>
trim

**Kind**: instance method of [<code>ContinuousViewManager</code>](#ContinuousViewManager)  
<a name="ContinuousViewManager+erase"></a>

## continuousViewManager.erase(view, above)
erase

**Kind**: instance method of [<code>ContinuousViewManager</code>](#ContinuousViewManager)  

| Param | Type |
| --- | --- |
| view | <code>\*</code> | 
| above | <code>\*</code> | 

<a name="ContinuousViewManager+addEventListeners"></a>

## continuousViewManager.addEventListeners()
addEventListeners

**Kind**: instance method of [<code>ContinuousViewManager</code>](#ContinuousViewManager)  
<a name="ContinuousViewManager+removeEventListeners"></a>

## continuousViewManager.removeEventListeners()
removeEventListeners

**Kind**: instance method of [<code>ContinuousViewManager</code>](#ContinuousViewManager)  
<a name="ContinuousViewManager+onScroll"></a>

## continuousViewManager.onScroll()
onScroll

**Kind**: instance method of [<code>ContinuousViewManager</code>](#ContinuousViewManager)  
<a name="ContinuousViewManager+next"></a>

## continuousViewManager.next()
next

**Kind**: instance method of [<code>ContinuousViewManager</code>](#ContinuousViewManager)  
<a name="ContinuousViewManager+prev"></a>

## continuousViewManager.prev()
prev

**Kind**: instance method of [<code>ContinuousViewManager</code>](#ContinuousViewManager)  
<a name="ContinuousViewManager+destroy"></a>

## continuousViewManager.destroy()
destroy

**Kind**: instance method of [<code>ContinuousViewManager</code>](#ContinuousViewManager)  
<a name="ContinuousViewManager.name"></a>

## ContinuousViewManager.name : <code>string</code>
**Kind**: static property of [<code>ContinuousViewManager</code>](#ContinuousViewManager)  
**Read only**: true  
