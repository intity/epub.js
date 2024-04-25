<a name="module_core"></a>

## core

* [core](#module_core)
    * [.RangeObject](#module_core.RangeObject)
    * [.requestAnimationFrame](#module_core.requestAnimationFrame) ⇒ <code>function</code>
    * [.uuid()](#module_core.uuid) ⇒ <code>string</code>
    * [.documentHeight()](#module_core.documentHeight) ⇒ <code>number</code>
    * [.isElement(obj)](#module_core.isElement) ⇒ <code>boolean</code>
    * [.isNumber(n)](#module_core.isNumber) ⇒ <code>boolean</code>
    * [.isFloat(n)](#module_core.isFloat) ⇒ <code>boolean</code>
    * [.prefixed(unprefixed)](#module_core.prefixed) ⇒ <code>string</code>
    * [.defaults(obj)](#module_core.defaults) ⇒ <code>object</code>
    * [.extend(target)](#module_core.extend) ⇒ <code>object</code>
    * [.insert(item, array, [compareFunction])](#module_core.insert) ⇒ <code>number</code>
    * [.locationOf(item, array, [compareFunction], [_start], [_end])](#module_core.locationOf) ⇒ <code>number</code>
    * [.indexOfSorted(item, array, [compareFunction], [_start], [_end])](#module_core.indexOfSorted) ⇒ <code>number</code>
    * [.bounds(el)](#module_core.bounds) ⇒ <code>Object</code>
    * [.borders(el)](#module_core.borders) ⇒ <code>Object</code>
    * [.nodeBounds(node)](#module_core.nodeBounds) ⇒ <code>BoundingClientRect</code>
    * [.windowBounds()](#module_core.windowBounds) ⇒ <code>Object</code>
    * [.indexOfNode(node, typeId)](#module_core.indexOfNode) ⇒ <code>number</code>
    * [.indexOfTextNode(textNode)](#module_core.indexOfTextNode) ⇒ <code>number</code>
    * [.indexOfElementNode(elementNode)](#module_core.indexOfElementNode) ⇒ <code>number</code>
    * [.isXml(ext)](#module_core.isXml) ⇒ <code>boolean</code>
    * [.createBlob(content, mime)](#module_core.createBlob) ⇒ <code>Blob</code>
    * [.createBlobUrl(content, mime)](#module_core.createBlobUrl) ⇒ <code>string</code>
    * [.revokeBlobUrl(url)](#module_core.revokeBlobUrl)
    * [.createBase64Url(content, mime)](#module_core.createBase64Url) ⇒ <code>string</code>
    * [.type(obj)](#module_core.type) ⇒ <code>string</code>
    * [.parse(markup, mime, forceXMLDom)](#module_core.parse) ⇒ <code>document</code>
    * [.qs(el, sel)](#module_core.qs) ⇒ <code>element</code>
    * [.qsa(el, sel)](#module_core.qsa) ⇒ <code>Array.&lt;element&gt;</code>
    * [.qsp(el, sel, props)](#module_core.qsp) ⇒ <code>Array.&lt;element&gt;</code>
    * [.blob2base64(blob)](#module_core.blob2base64) ⇒ <code>string</code>
    * [.defer()](#module_core.defer) ⇒ <code>object</code>
    * [.querySelectorByType(html, element, type)](#module_core.querySelectorByType) ⇒ <code>Array.&lt;element&gt;</code>
    * [.findChildren(el)](#module_core.findChildren) ⇒ <code>Array.&lt;element&gt;</code>
    * [.parents(node)](#module_core.parents) ⇒ <code>Array.&lt;element&gt;</code>
    * [.filterChildren(el, nodeName, [single])](#module_core.filterChildren) ⇒ <code>Array.&lt;element&gt;</code>
    * [.getParentByTagName(node, tagname)](#module_core.getParentByTagName) ⇒ <code>Array.&lt;element&gt;</code>

<a name="module_core.RangeObject"></a>

### core.RangeObject
Lightweight Polyfill for DOM Range

**Kind**: static class of [<code>core</code>](#module_core)  
<a name="module_core.requestAnimationFrame"></a>

### core.requestAnimationFrame ⇒ <code>function</code>
Vendor prefixed requestAnimationFrame

**Kind**: static constant of [<code>core</code>](#module_core)  
**Returns**: <code>function</code> - requestAnimationFrame  
<a name="module_core.uuid"></a>

### core.uuid() ⇒ <code>string</code>
Generates a UUID
based on: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript

**Kind**: static method of [<code>core</code>](#module_core)  
**Returns**: <code>string</code> - uuid  
<a name="module_core.documentHeight"></a>

### core.documentHeight() ⇒ <code>number</code>
Gets the height of a document

**Kind**: static method of [<code>core</code>](#module_core)  
**Returns**: <code>number</code> - height  
<a name="module_core.isElement"></a>

### core.isElement(obj) ⇒ <code>boolean</code>
Checks if a node is an element

**Kind**: static method of [<code>core</code>](#module_core)  

| Param | Type |
| --- | --- |
| obj | <code>object</code> | 

<a name="module_core.isNumber"></a>

### core.isNumber(n) ⇒ <code>boolean</code>
**Kind**: static method of [<code>core</code>](#module_core)  

| Param | Type |
| --- | --- |
| n | <code>any</code> | 

<a name="module_core.isFloat"></a>

### core.isFloat(n) ⇒ <code>boolean</code>
**Kind**: static method of [<code>core</code>](#module_core)  

| Param | Type |
| --- | --- |
| n | <code>any</code> | 

<a name="module_core.prefixed"></a>

### core.prefixed(unprefixed) ⇒ <code>string</code>
Get a prefixed css property

**Kind**: static method of [<code>core</code>](#module_core)  

| Param | Type |
| --- | --- |
| unprefixed | <code>string</code> | 

<a name="module_core.defaults"></a>

### core.defaults(obj) ⇒ <code>object</code>
Apply defaults to an object

**Kind**: static method of [<code>core</code>](#module_core)  

| Param | Type |
| --- | --- |
| obj | <code>object</code> | 

<a name="module_core.extend"></a>

### core.extend(target) ⇒ <code>object</code>
Extend properties of an object

**Kind**: static method of [<code>core</code>](#module_core)  

| Param | Type |
| --- | --- |
| target | <code>object</code> | 

<a name="module_core.insert"></a>

### core.insert(item, array, [compareFunction]) ⇒ <code>number</code>
Fast quicksort insert for sorted array -- based on:
 http://stackoverflow.com/questions/1344500/efficient-way-to-insert-a-number-into-a-sorted-array-of-numbers

**Kind**: static method of [<code>core</code>](#module_core)  
**Returns**: <code>number</code> - location (in array)  

| Param | Type |
| --- | --- |
| item | <code>any</code> | 
| array | <code>array</code> | 
| [compareFunction] | <code>function</code> | 

<a name="module_core.locationOf"></a>

### core.locationOf(item, array, [compareFunction], [_start], [_end]) ⇒ <code>number</code>
Finds where something would fit into a sorted array

**Kind**: static method of [<code>core</code>](#module_core)  
**Returns**: <code>number</code> - location (in array)  

| Param | Type |
| --- | --- |
| item | <code>any</code> | 
| array | <code>array</code> | 
| [compareFunction] | <code>function</code> | 
| [_start] | <code>function</code> | 
| [_end] | <code>function</code> | 

<a name="module_core.indexOfSorted"></a>

### core.indexOfSorted(item, array, [compareFunction], [_start], [_end]) ⇒ <code>number</code>
Finds index of something in a sorted array
Returns -1 if not found

**Kind**: static method of [<code>core</code>](#module_core)  
**Returns**: <code>number</code> - index (in array) or -1  

| Param | Type |
| --- | --- |
| item | <code>any</code> | 
| array | <code>array</code> | 
| [compareFunction] | <code>function</code> | 
| [_start] | <code>function</code> | 
| [_end] | <code>function</code> | 

<a name="module_core.bounds"></a>

### core.bounds(el) ⇒ <code>Object</code>
Find the bounds of an element
taking padding and margin into account

**Kind**: static method of [<code>core</code>](#module_core)  

| Param | Type |
| --- | --- |
| el | <code>element</code> | 

<a name="module_core.borders"></a>

### core.borders(el) ⇒ <code>Object</code>
Find the bounds of an element
taking padding, margin and borders into account

**Kind**: static method of [<code>core</code>](#module_core)  

| Param | Type |
| --- | --- |
| el | <code>element</code> | 

<a name="module_core.nodeBounds"></a>

### core.nodeBounds(node) ⇒ <code>BoundingClientRect</code>
Find the bounds of any node
allows for getting bounds of text nodes by wrapping them in a range

**Kind**: static method of [<code>core</code>](#module_core)  

| Param | Type |
| --- | --- |
| node | <code>node</code> | 

<a name="module_core.windowBounds"></a>

### core.windowBounds() ⇒ <code>Object</code>
Find the equivalent of getBoundingClientRect of a browser window

**Kind**: static method of [<code>core</code>](#module_core)  
<a name="module_core.indexOfNode"></a>

### core.indexOfNode(node, typeId) ⇒ <code>number</code>
Gets the index of a node in its parent

**Kind**: static method of [<code>core</code>](#module_core)  
**Returns**: <code>number</code> - index  

| Param | Type |
| --- | --- |
| node | <code>Node</code> | 
| typeId | <code>string</code> | 

<a name="module_core.indexOfTextNode"></a>

### core.indexOfTextNode(textNode) ⇒ <code>number</code>
Gets the index of a text node in its parent

**Kind**: static method of [<code>core</code>](#module_core)  
**Returns**: <code>number</code> - index  

| Param | Type |
| --- | --- |
| textNode | <code>node</code> | 

<a name="module_core.indexOfElementNode"></a>

### core.indexOfElementNode(elementNode) ⇒ <code>number</code>
Gets the index of an element node in its parent

**Kind**: static method of [<code>core</code>](#module_core)  
**Returns**: <code>number</code> - index  

| Param | Type |
| --- | --- |
| elementNode | <code>element</code> | 

<a name="module_core.isXml"></a>

### core.isXml(ext) ⇒ <code>boolean</code>
Check if extension is xml

**Kind**: static method of [<code>core</code>](#module_core)  

| Param | Type |
| --- | --- |
| ext | <code>string</code> | 

<a name="module_core.createBlob"></a>

### core.createBlob(content, mime) ⇒ <code>Blob</code>
Create a new blob

**Kind**: static method of [<code>core</code>](#module_core)  

| Param | Type |
| --- | --- |
| content | <code>any</code> | 
| mime | <code>string</code> | 

<a name="module_core.createBlobUrl"></a>

### core.createBlobUrl(content, mime) ⇒ <code>string</code>
Create a new blob url

**Kind**: static method of [<code>core</code>](#module_core)  
**Returns**: <code>string</code> - url  

| Param | Type |
| --- | --- |
| content | <code>any</code> | 
| mime | <code>string</code> | 

<a name="module_core.revokeBlobUrl"></a>

### core.revokeBlobUrl(url)
Remove a blob url

**Kind**: static method of [<code>core</code>](#module_core)  

| Param | Type |
| --- | --- |
| url | <code>string</code> | 

<a name="module_core.createBase64Url"></a>

### core.createBase64Url(content, mime) ⇒ <code>string</code>
Create a new base64 encoded url

**Kind**: static method of [<code>core</code>](#module_core)  
**Returns**: <code>string</code> - url  

| Param | Type |
| --- | --- |
| content | <code>any</code> | 
| mime | <code>string</code> | 

<a name="module_core.type"></a>

### core.type(obj) ⇒ <code>string</code>
Get type of an object

**Kind**: static method of [<code>core</code>](#module_core)  
**Returns**: <code>string</code> - type  

| Param | Type |
| --- | --- |
| obj | <code>object</code> | 

<a name="module_core.parse"></a>

### core.parse(markup, mime, forceXMLDom) ⇒ <code>document</code>
Parse xml (or html) markup

**Kind**: static method of [<code>core</code>](#module_core)  
**Returns**: <code>document</code> - document  

| Param | Type | Description |
| --- | --- | --- |
| markup | <code>string</code> |  |
| mime | <code>string</code> |  |
| forceXMLDom | <code>boolean</code> | force using xmlDom to parse instead of native parser |

<a name="module_core.qs"></a>

### core.qs(el, sel) ⇒ <code>element</code>
querySelector polyfill

**Kind**: static method of [<code>core</code>](#module_core)  
**Returns**: <code>element</code> - element  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>element</code> |  |
| sel | <code>string</code> | selector string |

<a name="module_core.qsa"></a>

### core.qsa(el, sel) ⇒ <code>Array.&lt;element&gt;</code>
querySelectorAll polyfill

**Kind**: static method of [<code>core</code>](#module_core)  
**Returns**: <code>Array.&lt;element&gt;</code> - elements  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>element</code> |  |
| sel | <code>string</code> | selector string |

<a name="module_core.qsp"></a>

### core.qsp(el, sel, props) ⇒ <code>Array.&lt;element&gt;</code>
querySelector by property

**Kind**: static method of [<code>core</code>](#module_core)  
**Returns**: <code>Array.&lt;element&gt;</code> - elements  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>element</code> |  |
| sel | <code>string</code> | selector string |
| props | <code>Array.&lt;object&gt;</code> |  |

<a name="module_core.blob2base64"></a>

### core.blob2base64(blob) ⇒ <code>string</code>
Convert a blob to a base64 encoded string

**Kind**: static method of [<code>core</code>](#module_core)  

| Param | Type |
| --- | --- |
| blob | <code>Blog</code> | 

<a name="module_core.defer"></a>

### core.defer() ⇒ <code>object</code>
Creates a new pending promise and provides methods to resolve or reject it.
From: https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Deferred#backwards_forwards_compatible

**Kind**: static method of [<code>core</code>](#module_core)  
<a name="module_core.querySelectorByType"></a>

### core.querySelectorByType(html, element, type) ⇒ <code>Array.&lt;element&gt;</code>
querySelector with filter by epub type

**Kind**: static method of [<code>core</code>](#module_core)  
**Returns**: <code>Array.&lt;element&gt;</code> - elements  

| Param | Type | Description |
| --- | --- | --- |
| html | <code>element</code> |  |
| element | <code>string</code> | element type to find |
| type | <code>string</code> | epub type to find |

<a name="module_core.findChildren"></a>

### core.findChildren(el) ⇒ <code>Array.&lt;element&gt;</code>
Find direct descendents of an element

**Kind**: static method of [<code>core</code>](#module_core)  
**Returns**: <code>Array.&lt;element&gt;</code> - children  

| Param | Type |
| --- | --- |
| el | <code>element</code> | 

<a name="module_core.parents"></a>

### core.parents(node) ⇒ <code>Array.&lt;element&gt;</code>
Find all parents (ancestors) of an element

**Kind**: static method of [<code>core</code>](#module_core)  
**Returns**: <code>Array.&lt;element&gt;</code> - parents  

| Param | Type |
| --- | --- |
| node | <code>element</code> | 

<a name="module_core.filterChildren"></a>

### core.filterChildren(el, nodeName, [single]) ⇒ <code>Array.&lt;element&gt;</code>
Find all direct descendents of a specific type

**Kind**: static method of [<code>core</code>](#module_core)  
**Returns**: <code>Array.&lt;element&gt;</code> - children  

| Param | Type |
| --- | --- |
| el | <code>element</code> | 
| nodeName | <code>string</code> | 
| [single] | <code>boolean</code> | 

<a name="module_core.getParentByTagName"></a>

### core.getParentByTagName(node, tagname) ⇒ <code>Array.&lt;element&gt;</code>
Filter all parents (ancestors) with tag name

**Kind**: static method of [<code>core</code>](#module_core)  
**Returns**: <code>Array.&lt;element&gt;</code> - parents  

| Param | Type |
| --- | --- |
| node | <code>element</code> | 
| tagname | <code>string</code> | 

