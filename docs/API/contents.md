<a name="Contents"></a>

# Contents
Handles DOM manipulation, queries and events for View contents

**Kind**: global class  

* [Contents](#Contents)
    * [new Contents(doc, content, section)](#new_Contents_new)
    * _instance_
        * [.width([w])](#Contents+width) ⇒ <code>number</code>
        * [.height([h])](#Contents+height) ⇒ <code>number</code>
        * [.contentWidth([w])](#Contents+contentWidth) ⇒ <code>number</code>
        * [.contentHeight([h])](#Contents+contentHeight) ⇒ <code>number</code>
        * [.textSize()](#Contents+textSize) ⇒ <code>Object</code>
        * [.scrollWidth()](#Contents+scrollWidth) ⇒ <code>number</code>
        * [.scrollHeight()](#Contents+scrollHeight) ⇒ <code>number</code>
        * [.overflow([overflow])](#Contents+overflow)
        * [.overflowX([overflow])](#Contents+overflowX)
        * [.overflowY([overflow])](#Contents+overflowY)
        * [.css(property, value, [priority])](#Contents+css)
        * [.viewport([options])](#Contents+viewport)
        * [.root()](#Contents+root) ⇒ <code>element</code>
        * [.locationOf(target, [ignoreClass])](#Contents+locationOf) ⇒ <code>object</code>
        * [.appendStylesheet(src, key)](#Contents+appendStylesheet) ⇒ <code>Promise</code>
        * [.removeStylesheet(key)](#Contents+removeStylesheet) ⇒ <code>boolean</code>
        * [.clearStylesheets()](#Contents+clearStylesheets)
        * [.appendSerializedCSS(css, key)](#Contents+appendSerializedCSS)
        * [.appendStylesheetRules(rules, key)](#Contents+appendStylesheetRules)
        * [.appendScript(src, key)](#Contents+appendScript) ⇒ <code>Promise</code>
        * [.removeScript(key)](#Contents+removeScript) ⇒ <code>boolean</code>
        * [.clearScripts()](#Contents+clearScripts)
        * [.appendClass(className)](#Contents+appendClass)
        * [.removeClass(className)](#Contents+removeClass)
        * [.range(cfi, [ignoreClass])](#Contents+range) ⇒ <code>Range</code>
        * [.cfiFromRange(range, [ignoreClass])](#Contents+cfiFromRange) ⇒ <code>EpubCFI</code>
        * [.cfiFromNode(node, [ignoreClass])](#Contents+cfiFromNode) ⇒ <code>EpubCFI</code>
        * [.map(layout)](#Contents+map) ⇒ <code>Array</code>
        * [.size([width], [height], [dir])](#Contents+size)
        * [.columns(width, height, columnWidth, gap, dir)](#Contents+columns)
        * [.scaler(scale, offsetX, offsetY)](#Contents+scaler)
        * [.fit(width, height)](#Contents+fit)
        * [.direction([dir])](#Contents+direction)
        * [.mapPage(cfiBase, layout, start, end, dev)](#Contents+mapPage) ⇒ <code>any</code>
        * [.writingMode([mode])](#Contents+writingMode)
        * [.destroy()](#Contents+destroy)
    * _static_
        * [.epubcfi](#Contents.epubcfi) : <code>EpubCFI</code>
        * [.content](#Contents.content) : <code>object</code>
        * [.contentRect](#Contents.contentRect) : <code>object</code>
        * [.section](#Contents.section) : <code>Section</code>
        * [.listenedEvents](#Contents.listenedEvents)

<a name="new_Contents_new"></a>

## new Contents(doc, content, section)
Constructor


| Param | Type | Description |
| --- | --- | --- |
| doc | <code>document</code> | Document |
| content | <code>element</code> | Parent Element (typically Body) |
| section | <code>Section</code> | Section object reference |

<a name="Contents+width"></a>

## contents.width([w]) ⇒ <code>number</code>
Get or Set width

**Kind**: instance method of [<code>Contents</code>](#Contents)  
**Returns**: <code>number</code> - width  

| Param | Type |
| --- | --- |
| [w] | <code>number</code> | 

<a name="Contents+height"></a>

## contents.height([h]) ⇒ <code>number</code>
Get or Set height

**Kind**: instance method of [<code>Contents</code>](#Contents)  
**Returns**: <code>number</code> - height  

| Param | Type |
| --- | --- |
| [h] | <code>number</code> | 

<a name="Contents+contentWidth"></a>

## contents.contentWidth([w]) ⇒ <code>number</code>
Get or Set width of the contents

**Kind**: instance method of [<code>Contents</code>](#Contents)  
**Returns**: <code>number</code> - width  

| Param | Type |
| --- | --- |
| [w] | <code>number</code> | 

<a name="Contents+contentHeight"></a>

## contents.contentHeight([h]) ⇒ <code>number</code>
Get or Set height of the contents

**Kind**: instance method of [<code>Contents</code>](#Contents)  
**Returns**: <code>number</code> - height  

| Param | Type |
| --- | --- |
| [h] | <code>number</code> | 

<a name="Contents+textSize"></a>

## contents.textSize() ⇒ <code>Object</code>
Get size of the text using Range

**Kind**: instance method of [<code>Contents</code>](#Contents)  
<a name="Contents+scrollWidth"></a>

## contents.scrollWidth() ⇒ <code>number</code>
Get documentElement scrollWidth

**Kind**: instance method of [<code>Contents</code>](#Contents)  
**Returns**: <code>number</code> - width  
<a name="Contents+scrollHeight"></a>

## contents.scrollHeight() ⇒ <code>number</code>
Get documentElement scrollHeight

**Kind**: instance method of [<code>Contents</code>](#Contents)  
**Returns**: <code>number</code> - height  
<a name="Contents+overflow"></a>

## contents.overflow([overflow])
Set overflow css style of the contents

**Kind**: instance method of [<code>Contents</code>](#Contents)  

| Param | Type |
| --- | --- |
| [overflow] | <code>string</code> | 

<a name="Contents+overflowX"></a>

## contents.overflowX([overflow])
Set overflowX css style of the documentElement

**Kind**: instance method of [<code>Contents</code>](#Contents)  

| Param | Type |
| --- | --- |
| [overflow] | <code>string</code> | 

<a name="Contents+overflowY"></a>

## contents.overflowY([overflow])
Set overflowY css style of the documentElement

**Kind**: instance method of [<code>Contents</code>](#Contents)  

| Param | Type |
| --- | --- |
| [overflow] | <code>string</code> | 

<a name="Contents+css"></a>

## contents.css(property, value, [priority])
Set Css styles on the contents element (typically Body)

**Kind**: instance method of [<code>Contents</code>](#Contents)  

| Param | Type | Description |
| --- | --- | --- |
| property | <code>string</code> |  |
| value | <code>string</code> |  |
| [priority] | <code>boolean</code> | set as "important" |

<a name="Contents+viewport"></a>

## contents.viewport([options])
Get or Set the viewport element

**Kind**: instance method of [<code>Contents</code>](#Contents)  

| Param | Type |
| --- | --- |
| [options] | <code>object</code> | 
| [options.width] | <code>string</code> | 
| [options.height] | <code>string</code> | 
| [options.scale] | <code>string</code> | 
| [options.minimum] | <code>string</code> | 
| [options.maximum] | <code>string</code> | 
| [options.scalable] | <code>string</code> | 

<a name="Contents+root"></a>

## contents.root() ⇒ <code>element</code>
Get the documentElement

**Kind**: instance method of [<code>Contents</code>](#Contents)  
**Returns**: <code>element</code> - documentElement  
<a name="Contents+locationOf"></a>

## contents.locationOf(target, [ignoreClass]) ⇒ <code>object</code>
Get the location offset of a EpubCFI or an #id

**Kind**: instance method of [<code>Contents</code>](#Contents)  
**Returns**: <code>object</code> - target position left and top  

| Param | Type | Description |
| --- | --- | --- |
| target | <code>string</code> \| <code>EpubCFI</code> |  |
| [ignoreClass] | <code>string</code> | for the cfi |

<a name="Contents+appendStylesheet"></a>

## contents.appendStylesheet(src, key) ⇒ <code>Promise</code>
Append a stylesheet link to the document head

**Kind**: instance method of [<code>Contents</code>](#Contents)  

| Param | Type | Description |
| --- | --- | --- |
| src | <code>string</code> | url |
| key | <code>string</code> |  |

**Example**  
```js
appendStylesheet("/pach/to/stylesheet.css", "common")
```
**Example**  
```js
appendStylesheet("https://example.com/to/stylesheet.css", "common")
```
<a name="Contents+removeStylesheet"></a>

## contents.removeStylesheet(key) ⇒ <code>boolean</code>
Remove a stylesheet link from the document head

**Kind**: instance method of [<code>Contents</code>](#Contents)  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 

<a name="Contents+clearStylesheets"></a>

## contents.clearStylesheets()
Clear all injected stylesheets

**Kind**: instance method of [<code>Contents</code>](#Contents)  
<a name="Contents+appendSerializedCSS"></a>

## contents.appendSerializedCSS(css, key)
If the key is the same, the CSS will be replaced instead of inserted

**Kind**: instance method of [<code>Contents</code>](#Contents)  

| Param | Type |
| --- | --- |
| css | <code>string</code> | 
| key | <code>string</code> | 

**Example**  
```js
appendSerializedCSS("h1 { font-size: 32px; color: magenta; }", "common")
```
<a name="Contents+appendStylesheetRules"></a>

## contents.appendStylesheetRules(rules, key)
If the key is the same, the CSS will be replaced instead of inserted

**Kind**: instance method of [<code>Contents</code>](#Contents)  
**Link**: https://github.com/desirable-objects/json-to-css  

| Param | Type |
| --- | --- |
| rules | <code>object</code> | 
| key | <code>string</code> | 

**Example**  
```js
appendStylesheetRules({ h1: { "font-size": "1.5em" }}, "common")
```
<a name="Contents+appendScript"></a>

## contents.appendScript(src, key) ⇒ <code>Promise</code>
Append a script node to the document head

**Kind**: instance method of [<code>Contents</code>](#Contents)  
**Returns**: <code>Promise</code> - loaded  

| Param | Type | Description |
| --- | --- | --- |
| src | <code>string</code> | url |
| key | <code>string</code> |  |

**Example**  
```js
appendScript("/path/to/script.js", "common")
```
**Example**  
```js
appendScript("https://examples.com/to/script.js", "common")
```
<a name="Contents+removeScript"></a>

## contents.removeScript(key) ⇒ <code>boolean</code>
Remove a script node from the document head

**Kind**: instance method of [<code>Contents</code>](#Contents)  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 

<a name="Contents+clearScripts"></a>

## contents.clearScripts()
Clear all injected scripts

**Kind**: instance method of [<code>Contents</code>](#Contents)  
<a name="Contents+appendClass"></a>

## contents.appendClass(className)
Append a class to the contents container

**Kind**: instance method of [<code>Contents</code>](#Contents)  

| Param | Type |
| --- | --- |
| className | <code>string</code> | 

<a name="Contents+removeClass"></a>

## contents.removeClass(className)
Remove a class from the contents container

**Kind**: instance method of [<code>Contents</code>](#Contents)  

| Param | Type |
| --- | --- |
| className | <code>string</code> | 

<a name="Contents+range"></a>

## contents.range(cfi, [ignoreClass]) ⇒ <code>Range</code>
Get a Dom Range from EpubCFI

**Kind**: instance method of [<code>Contents</code>](#Contents)  
**Returns**: <code>Range</code> - range  

| Param | Type |
| --- | --- |
| cfi | <code>EpubCFI</code> | 
| [ignoreClass] | <code>string</code> | 

<a name="Contents+cfiFromRange"></a>

## contents.cfiFromRange(range, [ignoreClass]) ⇒ <code>EpubCFI</code>
Get an EpubCFI from a Dom Range

**Kind**: instance method of [<code>Contents</code>](#Contents)  
**Returns**: <code>EpubCFI</code> - cfi  

| Param | Type |
| --- | --- |
| range | <code>Range</code> | 
| [ignoreClass] | <code>string</code> | 

<a name="Contents+cfiFromNode"></a>

## contents.cfiFromNode(node, [ignoreClass]) ⇒ <code>EpubCFI</code>
Get an EpubCFI from a Dom node

**Kind**: instance method of [<code>Contents</code>](#Contents)  
**Returns**: <code>EpubCFI</code> - cfi  

| Param | Type |
| --- | --- |
| node | <code>Node</code> | 
| [ignoreClass] | <code>string</code> | 

<a name="Contents+map"></a>

## contents.map(layout) ⇒ <code>Array</code>
map

**Kind**: instance method of [<code>Contents</code>](#Contents)  
**Todo**

- [ ] TODO: find where this is used - remove?


| Param | Type |
| --- | --- |
| layout | <code>Layout</code> | 

<a name="Contents+size"></a>

## contents.size([width], [height], [dir])
Size the contents to a given width and height

**Kind**: instance method of [<code>Contents</code>](#Contents)  

| Param | Type |
| --- | --- |
| [width] | <code>number</code> | 
| [height] | <code>number</code> | 
| [dir] | <code>string</code> | 

<a name="Contents+columns"></a>

## contents.columns(width, height, columnWidth, gap, dir)
Apply columns to the contents for pagination

**Kind**: instance method of [<code>Contents</code>](#Contents)  

| Param | Type |
| --- | --- |
| width | <code>number</code> | 
| height | <code>number</code> | 
| columnWidth | <code>number</code> | 
| gap | <code>number</code> | 
| dir | <code>string</code> | 

<a name="Contents+scaler"></a>

## contents.scaler(scale, offsetX, offsetY)
Scale contents from center

**Kind**: instance method of [<code>Contents</code>](#Contents)  

| Param | Type |
| --- | --- |
| scale | <code>number</code> | 
| offsetX | <code>number</code> | 
| offsetY | <code>number</code> | 

<a name="Contents+fit"></a>

## contents.fit(width, height)
Fit contents into a fixed width and height

**Kind**: instance method of [<code>Contents</code>](#Contents)  

| Param | Type |
| --- | --- |
| width | <code>number</code> | 
| height | <code>number</code> | 

<a name="Contents+direction"></a>

## contents.direction([dir])
Set the direction of the text

**Kind**: instance method of [<code>Contents</code>](#Contents)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [dir] | <code>string</code> | <code>&quot;&#x27;ltr&#x27;&quot;</code> | values: `"ltr"` OR `"rtl"` |

<a name="Contents+mapPage"></a>

## contents.mapPage(cfiBase, layout, start, end, dev) ⇒ <code>any</code>
mapPage

**Kind**: instance method of [<code>Contents</code>](#Contents)  

| Param | Type |
| --- | --- |
| cfiBase | <code>string</code> | 
| layout | <code>Layout</code> | 
| start | <code>number</code> | 
| end | <code>number</code> | 
| dev | <code>boolean</code> | 

<a name="Contents+writingMode"></a>

## contents.writingMode([mode])
Set the writingMode of the text

**Kind**: instance method of [<code>Contents</code>](#Contents)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [mode] | <code>string</code> | <code>&quot;&#x27;horizontal-tb&#x27;&quot;</code> | `"horizontal-tb"` OR `"vertical-rl"` OR `"vertical-lr"` |

<a name="Contents+destroy"></a>

## contents.destroy()
destroy

**Kind**: instance method of [<code>Contents</code>](#Contents)  
<a name="Contents.epubcfi"></a>

## Contents.epubcfi : <code>EpubCFI</code>
Blank Cfi for Parsing

**Kind**: static property of [<code>Contents</code>](#Contents)  
**Read only**: true  
<a name="Contents.content"></a>

## Contents.content : <code>object</code>
document.body by current location

**Kind**: static property of [<code>Contents</code>](#Contents)  
**Read only**: true  
<a name="Contents.contentRect"></a>

## Contents.contentRect : <code>object</code>
**Kind**: static property of [<code>Contents</code>](#Contents)  
**Read only**: true  
<a name="Contents.section"></a>

## Contents.section : <code>Section</code>
**Kind**: static property of [<code>Contents</code>](#Contents)  
**Read only**: true  
<a name="Contents.listenedEvents"></a>

## Contents.listenedEvents
Get DOM events that are listened for and passed along

**Kind**: static property of [<code>Contents</code>](#Contents)  
