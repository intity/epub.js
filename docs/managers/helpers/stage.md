<a name="Stage"></a>

# Stage
Stage

**Kind**: global class  

* [Stage](#Stage)
    * [new Stage(options)](#new_Stage_new)
    * [.create(options)](#Stage+create) ⇒ <code>Element</code>
    * [.wrap(container)](#Stage+wrap) ⇒ <code>Element</code>
    * [.getElement(element)](#Stage+getElement) ⇒ <code>Element</code>
    * [.attachTo(what)](#Stage+attachTo) ⇒ <code>Element</code>
    * [.getContainer()](#Stage+getContainer) ⇒ <code>Element</code>
    * [.onResize(func)](#Stage+onResize)
    * [.onOrientationChange(func)](#Stage+onOrientationChange)
    * [.size(width, height)](#Stage+size) ⇒ <code>object</code>
    * [.bounds()](#Stage+bounds) ⇒ <code>object</code>
    * [.getSheet()](#Stage+getSheet) ⇒ <code>CSSStyleSheet</code>
    * [.addStyleRules(selector, rulesArray)](#Stage+addStyleRules)
    * [.axis(axis)](#Stage+axis)
    * [.direction(dir)](#Stage+direction)
    * [.overflow(overflow)](#Stage+overflow)
    * [.destroy()](#Stage+destroy)

<a name="new_Stage_new"></a>

## new Stage(options)

| Param | Type |
| --- | --- |
| options | <code>object</code> | 
| options.axis | <code>string</code> | 
| options.direction | <code>string</code> | 
| options.fullsize | <code>boolean</code> | 
| options.width | <code>string</code> \| <code>number</code> | 
| options.height | <code>string</code> \| <code>number</code> | 

<a name="Stage+create"></a>

## stage.create(options) ⇒ <code>Element</code>
Creates an element to render to.
Resizes to passed width and height or to the elements size

**Kind**: instance method of [<code>Stage</code>](#Stage)  
**Returns**: <code>Element</code> - container  

| Param | Type |
| --- | --- |
| options | <code>object</code> | 

<a name="Stage+wrap"></a>

## stage.wrap(container) ⇒ <code>Element</code>
wrap

**Kind**: instance method of [<code>Stage</code>](#Stage)  
**Returns**: <code>Element</code> - wrapper  

| Param | Type |
| --- | --- |
| container | <code>Element</code> | 

<a name="Stage+getElement"></a>

## stage.getElement(element) ⇒ <code>Element</code>
getElement

**Kind**: instance method of [<code>Stage</code>](#Stage)  

| Param | Type |
| --- | --- |
| element | <code>Element</code> \| <code>string</code> | 

<a name="Stage+attachTo"></a>

## stage.attachTo(what) ⇒ <code>Element</code>
attachTo

**Kind**: instance method of [<code>Stage</code>](#Stage)  

| Param | Type |
| --- | --- |
| what | <code>Element</code> \| <code>string</code> | 

<a name="Stage+getContainer"></a>

## stage.getContainer() ⇒ <code>Element</code>
getContainer

**Kind**: instance method of [<code>Stage</code>](#Stage)  
**Returns**: <code>Element</code> - container  
<a name="Stage+onResize"></a>

## stage.onResize(func)
onResize

**Kind**: instance method of [<code>Stage</code>](#Stage)  

| Param | Type |
| --- | --- |
| func | <code>\*</code> | 

<a name="Stage+onOrientationChange"></a>

## stage.onOrientationChange(func)
onOrientationChange

**Kind**: instance method of [<code>Stage</code>](#Stage)  

| Param | Type |
| --- | --- |
| func | <code>\*</code> | 

<a name="Stage+size"></a>

## stage.size(width, height) ⇒ <code>object</code>
size

**Kind**: instance method of [<code>Stage</code>](#Stage)  

| Param | Type |
| --- | --- |
| width | <code>string</code> \| <code>number</code> | 
| height | <code>string</code> \| <code>number</code> | 

<a name="Stage+bounds"></a>

## stage.bounds() ⇒ <code>object</code>
bounds

**Kind**: instance method of [<code>Stage</code>](#Stage)  
<a name="Stage+getSheet"></a>

## stage.getSheet() ⇒ <code>CSSStyleSheet</code>
getSheet

**Kind**: instance method of [<code>Stage</code>](#Stage)  
<a name="Stage+addStyleRules"></a>

## stage.addStyleRules(selector, rulesArray)
addStyleRules

**Kind**: instance method of [<code>Stage</code>](#Stage)  

| Param | Type |
| --- | --- |
| selector | <code>\*</code> | 
| rulesArray | <code>Array.&lt;object&gt;</code> | 

<a name="Stage+axis"></a>

## stage.axis(axis)
axis

**Kind**: instance method of [<code>Stage</code>](#Stage)  

| Param | Type |
| --- | --- |
| axis | <code>string</code> | 

<a name="Stage+direction"></a>

## stage.direction(dir)
direction

**Kind**: instance method of [<code>Stage</code>](#Stage)  

| Param | Type |
| --- | --- |
| dir | <code>string</code> | 

<a name="Stage+overflow"></a>

## stage.overflow(overflow)
overflow

**Kind**: instance method of [<code>Stage</code>](#Stage)  

| Param | Type |
| --- | --- |
| overflow | <code>string</code> | 

<a name="Stage+destroy"></a>

## stage.destroy()
destroy

**Kind**: instance method of [<code>Stage</code>](#Stage)  
