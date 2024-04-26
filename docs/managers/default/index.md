<a name="DefaultViewManager"></a>

# DefaultViewManager
DefaultViewManager

**Kind**: global class  

* [DefaultViewManager](#DefaultViewManager)
    * [new DefaultViewManager(options)](#new_DefaultViewManager_new)
    * [.render(element, size)](#DefaultViewManager+render)
    * [.addEventListeners()](#DefaultViewManager+addEventListeners)
    * [.removeEventListeners()](#DefaultViewManager+removeEventListeners)
    * [.destroy()](#DefaultViewManager+destroy)
    * [.onOrientationChange(e)](#DefaultViewManager+onOrientationChange)
    * [.onResized(e)](#DefaultViewManager+onResized)
    * [.resize(width, height, epubcfi)](#DefaultViewManager+resize)
    * [.createView(section, forceRight)](#DefaultViewManager+createView) ⇒ <code>object</code>
    * [.handleNextPrePaginated(forceRight, section, action)](#DefaultViewManager+handleNextPrePaginated) ⇒ <code>\*</code>
    * [.display(section, target)](#DefaultViewManager+display) ⇒ <code>Promise</code>
    * [.afterDisplayed(view)](#DefaultViewManager+afterDisplayed)
    * [.afterResized(view)](#DefaultViewManager+afterResized)
    * [.moveTo(offset, width)](#DefaultViewManager+moveTo)
    * [.add(section, forceRight)](#DefaultViewManager+add) ⇒ <code>\*</code>
    * [.append(section, forceRight)](#DefaultViewManager+append) ⇒ <code>\*</code>
    * [.prepend(section, forceRight)](#DefaultViewManager+prepend) ⇒ <code>\*</code>
    * [.counter(bounds)](#DefaultViewManager+counter)
    * [.next()](#DefaultViewManager+next) ⇒ <code>\*</code>
    * [.prev()](#DefaultViewManager+prev) ⇒ <code>\*</code>
    * [.current()](#DefaultViewManager+current) ⇒ <code>\*</code>
    * [.clear()](#DefaultViewManager+clear)
    * [.currentLocation()](#DefaultViewManager+currentLocation) ⇒ <code>\*</code>
    * [.scrolledLocation()](#DefaultViewManager+scrolledLocation) ⇒ <code>\*</code>
    * [.paginatedLocation()](#DefaultViewManager+paginatedLocation) ⇒ <code>\*</code>
    * [.isVisible(view, offsetPrev, offsetNext, _container)](#DefaultViewManager+isVisible) ⇒ <code>boolean</code>
    * [.visible()](#DefaultViewManager+visible) ⇒ <code>Array.&lt;object&gt;</code>
    * [.scrollBy(x, y, silent)](#DefaultViewManager+scrollBy)
    * [.scrollTo(x, y, silent)](#DefaultViewManager+scrollTo)
    * [.onScroll()](#DefaultViewManager+onScroll)
    * [.bounds()](#DefaultViewManager+bounds) ⇒ <code>\*</code>
    * [.applyLayout(layout)](#DefaultViewManager+applyLayout)
    * [.updateLayout()](#DefaultViewManager+updateLayout)
    * [.setLayout(layout)](#DefaultViewManager+setLayout)
    * [.updateWritingMode(mode)](#DefaultViewManager+updateWritingMode)
    * [.updateAxis(axis, forceUpdate)](#DefaultViewManager+updateAxis)
    * [.updateFlow(flow, defaultScrolledOverflow)](#DefaultViewManager+updateFlow)
    * [.getContents()](#DefaultViewManager+getContents) ⇒ <code>Array.&lt;object&gt;</code>
    * [.direction([dir])](#DefaultViewManager+direction)
    * [.isRendered()](#DefaultViewManager+isRendered) ⇒ <code>boolean</code>

<a name="new_DefaultViewManager_new"></a>

## new DefaultViewManager(options)

| Param | Type |
| --- | --- |
| options | <code>object</code> | 

<a name="DefaultViewManager+render"></a>

## defaultViewManager.render(element, size)
render

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  

| Param | Type |
| --- | --- |
| element | <code>Element</code> | 
| size | <code>object</code> | 

<a name="DefaultViewManager+addEventListeners"></a>

## defaultViewManager.addEventListeners()
addEventListeners

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  
<a name="DefaultViewManager+removeEventListeners"></a>

## defaultViewManager.removeEventListeners()
removeEventListeners

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  
<a name="DefaultViewManager+destroy"></a>

## defaultViewManager.destroy()
destroy

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  
<a name="DefaultViewManager+onOrientationChange"></a>

## defaultViewManager.onOrientationChange(e)
onOrientationChange

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  

| Param | Type |
| --- | --- |
| e | <code>\*</code> | 

<a name="DefaultViewManager+onResized"></a>

## defaultViewManager.onResized(e)
onResized

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  

| Param | Type |
| --- | --- |
| e | <code>\*</code> | 

<a name="DefaultViewManager+resize"></a>

## defaultViewManager.resize(width, height, epubcfi)
resize

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  

| Param | Type |
| --- | --- |
| width | <code>\*</code> | 
| height | <code>\*</code> | 
| epubcfi | <code>\*</code> | 

<a name="DefaultViewManager+createView"></a>

## defaultViewManager.createView(section, forceRight) ⇒ <code>object</code>
createView

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  
**Returns**: <code>object</code> - view  

| Param | Type |
| --- | --- |
| section | <code>\*</code> | 
| forceRight | <code>\*</code> | 

<a name="DefaultViewManager+handleNextPrePaginated"></a>

## defaultViewManager.handleNextPrePaginated(forceRight, section, action) ⇒ <code>\*</code>
handleNextPrePaginated

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  

| Param | Type |
| --- | --- |
| forceRight | <code>\*</code> | 
| section | <code>\*</code> | 
| action | <code>\*</code> | 

<a name="DefaultViewManager+display"></a>

## defaultViewManager.display(section, target) ⇒ <code>Promise</code>
display

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  
**Returns**: <code>Promise</code> - displaying promise  

| Param | Type |
| --- | --- |
| section | <code>\*</code> | 
| target | <code>\*</code> | 

<a name="DefaultViewManager+afterDisplayed"></a>

## defaultViewManager.afterDisplayed(view)
afterDisplayed

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  

| Param | Type |
| --- | --- |
| view | <code>\*</code> | 

<a name="DefaultViewManager+afterResized"></a>

## defaultViewManager.afterResized(view)
afterResized

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  

| Param | Type |
| --- | --- |
| view | <code>\*</code> | 

<a name="DefaultViewManager+moveTo"></a>

## defaultViewManager.moveTo(offset, width)
moveTo

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  

| Param | Type |
| --- | --- |
| offset | <code>\*</code> | 
| width | <code>\*</code> | 

<a name="DefaultViewManager+add"></a>

## defaultViewManager.add(section, forceRight) ⇒ <code>\*</code>
add

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  

| Param | Type |
| --- | --- |
| section | <code>\*</code> | 
| forceRight | <code>\*</code> | 

<a name="DefaultViewManager+append"></a>

## defaultViewManager.append(section, forceRight) ⇒ <code>\*</code>
append

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  

| Param | Type |
| --- | --- |
| section | <code>\*</code> | 
| forceRight | <code>\*</code> | 

<a name="DefaultViewManager+prepend"></a>

## defaultViewManager.prepend(section, forceRight) ⇒ <code>\*</code>
prepend

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  

| Param | Type |
| --- | --- |
| section | <code>\*</code> | 
| forceRight | <code>\*</code> | 

<a name="DefaultViewManager+counter"></a>

## defaultViewManager.counter(bounds)
counter

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  

| Param | Type |
| --- | --- |
| bounds | <code>\*</code> | 

<a name="DefaultViewManager+next"></a>

## defaultViewManager.next() ⇒ <code>\*</code>
next

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  
<a name="DefaultViewManager+prev"></a>

## defaultViewManager.prev() ⇒ <code>\*</code>
prev

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  
<a name="DefaultViewManager+current"></a>

## defaultViewManager.current() ⇒ <code>\*</code>
current

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  
<a name="DefaultViewManager+clear"></a>

## defaultViewManager.clear()
clear

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  
<a name="DefaultViewManager+currentLocation"></a>

## defaultViewManager.currentLocation() ⇒ <code>\*</code>
currentLocation

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  
**Returns**: <code>\*</code> - location  
<a name="DefaultViewManager+scrolledLocation"></a>

## defaultViewManager.scrolledLocation() ⇒ <code>\*</code>
scrolledLocation

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  
**Returns**: <code>\*</code> - location  
<a name="DefaultViewManager+paginatedLocation"></a>

## defaultViewManager.paginatedLocation() ⇒ <code>\*</code>
paginatedLocation

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  
**Returns**: <code>\*</code> - location  
<a name="DefaultViewManager+isVisible"></a>

## defaultViewManager.isVisible(view, offsetPrev, offsetNext, _container) ⇒ <code>boolean</code>
isVisible

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  

| Param | Type |
| --- | --- |
| view | <code>\*</code> | 
| offsetPrev | <code>\*</code> | 
| offsetNext | <code>\*</code> | 
| _container | <code>\*</code> | 

<a name="DefaultViewManager+visible"></a>

## defaultViewManager.visible() ⇒ <code>Array.&lt;object&gt;</code>
visible

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  
**Returns**: <code>Array.&lt;object&gt;</code> - visible  
<a name="DefaultViewManager+scrollBy"></a>

## defaultViewManager.scrollBy(x, y, silent)
scrollBy

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  

| Param | Type |
| --- | --- |
| x | <code>\*</code> | 
| y | <code>\*</code> | 
| silent | <code>\*</code> | 

<a name="DefaultViewManager+scrollTo"></a>

## defaultViewManager.scrollTo(x, y, silent)
scrollTo

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  

| Param | Type |
| --- | --- |
| x | <code>\*</code> | 
| y | <code>\*</code> | 
| silent | <code>\*</code> | 

<a name="DefaultViewManager+onScroll"></a>

## defaultViewManager.onScroll()
onScroll

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  
<a name="DefaultViewManager+bounds"></a>

## defaultViewManager.bounds() ⇒ <code>\*</code>
bounds

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  
<a name="DefaultViewManager+applyLayout"></a>

## defaultViewManager.applyLayout(layout)
applyLayout

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  

| Param | Type |
| --- | --- |
| layout | <code>\*</code> | 

<a name="DefaultViewManager+updateLayout"></a>

## defaultViewManager.updateLayout()
updateLayout

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  
<a name="DefaultViewManager+setLayout"></a>

## defaultViewManager.setLayout(layout)
setLayout

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  

| Param | Type |
| --- | --- |
| layout | <code>\*</code> | 

<a name="DefaultViewManager+updateWritingMode"></a>

## defaultViewManager.updateWritingMode(mode)
updateWritingMode

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  

| Param | Type |
| --- | --- |
| mode | <code>\*</code> | 

<a name="DefaultViewManager+updateAxis"></a>

## defaultViewManager.updateAxis(axis, forceUpdate)
updateAxis

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  

| Param | Type |
| --- | --- |
| axis | <code>\*</code> | 
| forceUpdate | <code>\*</code> | 

<a name="DefaultViewManager+updateFlow"></a>

## defaultViewManager.updateFlow(flow, defaultScrolledOverflow)
updateFlow

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  

| Param | Type | Default |
| --- | --- | --- |
| flow | <code>\*</code> |  | 
| defaultScrolledOverflow | <code>\*</code> | <code>auto</code> | 

<a name="DefaultViewManager+getContents"></a>

## defaultViewManager.getContents() ⇒ <code>Array.&lt;object&gt;</code>
getContents

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  
<a name="DefaultViewManager+direction"></a>

## defaultViewManager.direction([dir])
direction

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  

| Param | Type | Default |
| --- | --- | --- |
| [dir] | <code>string</code> | <code>&quot;&#x27;ltr&#x27;&quot;</code> | 

<a name="DefaultViewManager+isRendered"></a>

## defaultViewManager.isRendered() ⇒ <code>boolean</code>
isRendered

**Kind**: instance method of [<code>DefaultViewManager</code>](#DefaultViewManager)  
