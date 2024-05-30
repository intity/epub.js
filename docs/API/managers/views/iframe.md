<a name="IframeView"></a>

# IframeView
IframeView class

**Kind**: global class  

* [IframeView](#IframeView)
    * [new IframeView(layout, section, [options])](#new_IframeView_new)
    * _instance_
        * [.create()](#IframeView+create) ⇒ <code>Element</code>
        * [.render(request)](#IframeView+render) ⇒ <code>object</code>
        * [.reset()](#IframeView+reset)
        * [.size([width], [height])](#IframeView+size)
        * [.lock(what, width, height)](#IframeView+lock)
        * [.expand()](#IframeView+expand)
        * [.reframe(width, height)](#IframeView+reframe)
        * [.load(contents)](#IframeView+load) ⇒ <code>Promise</code>
        * [.onLoad(event, promise)](#IframeView+onLoad)
        * [.setAxis(value)](#IframeView+setAxis)
        * [.setWritingMode(mode)](#IframeView+setWritingMode)
        * [.display(request)](#IframeView+display) ⇒ <code>Promise</code>
        * [.show()](#IframeView+show)
        * [.hide()](#IframeView+hide)
        * [.offset()](#IframeView+offset) ⇒ <code>object</code>
        * [.position()](#IframeView+position) ⇒ <code>DOMRect</code>
        * [.locationOf(target)](#IframeView+locationOf) ⇒ <code>object</code>
        * [.bounds([force])](#IframeView+bounds) ⇒ <code>Element</code>
        * [.highlight(cfiRange, [data], cb, [className], [styles])](#IframeView+highlight) ⇒ <code>object</code>
        * [.underline(cfiRange, [data], cb, [className], [styles])](#IframeView+underline) ⇒ <code>object</code>
        * [.mark(cfiRange, [data], cb)](#IframeView+mark) ⇒ <code>object</code>
        * [.placeMark(element, range)](#IframeView+placeMark)
        * [.unhighlight(cfiRange)](#IframeView+unhighlight)
        * [.ununderline(cfiRange)](#IframeView+ununderline)
        * [.unmark(cfiRange)](#IframeView+unmark)
        * [.destroy()](#IframeView+destroy)
    * _static_
        * [.settings](#IframeView.settings) : <code>object</code>
        * [.id](#IframeView.id) : <code>string</code>
        * [.section](#IframeView.section) : <code>Section</code>
        * [.epubcfi](#IframeView.epubcfi) : <code>EpubCFI</code>
        * [.layout](#IframeView.layout) : <code>Layout</code>

<a name="new_IframeView_new"></a>

## new IframeView(layout, section, [options])
Constructor


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| layout | <code>Layout</code> |  |  |
| section | <code>Section</code> |  |  |
| [options] | <code>object</code> |  |  |
| [options.axis] | <code>string</code> |  | values: `"horizontal"` OR `"vertical"` |
| [options.method] | <code>string</code> |  | values: `"blobUrl"` OR `"srcdoc"` OR `"write"` |
| [options.ignoreClass] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> |  |
| [options.allowPopups] | <code>boolean</code> | <code>false</code> |  |
| [options.allowScriptedContent] | <code>boolean</code> | <code>false</code> |  |
| [options.forceRight] | <code>boolean</code> | <code>false</code> |  |

<a name="IframeView+create"></a>

## iframeView.create() ⇒ <code>Element</code>
Create iframe element

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  
**Returns**: <code>Element</code> - iframe  
<a name="IframeView+render"></a>

## iframeView.render(request) ⇒ <code>object</code>
render

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  
**Returns**: <code>object</code> - section render object  

| Param | Type |
| --- | --- |
| request | <code>function</code> | 

<a name="IframeView+reset"></a>

## iframeView.reset()
reset

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  
<a name="IframeView+size"></a>

## iframeView.size([width], [height])
size
Determine locks base on settings

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  

| Param | Type |
| --- | --- |
| [width] | <code>number</code> | 
| [height] | <code>number</code> | 

<a name="IframeView+lock"></a>

## iframeView.lock(what, width, height)
lock
Lock an axis to element dimensions, taking borders into account

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  

| Param | Type |
| --- | --- |
| what | <code>string</code> | 
| width | <code>number</code> | 
| height | <code>number</code> | 

<a name="IframeView+expand"></a>

## iframeView.expand()
expand
Resize a single axis based on content dimensions

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  
<a name="IframeView+reframe"></a>

## iframeView.reframe(width, height)
reframe

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  

| Param | Type |
| --- | --- |
| width | <code>number</code> | 
| height | <code>number</code> | 

<a name="IframeView+load"></a>

## iframeView.load(contents) ⇒ <code>Promise</code>
load

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  
**Returns**: <code>Promise</code> - loading promise  

| Param | Type |
| --- | --- |
| contents | <code>string</code> | 

<a name="IframeView+onLoad"></a>

## iframeView.onLoad(event, promise)
onLoad

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  

| Param | Type |
| --- | --- |
| event | <code>Event</code> | 
| promise | <code>defer</code> | 

<a name="IframeView+setAxis"></a>

## iframeView.setAxis(value)
Set axis

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  

| Param | Type |
| --- | --- |
| value | <code>string</code> | 

<a name="IframeView+setWritingMode"></a>

## iframeView.setWritingMode(mode)
Set writing mode

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  

| Param | Type |
| --- | --- |
| mode | <code>string</code> | 

<a name="IframeView+display"></a>

## iframeView.display(request) ⇒ <code>Promise</code>
display

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  
**Returns**: <code>Promise</code> - displayed promise  

| Param | Type |
| --- | --- |
| request | <code>function</code> | 

<a name="IframeView+show"></a>

## iframeView.show()
show

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  
<a name="IframeView+hide"></a>

## iframeView.hide()
hide

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  
<a name="IframeView+offset"></a>

## iframeView.offset() ⇒ <code>object</code>
offset

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  
<a name="IframeView+position"></a>

## iframeView.position() ⇒ <code>DOMRect</code>
position

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  
<a name="IframeView+locationOf"></a>

## iframeView.locationOf(target) ⇒ <code>object</code>
locationOf

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  

| Param | Type |
| --- | --- |
| target | <code>\*</code> | 

<a name="IframeView+bounds"></a>

## iframeView.bounds([force]) ⇒ <code>Element</code>
bounds

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  

| Param | Type | Default |
| --- | --- | --- |
| [force] | <code>boolean</code> | <code>false</code> | 

<a name="IframeView+highlight"></a>

## iframeView.highlight(cfiRange, [data], cb, [className], [styles]) ⇒ <code>object</code>
highlight

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| cfiRange | <code>string</code> \| <code>EpubCFI</code> |  |  |
| [data] | <code>object</code> | <code>{}</code> |  |
| cb | <code>function</code> |  | callback function |
| [className] | <code>string</code> | <code>&quot;&#x27;epubjs-hl&#x27;&quot;</code> |  |
| [styles] | <code>object</code> | <code>{}</code> |  |

<a name="IframeView+underline"></a>

## iframeView.underline(cfiRange, [data], cb, [className], [styles]) ⇒ <code>object</code>
underline

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  

| Param | Type | Default |
| --- | --- | --- |
| cfiRange | <code>\*</code> |  | 
| [data] | <code>\*</code> | <code>{}</code> | 
| cb | <code>\*</code> |  | 
| [className] | <code>\*</code> | <code>&#x27;epubjs-ul&#x27;</code> | 
| [styles] | <code>\*</code> | <code>{}</code> | 

<a name="IframeView+mark"></a>

## iframeView.mark(cfiRange, [data], cb) ⇒ <code>object</code>
mark

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  

| Param | Type | Default |
| --- | --- | --- |
| cfiRange | <code>\*</code> |  | 
| [data] | <code>\*</code> | <code>{}</code> | 
| cb | <code>\*</code> |  | 

<a name="IframeView+placeMark"></a>

## iframeView.placeMark(element, range)
placeMark

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  

| Param | Type |
| --- | --- |
| element | <code>\*</code> | 
| range | <code>\*</code> | 

<a name="IframeView+unhighlight"></a>

## iframeView.unhighlight(cfiRange)
unhighlight

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  

| Param | Type |
| --- | --- |
| cfiRange | <code>\*</code> | 

<a name="IframeView+ununderline"></a>

## iframeView.ununderline(cfiRange)
ununderline

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  

| Param | Type |
| --- | --- |
| cfiRange | <code>\*</code> | 

<a name="IframeView+unmark"></a>

## iframeView.unmark(cfiRange)
unmark

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  

| Param | Type |
| --- | --- |
| cfiRange | <code>\*</code> | 

<a name="IframeView+destroy"></a>

## iframeView.destroy()
destroy

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  
<a name="IframeView.settings"></a>

## IframeView.settings : <code>object</code>
**Kind**: static property of [<code>IframeView</code>](#IframeView)  
**Read only**: true  
<a name="IframeView.id"></a>

## IframeView.id : <code>string</code>
**Kind**: static property of [<code>IframeView</code>](#IframeView)  
**Read only**: true  
<a name="IframeView.section"></a>

## IframeView.section : <code>Section</code>
**Kind**: static property of [<code>IframeView</code>](#IframeView)  
**Read only**: true  
<a name="IframeView.epubcfi"></a>

## IframeView.epubcfi : <code>EpubCFI</code>
Blank Cfi for Parsing

**Kind**: static property of [<code>IframeView</code>](#IframeView)  
**Read only**: true  
<a name="IframeView.layout"></a>

## IframeView.layout : <code>Layout</code>
**Kind**: static property of [<code>IframeView</code>](#IframeView)  
**Read only**: true  
