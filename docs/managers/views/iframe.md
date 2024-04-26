<a name="IframeView"></a>

# IframeView
IframeView

**Kind**: global class  

* [IframeView](#IframeView)
    * [new IframeView(section, [options])](#new_IframeView_new)
    * [.container(axis)](#IframeView+container) ⇒ <code>Element</code>
    * [.create()](#IframeView+create) ⇒ <code>Element</code>
    * [.render(request, show)](#IframeView+render) ⇒ <code>object</code>
    * [.reset()](#IframeView+reset)
    * [.size(_width, _height)](#IframeView+size)
    * [.lock(what, width, height)](#IframeView+lock)
    * [.expand(force)](#IframeView+expand)
    * [.reframe(width, height)](#IframeView+reframe)
    * [.load(contents)](#IframeView+load) ⇒ <code>Promise</code>
    * [.onLoad(event, promise)](#IframeView+onLoad)
    * [.setLayout(layout)](#IframeView+setLayout)
    * [.setAxis(axis)](#IframeView+setAxis)
    * [.setWritingMode(mode)](#IframeView+setWritingMode)
    * [.display(request)](#IframeView+display) ⇒ <code>Promise</code>
    * [.show()](#IframeView+show)
    * [.hide()](#IframeView+hide)
    * [.offset()](#IframeView+offset) ⇒ <code>object</code>
    * [.width()](#IframeView+width) ⇒ <code>number</code>
    * [.height()](#IframeView+height) ⇒ <code>number</code>
    * [.position()](#IframeView+position) ⇒ <code>DOMRect</code>
    * [.locationOf(target)](#IframeView+locationOf) ⇒ <code>object</code>
    * [.bounds(force)](#IframeView+bounds) ⇒ <code>Element</code>
    * [.highlight(cfiRange, [data], cb, [className], [styles])](#IframeView+highlight) ⇒ <code>object</code>
    * [.underline(cfiRange, [data], cb, [className], [styles])](#IframeView+underline) ⇒ <code>object</code>
    * [.mark(cfiRange, [data], cb)](#IframeView+mark) ⇒ <code>object</code>
    * [.placeMark(element, range)](#IframeView+placeMark)
    * [.unhighlight(cfiRange)](#IframeView+unhighlight)
    * [.ununderline(cfiRange)](#IframeView+ununderline)
    * [.unmark(cfiRange)](#IframeView+unmark)
    * [.destroy()](#IframeView+destroy)

<a name="new_IframeView_new"></a>

## new IframeView(section, [options])

| Param | Type | Default |
| --- | --- | --- |
| section | <code>\*</code> |  | 
| [options] | <code>object</code> |  | 
| [options.allowPopups] | <code>boolean</code> | <code>false</code> | 
| [options.allowScriptedContent] | <code>boolean</code> | <code>false</code> | 
| [options.axis] | <code>\*</code> |  | 
| [options.direction] | <code>\*</code> |  | 
| [options.forceRight] | <code>boolean</code> | <code>false</code> | 
| [options.globalLayoutProperties] | <code>object</code> | <code>{}</code> | 
| [options.width] | <code>number</code> |  | 
| [options.height] | <code>number</code> |  | 
| [options.ignoreClass] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | 
| [options.layout] | <code>\*</code> |  | 
| [options.method] | <code>\*</code> |  | 

<a name="IframeView+container"></a>

## iframeView.container(axis) ⇒ <code>Element</code>
container

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  
**Returns**: <code>Element</code> - HTML element  

| Param | Type |
| --- | --- |
| axis | <code>\*</code> | 

<a name="IframeView+create"></a>

## iframeView.create() ⇒ <code>Element</code>
create

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  
**Returns**: <code>Element</code> - iframe  
<a name="IframeView+render"></a>

## iframeView.render(request, show) ⇒ <code>object</code>
render

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  
**Returns**: <code>object</code> - section render object  

| Param | Type |
| --- | --- |
| request | <code>\*</code> | 
| show | <code>\*</code> | 

<a name="IframeView+reset"></a>

## iframeView.reset()
reset

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  
<a name="IframeView+size"></a>

## iframeView.size(_width, _height)
size
Determine locks base on settings

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  

| Param | Type |
| --- | --- |
| _width | <code>\*</code> | 
| _height | <code>\*</code> | 

<a name="IframeView+lock"></a>

## iframeView.lock(what, width, height)
lock
Lock an axis to element dimensions, taking borders into account

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  

| Param | Type |
| --- | --- |
| what | <code>\*</code> | 
| width | <code>\*</code> | 
| height | <code>\*</code> | 

<a name="IframeView+expand"></a>

## iframeView.expand(force)
expand
Resize a single axis based on content dimensions

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  

| Param | Type |
| --- | --- |
| force | <code>\*</code> | 

<a name="IframeView+reframe"></a>

## iframeView.reframe(width, height)
reframe

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  

| Param | Type |
| --- | --- |
| width | <code>\*</code> | 
| height | <code>\*</code> | 

<a name="IframeView+load"></a>

## iframeView.load(contents) ⇒ <code>Promise</code>
load

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  
**Returns**: <code>Promise</code> - loading promise  

| Param | Type |
| --- | --- |
| contents | <code>\*</code> | 

<a name="IframeView+onLoad"></a>

## iframeView.onLoad(event, promise)
onLoad

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  

| Param | Type |
| --- | --- |
| event | <code>\*</code> | 
| promise | <code>\*</code> | 

<a name="IframeView+setLayout"></a>

## iframeView.setLayout(layout)
setLayout

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  

| Param | Type |
| --- | --- |
| layout | <code>\*</code> | 

<a name="IframeView+setAxis"></a>

## iframeView.setAxis(axis)
setAxis

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  

| Param | Type |
| --- | --- |
| axis | <code>\*</code> | 

<a name="IframeView+setWritingMode"></a>

## iframeView.setWritingMode(mode)
setWritingMode

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  

| Param | Type |
| --- | --- |
| mode | <code>\*</code> | 

<a name="IframeView+display"></a>

## iframeView.display(request) ⇒ <code>Promise</code>
display

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  
**Returns**: <code>Promise</code> - displayed promise  

| Param | Type |
| --- | --- |
| request | <code>\*</code> | 

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
<a name="IframeView+width"></a>

## iframeView.width() ⇒ <code>number</code>
width

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  
<a name="IframeView+height"></a>

## iframeView.height() ⇒ <code>number</code>
height

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

## iframeView.bounds(force) ⇒ <code>Element</code>
bounds

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  

| Param | Type |
| --- | --- |
| force | <code>\*</code> | 

<a name="IframeView+highlight"></a>

## iframeView.highlight(cfiRange, [data], cb, [className], [styles]) ⇒ <code>object</code>
highlight

**Kind**: instance method of [<code>IframeView</code>](#IframeView)  

| Param | Type | Default |
| --- | --- | --- |
| cfiRange | <code>\*</code> |  | 
| [data] | <code>\*</code> | <code>{}</code> | 
| cb | <code>\*</code> |  | 
| [className] | <code>\*</code> | <code>&#x27;epubjs-hl&#x27;</code> | 
| [styles] | <code>\*</code> | <code>{}</code> | 

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
