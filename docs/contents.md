<a name="Contents"></a>

# Contents
Handles DOM manipulation, queries and events for View contents

**Kind**: global class  

* [Contents](#Contents)
    * [new Contents(doc, content, cfiBase, sectionIndex)](#new_Contents_new)
    * _instance_
        * [.width([w])](#Contents+width) ⇒ <code>number</code>
        * [.height([h])](#Contents+height) ⇒ <code>number</code>
        * [.contentWidth([w])](#Contents+contentWidth) ⇒ <code>number</code>
        * [.contentHeight([h])](#Contents+contentHeight) ⇒ <code>number</code>
        * [.textWidth()](#Contents+textWidth) ⇒ <code>number</code>
        * [.textHeight()](#Contents+textHeight) ⇒ <code>number</code>
        * [.scrollWidth()](#Contents+scrollWidth) ⇒ <code>number</code>
        * [.scrollHeight()](#Contents+scrollHeight) ⇒ <code>number</code>
        * [.overflow([overflow])](#Contents+overflow)
        * [.overflowX([overflow])](#Contents+overflowX)
        * [.overflowY([overflow])](#Contents+overflowY)
        * [.css(property, value, [priority])](#Contents+css)
        * [.viewport([options])](#Contents+viewport)
        * [.root()](#Contents+root) ⇒ <code>element</code>
        * [.locationOf(target, [ignoreClass])](#Contents+locationOf) ⇒ <code>object</code>
        * [.addStylesheet(src)](#Contents+addStylesheet)
        * [.addStylesheetCss(serializedCss, key)](#Contents+addStylesheetCss)
        * [.addStylesheetRules(rules, key)](#Contents+addStylesheetRules)
        * [.addScript(src)](#Contents+addScript) ⇒ <code>Promise</code>
        * [.addClass(className)](#Contents+addClass)
        * [.removeClass(removeClass)](#Contents+removeClass)
        * [.range(_cfi, [ignoreClass])](#Contents+range) ⇒ <code>Range</code>
        * [.cfiFromRange(range, [ignoreClass])](#Contents+cfiFromRange) ⇒ <code>EpubCFI</code>
        * [.cfiFromNode(node, [ignoreClass])](#Contents+cfiFromNode) ⇒ <code>EpubCFI</code>
        * [.size([width], [height])](#Contents+size)
        * [.columns(width, height, columnWidth, gap)](#Contents+columns)
        * [.scaler(scale, offsetX, offsetY)](#Contents+scaler)
        * [.fit(width, height)](#Contents+fit)
        * [.direction([dir])](#Contents+direction)
        * [.writingMode([mode])](#Contents+writingMode)
    * _static_
        * [.listenedEvents](#Contents.listenedEvents)

<a name="new_Contents_new"></a>

## new Contents(doc, content, cfiBase, sectionIndex)

| Param | Type | Description |
| --- | --- | --- |
| doc | <code>document</code> | Document |
| content | <code>element</code> | Parent Element (typically Body) |
| cfiBase | <code>string</code> | Section component of CFIs |
| sectionIndex | <code>number</code> | Index in Spine of Conntent's Section |

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

<a name="Contents+textWidth"></a>

## contents.textWidth() ⇒ <code>number</code>
Get the width of the text using Range

**Kind**: instance method of [<code>Contents</code>](#Contents)  
**Returns**: <code>number</code> - width  
<a name="Contents+textHeight"></a>

## contents.textHeight() ⇒ <code>number</code>
Get the height of the text using Range

**Kind**: instance method of [<code>Contents</code>](#Contents)  
**Returns**: <code>number</code> - height  
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

<a name="Contents+addStylesheet"></a>

## contents.addStylesheet(src)
Append a stylesheet link to the document head

**Kind**: instance method of [<code>Contents</code>](#Contents)  

| Param | Type | Description |
| --- | --- | --- |
| src | <code>string</code> | url |

<a name="Contents+addStylesheetCss"></a>

## contents.addStylesheetCss(serializedCss, key)
Append stylesheet css

**Kind**: instance method of [<code>Contents</code>](#Contents)  

| Param | Type | Description |
| --- | --- | --- |
| serializedCss | <code>string</code> |  |
| key | <code>string</code> | If the key is the same, the CSS will be replaced instead of inserted |

<a name="Contents+addStylesheetRules"></a>

## contents.addStylesheetRules(rules, key)
Append stylesheet rules to a generate stylesheet
Array: https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/insertRule
Object: https://github.com/desirable-objects/json-to-css

**Kind**: instance method of [<code>Contents</code>](#Contents)  

| Param | Type | Description |
| --- | --- | --- |
| rules | <code>array</code> \| <code>object</code> |  |
| key | <code>string</code> | If the key is the same, the CSS will be replaced instead of inserted |

<a name="Contents+addScript"></a>

## contents.addScript(src) ⇒ <code>Promise</code>
Append a script tag to the document head

**Kind**: instance method of [<code>Contents</code>](#Contents)  
**Returns**: <code>Promise</code> - loaded  

| Param | Type | Description |
| --- | --- | --- |
| src | <code>string</code> | url |

<a name="Contents+addClass"></a>

## contents.addClass(className)
Add a class to the contents container

**Kind**: instance method of [<code>Contents</code>](#Contents)  

| Param | Type |
| --- | --- |
| className | <code>string</code> | 

<a name="Contents+removeClass"></a>

## contents.removeClass(removeClass)
Remove a class from the contents container

**Kind**: instance method of [<code>Contents</code>](#Contents)  

| Param | Type |
| --- | --- |
| removeClass | <code>string</code> | 

<a name="Contents+range"></a>

## contents.range(_cfi, [ignoreClass]) ⇒ <code>Range</code>
Get a Dom Range from EpubCFI

**Kind**: instance method of [<code>Contents</code>](#Contents)  
**Returns**: <code>Range</code> - range  

| Param | Type |
| --- | --- |
| _cfi | <code>EpubCFI</code> | 
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
| node | <code>node</code> | 
| [ignoreClass] | <code>string</code> | 

<a name="Contents+size"></a>

## contents.size([width], [height])
Size the contents to a given width and height

**Kind**: instance method of [<code>Contents</code>](#Contents)  

| Param | Type |
| --- | --- |
| [width] | <code>number</code> | 
| [height] | <code>number</code> | 

<a name="Contents+columns"></a>

## contents.columns(width, height, columnWidth, gap)
Apply columns to the contents for pagination

**Kind**: instance method of [<code>Contents</code>](#Contents)  

| Param | Type |
| --- | --- |
| width | <code>number</code> | 
| height | <code>number</code> | 
| columnWidth | <code>number</code> | 
| gap | <code>number</code> | 

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
| [dir] | <code>string</code> | <code>&quot;\&quot;ltr\&quot;&quot;</code> | "rtl" | "ltr" |

<a name="Contents+writingMode"></a>

## contents.writingMode([mode])
Set the writingMode of the text

**Kind**: instance method of [<code>Contents</code>](#Contents)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [mode] | <code>string</code> | <code>&quot;\&quot;horizontal-tb\&quot;&quot;</code> | "horizontal-tb" | "vertical-rl" | "vertical-lr" |

<a name="Contents.listenedEvents"></a>

## Contents.listenedEvents
Get DOM events that are listened for and passed along

**Kind**: static property of [<code>Contents</code>](#Contents)  
