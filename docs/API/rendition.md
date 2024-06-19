<a name="Rendition"></a>

# Rendition
Displays an Epub as a series of Views for each Section.
Requires Manager and View class to handle specifics of rendering
the section content.

**Kind**: global class  

* [Rendition](#Rendition)
    * [new Rendition(book, [options])](#new_Rendition_new)
    * _instance_
        * [.setManager(manager)](#Rendition+setManager)
        * [.requireManager(manager)](#Rendition+requireManager) ⇒ <code>any</code>
        * [.start()](#Rendition+start)
        * [.attachTo(element)](#Rendition+attachTo) ⇒ <code>Promise</code>
        * [.display(target)](#Rendition+display) ⇒ <code>Promise</code>
        * [.moveTo(offset)](#Rendition+moveTo)
        * [.resize([width], [height], [epubcfi])](#Rendition+resize)
        * [.clear()](#Rendition+clear)
        * [.next()](#Rendition+next) ⇒ <code>Promise</code>
        * [.prev()](#Rendition+prev) ⇒ <code>Promise</code>
        * [.updateLayout(options)](#Rendition+updateLayout)
        * [.reportLocation()](#Rendition+reportLocation) ⇒ <code>Promise</code>
        * [.currentLocation()](#Rendition+currentLocation) ⇒ <code>displayedLocation</code> \| <code>Promise</code>
        * [.destroy()](#Rendition+destroy)
        * [.getRange(epubcfi, ignoreClass)](#Rendition+getRange) ⇒ <code>Range</code>
        * [.getContents()](#Rendition+getContents) ⇒ <code>Array.&lt;object&gt;</code>
        * [.views()](#Rendition+views) ⇒ <code>Array.&lt;object&gt;</code>
    * _static_
        * [.settings](#Rendition.settings) : <code>object</code>
        * [.hooks](#Rendition.hooks) : <code>object</code>
        * [.annotations](#Rendition.annotations) : <code>Annotations</code>
        * [.themes](#Rendition.themes) : <code>Themes</code>
        * [.started](#Rendition.started) : <code>Promise</code>
        * ["layout" (props, changed)](#Rendition.event_layout)
        * ["started"](#Rendition.event_started)
        * ["attached"](#Rendition.event_attached)
        * ["displayed" (section)](#Rendition.event_displayed)
        * ["displayError" (err)](#Rendition.event_displayError)
        * ["rendered" (view)](#Rendition.event_rendered)
        * ["removed" (view)](#Rendition.event_removed)
        * ["resized" (size, [epubcfi])](#Rendition.event_resized)
        * ["orientationchange" (orientation)](#Rendition.event_orientationchange)
        * ["relocated"](#Rendition.event_relocated)
        * ["selected" (cfirange, contents)](#Rendition.event_selected)
        * ["markClicked" (cfiRange, data, contents)](#Rendition.event_markClicked)
        * [.location](#Rendition.location) : <code>Object</code>

<a name="new_Rendition_new"></a>

## new Rendition(book, [options])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| book | <code>Book</code> |  |  |
| [options] | <code>object</code> |  |  |
| [options.width] | <code>number</code> |  |  |
| [options.height] | <code>number</code> |  |  |
| [options.ignoreClass] | <code>string</code> |  | class for the cfi parser to ignore |
| [options.manager] | <code>string</code> \| <code>function</code> \| <code>object</code> | <code>&quot;&#x27;default&#x27;&quot;</code> | string values: default / continuous |
| [options.view] | <code>string</code> \| <code>function</code> | <code>&quot;&#x27;iframe&#x27;&quot;</code> |  |
| [options.layout] | <code>string</code> |  | layout to force |
| [options.spread] | <code>string</code> |  | force spread value |
| [options.direction] | <code>string</code> |  | direction `"ltr"` OR `"rtl"` |
| [options.minSpreadWidth] | <code>number</code> |  | overridden by spread: none (never) / both (always) |
| [options.stylesheet] | <code>string</code> |  | url of stylesheet to be injected |
| [options.script] | <code>string</code> |  | url of script to be injected |
| [options.snap] | <code>object</code> |  | use snap scrolling |
| [options.fullsize] | <code>boolean</code> | <code>false</code> |  |
| [options.allowPopups] | <code>boolean</code> | <code>false</code> | enable opening popup in content |
| [options.allowScriptedContent] | <code>boolean</code> | <code>false</code> | enable running scripts in content |
| [options.resizeOnOrientationChange] | <code>boolean</code> | <code>true</code> | false to disable orientation events |

<a name="Rendition+setManager"></a>

## rendition.setManager(manager)
Set the manager function

**Kind**: instance method of [<code>Rendition</code>](#Rendition)  

| Param | Type |
| --- | --- |
| manager | <code>function</code> | 

<a name="Rendition+requireManager"></a>

## rendition.requireManager(manager) ⇒ <code>any</code>
Require the manager from passed string, or as a class function

**Kind**: instance method of [<code>Rendition</code>](#Rendition)  

| Param | Type | Description |
| --- | --- | --- |
| manager | <code>string</code> \| <code>object</code> | [description] |

<a name="Rendition+start"></a>

## rendition.start()
Start the rendering

**Kind**: instance method of [<code>Rendition</code>](#Rendition)  
<a name="Rendition+attachTo"></a>

## rendition.attachTo(element) ⇒ <code>Promise</code>
Call to attach the container to an element in the dom
Container must be attached before rendering can begin

**Kind**: instance method of [<code>Rendition</code>](#Rendition)  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>Element</code> | to attach to |

<a name="Rendition+display"></a>

## rendition.display(target) ⇒ <code>Promise</code>
Display a point in the book
The request will be added to the rendering Queue,
so it will wait until book is opened, rendering started
and all other rendering tasks have finished to be called.

**Kind**: instance method of [<code>Rendition</code>](#Rendition)  

| Param | Type | Description |
| --- | --- | --- |
| target | <code>string</code> | Url or EpubCFI |

<a name="Rendition+moveTo"></a>

## rendition.moveTo(offset)
Move the Rendition to a specific offset
Usually you would be better off calling display()

**Kind**: instance method of [<code>Rendition</code>](#Rendition)  

| Param | Type |
| --- | --- |
| offset | <code>object</code> | 

<a name="Rendition+resize"></a>

## rendition.resize([width], [height], [epubcfi])
Trigger a resize of the views

**Kind**: instance method of [<code>Rendition</code>](#Rendition)  

| Param | Type |
| --- | --- |
| [width] | <code>number</code> | 
| [height] | <code>number</code> | 
| [epubcfi] | <code>string</code> | 

<a name="Rendition+clear"></a>

## rendition.clear()
Clear all rendered views

**Kind**: instance method of [<code>Rendition</code>](#Rendition)  
<a name="Rendition+next"></a>

## rendition.next() ⇒ <code>Promise</code>
Go to the next "page" in the rendition

**Kind**: instance method of [<code>Rendition</code>](#Rendition)  
<a name="Rendition+prev"></a>

## rendition.prev() ⇒ <code>Promise</code>
Go to the previous "page" in the rendition

**Kind**: instance method of [<code>Rendition</code>](#Rendition)  
<a name="Rendition+updateLayout"></a>

## rendition.updateLayout(options)
Layout configuration

**Kind**: instance method of [<code>Rendition</code>](#Rendition)  

| Param | Type |
| --- | --- |
| options | <code>object</code> | 

<a name="Rendition+reportLocation"></a>

## rendition.reportLocation() ⇒ <code>Promise</code>
Report the current location

**Kind**: instance method of [<code>Rendition</code>](#Rendition)  
**Emits**: <code>event:relocated</code>  
<a name="Rendition+currentLocation"></a>

## rendition.currentLocation() ⇒ <code>displayedLocation</code> \| <code>Promise</code>
Get the Current Location object

**Kind**: instance method of [<code>Rendition</code>](#Rendition)  
**Returns**: <code>displayedLocation</code> \| <code>Promise</code> - location (may be a promise)  
<a name="Rendition+destroy"></a>

## rendition.destroy()
Remove and Clean Up the Rendition

**Kind**: instance method of [<code>Rendition</code>](#Rendition)  
<a name="Rendition+getRange"></a>

## rendition.getRange(epubcfi, ignoreClass) ⇒ <code>Range</code>
Get a Range from a Visible CFI

**Kind**: instance method of [<code>Rendition</code>](#Rendition)  

| Param | Type | Description |
| --- | --- | --- |
| epubcfi | <code>string</code> | EpubCfi string |
| ignoreClass | <code>string</code> |  |

<a name="Rendition+getContents"></a>

## rendition.getContents() ⇒ <code>Array.&lt;object&gt;</code>
Get the Contents object of each rendered view

**Kind**: instance method of [<code>Rendition</code>](#Rendition)  
<a name="Rendition+views"></a>

## rendition.views() ⇒ <code>Array.&lt;object&gt;</code>
Get the views member from the manager

**Kind**: instance method of [<code>Rendition</code>](#Rendition)  
<a name="Rendition.settings"></a>

## Rendition.settings : <code>object</code>
**Kind**: static property of [<code>Rendition</code>](#Rendition)  
**Read only**: true  
<a name="Rendition.hooks"></a>

## Rendition.hooks : <code>object</code>
Adds Hook methods to the Rendition prototype

**Kind**: static property of [<code>Rendition</code>](#Rendition)  
**Properties**

| Name | Type |
| --- | --- |
| hooks.content | <code>Hook</code> | 
| hooks.display | <code>Hook</code> | 
| hooks.layout | <code>Hook</code> | 
| hooks.render | <code>Hook</code> | 
| hooks.show | <code>Hook</code> | 
| hooks.unloaded | <code>Hook</code> | 

<a name="Rendition.annotations"></a>

## Rendition.annotations : <code>Annotations</code>
**Kind**: static property of [<code>Rendition</code>](#Rendition)  
**Read only**: true  
<a name="Rendition.themes"></a>

## Rendition.themes : <code>Themes</code>
**Kind**: static property of [<code>Rendition</code>](#Rendition)  
**Read only**: true  
<a name="Rendition.started"></a>

## Rendition.started : <code>Promise</code>
returns after the rendition has started

**Kind**: static property of [<code>Rendition</code>](#Rendition)  
<a name="Rendition.event_layout"></a>

## "layout" (props, changed)
Emit of updated the Layout state

**Kind**: event emitted by [<code>Rendition</code>](#Rendition)  

| Param | Type |
| --- | --- |
| props | <code>Layout</code> | 
| changed | <code>object</code> | 

<a name="Rendition.event_started"></a>

## "started"
Emit that rendering has started

**Kind**: event emitted by [<code>Rendition</code>](#Rendition)  
<a name="Rendition.event_attached"></a>

## "attached"
Emit that rendering has attached to an element

**Kind**: event emitted by [<code>Rendition</code>](#Rendition)  
<a name="Rendition.event_displayed"></a>

## "displayed" (section)
Emit that a section has been displayed

**Kind**: event emitted by [<code>Rendition</code>](#Rendition)  

| Param | Type |
| --- | --- |
| section | <code>Section</code> | 

<a name="Rendition.event_displayError"></a>

## "displayError" (err)
Emit that has been an error displaying

**Kind**: event emitted by [<code>Rendition</code>](#Rendition)  

| Param | Type |
| --- | --- |
| err | <code>\*</code> | 

<a name="Rendition.event_rendered"></a>

## "rendered" (view)
Emit that a section has been rendered

**Kind**: event emitted by [<code>Rendition</code>](#Rendition)  

| Param | Type |
| --- | --- |
| view | <code>View</code> | 

<a name="Rendition.event_removed"></a>

## "removed" (view)
Emit that a section has been removed

**Kind**: event emitted by [<code>Rendition</code>](#Rendition)  

| Param | Type |
| --- | --- |
| view | <code>View</code> | 

<a name="Rendition.event_resized"></a>

## "resized" (size, [epubcfi])
Emit that the rendition has been resized

**Kind**: event emitted by [<code>Rendition</code>](#Rendition)  

| Param | Type |
| --- | --- |
| size | <code>object</code> | 
| size.width | <code>number</code> | 
| size.height | <code>number</code> | 
| [epubcfi] | <code>string</code> | 

<a name="Rendition.event_orientationchange"></a>

## "orientationchange" (orientation)
Emit that the rendition has been rotated

**Kind**: event emitted by [<code>Rendition</code>](#Rendition)  

| Param | Type |
| --- | --- |
| orientation | <code>ScreenOrientation</code> | 

<a name="Rendition.event_relocated"></a>

## "relocated"
**Kind**: event emitted by [<code>Rendition</code>](#Rendition)  
<a name="Rendition.event_selected"></a>

## "selected" (cfirange, contents)
Emit that a text selection has occurred

**Kind**: event emitted by [<code>Rendition</code>](#Rendition)  

| Param | Type |
| --- | --- |
| cfirange | <code>string</code> | 
| contents | <code>Contents</code> | 

<a name="Rendition.event_markClicked"></a>

## "markClicked" (cfiRange, data, contents)
Emit that a mark was clicked

**Kind**: event emitted by [<code>Rendition</code>](#Rendition)  

| Param | Type |
| --- | --- |
| cfiRange | <code>EpubCFI</code> | 
| data | <code>object</code> | 
| contents | <code>Contents</code> | 

<a name="Rendition.location"></a>

## Rendition.location : <code>Object</code>
A Rendered Location Range

**Kind**: static typedef of [<code>Rendition</code>](#Rendition)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| start | <code>object</code> |  |
| start.index | <code>string</code> |  |
| start.href | <code>string</code> |  |
| start.displayed | <code>object</code> |  |
| start.displayed.page | <code>number</code> |  |
| start.displayed.total | <code>number</code> |  |
| start.cfi | <code>string</code> | EpubCFI string format |
| start.location | <code>number</code> |  |
| start.percentage | <code>number</code> |  |
| end | <code>object</code> |  |
| end.index | <code>string</code> |  |
| end.href | <code>string</code> |  |
| end.displayed | <code>object</code> |  |
| end.displayed.page | <code>number</code> |  |
| end.displayed.total | <code>number</code> |  |
| end.cfi | <code>string</code> | EpubCFI string format |
| end.location | <code>number</code> |  |
| end.percentage | <code>number</code> |  |
| atStart | <code>boolean</code> | Location at start position |
| atEnd | <code>boolean</code> | Location at end position |

