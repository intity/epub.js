<a name="module_core"></a>

# core

* [core](#module_core)
    * [.requestAnimationFrame](#module_core.requestAnimationFrame) ⇒ <code>function</code>
    * [.uuid](#module_core.uuid) ⇒ <code>string</code>
    * [.documentHeight](#module_core.documentHeight) ⇒ <code>number</code>
    * [.isElement](#module_core.isElement) ⇒ <code>boolean</code>
    * [.isNumber](#module_core.isNumber) ⇒ <code>boolean</code>
    * [.isFloat](#module_core.isFloat) ⇒ <code>boolean</code>
    * [.prefixed](#module_core.prefixed) ⇒ <code>string</code>
    * [.defaults](#module_core.defaults) ⇒ <code>object</code>
    * [.extend](#module_core.extend) ⇒ <code>object</code>
    * [.locationOf](#module_core.locationOf) ⇒ <code>number</code>
    * [.insert](#module_core.insert) ⇒ <code>number</code>
    * [.indexOfSorted](#module_core.indexOfSorted) ⇒ <code>number</code>
    * [.bounds](#module_core.bounds) ⇒ <code>Object</code>
    * [.borders](#module_core.borders) ⇒ <code>Object</code>
    * [.nodeBounds](#module_core.nodeBounds) ⇒ <code>DOMRect</code>
    * [.windowBounds](#module_core.windowBounds) ⇒ <code>Object</code>
    * [.indexOfNode](#module_core.indexOfNode) ⇒ <code>number</code>
    * [.indexOfTextNode](#module_core.indexOfTextNode) ⇒ <code>number</code>
    * [.indexOfElementNode](#module_core.indexOfElementNode) ⇒ <code>number</code>
    * [.isXml](#module_core.isXml) ⇒ <code>boolean</code>
    * [.createBlob](#module_core.createBlob) ⇒ <code>Blob</code>
    * [.createBlobUrl](#module_core.createBlobUrl) ⇒ <code>string</code>
    * [.revokeBlobUrl](#module_core.revokeBlobUrl)
    * [.createBase64Url](#module_core.createBase64Url) ⇒ <code>string</code>
    * [.type](#module_core.type) ⇒ <code>string</code>
    * [.parse](#module_core.parse) ⇒ <code>Document</code>
    * [.qs](#module_core.qs) ⇒ <code>Element</code>
    * [.qsa](#module_core.qsa) ⇒ <code>Array.&lt;Element&gt;</code>
    * [.qsp](#module_core.qsp) ⇒ <code>Array.&lt;Element&gt;</code>
    * [.sprint](#module_core.sprint)
    * [.treeWalker](#module_core.treeWalker)
    * [.walk](#module_core.walk) ⇒ <code>boolean</code>
    * [.blob2base64](#module_core.blob2base64) ⇒ <code>Promise</code>
    * [.querySelectorByType](#module_core.querySelectorByType) ⇒ <code>Array.&lt;Element&gt;</code>
    * [.findChildren](#module_core.findChildren) ⇒ <code>Array.&lt;Element&gt;</code>
    * [.parents](#module_core.parents) ⇒ <code>Array.&lt;Node&gt;</code>
    * [.filterChildren](#module_core.filterChildren) ⇒ <code>Array.&lt;Element&gt;</code>
    * [.getParentByTagName](#module_core.getParentByTagName) ⇒ <code>Array.&lt;Node&gt;</code>

<a name="module_core.requestAnimationFrame"></a>

## core.requestAnimationFrame ⇒ <code>function</code>
Vendor prefixed requestAnimationFrame

**Kind**: static constant of [<code>core</code>](#module_core)  
**Returns**: <code>function</code> - requestAnimationFrame  
<a name="module_core.uuid"></a>

## core.uuid ⇒ <code>string</code>
Generates a UUID

**Kind**: static constant of [<code>core</code>](#module_core)  
**Returns**: <code>string</code> - uuid  
**Link**: https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid  
<a name="module_core.documentHeight"></a>

## core.documentHeight ⇒ <code>number</code>
Gets the height of a document

**Kind**: static constant of [<code>core</code>](#module_core)  
**Returns**: <code>number</code> - height  
<a name="module_core.isElement"></a>

## core.isElement ⇒ <code>boolean</code>
Checks if a node is an element

**Kind**: static constant of [<code>core</code>](#module_core)  

| Param | Type |
| --- | --- |
| obj | <code>object</code> | 

<a name="module_core.isNumber"></a>

## core.isNumber ⇒ <code>boolean</code>
isNumber

**Kind**: static constant of [<code>core</code>](#module_core)  

| Param | Type |
| --- | --- |
| n | <code>any</code> | 

<a name="module_core.isFloat"></a>

## core.isFloat ⇒ <code>boolean</code>
isFloat

**Kind**: static constant of [<code>core</code>](#module_core)  

| Param | Type |
| --- | --- |
| n | <code>any</code> | 

<a name="module_core.prefixed"></a>

## core.prefixed ⇒ <code>string</code>
Get a prefixed css property

**Kind**: static constant of [<code>core</code>](#module_core)  

| Param | Type |
| --- | --- |
| unprefixed | <code>string</code> | 

<a name="module_core.defaults"></a>

## core.defaults ⇒ <code>object</code>
Apply defaults to an object

**Kind**: static constant of [<code>core</code>](#module_core)  

| Param | Type |
| --- | --- |
| obj | <code>object</code> | 

<a name="module_core.extend"></a>

## core.extend ⇒ <code>object</code>
Extend properties of an object

**Kind**: static constant of [<code>core</code>](#module_core)  

| Param | Type |
| --- | --- |
| target | <code>object</code> | 

<a name="module_core.locationOf"></a>

## core.locationOf ⇒ <code>number</code>
Finds where something would fit into a sorted array

**Kind**: static constant of [<code>core</code>](#module_core)  
**Returns**: <code>number</code> - location (in array)  

| Param | Type |
| --- | --- |
| item | <code>any</code> | 
| array | <code>array</code> | 
| [compareFunction] | <code>function</code> | 
| [start] | <code>function</code> | 
| [end] | <code>function</code> | 

<a name="module_core.insert"></a>

## core.insert ⇒ <code>number</code>
Fast quicksort insert for sorted array -- based on:

**Kind**: static constant of [<code>core</code>](#module_core)  
**Returns**: <code>number</code> - location (in array)  
**Link**: https://stackoverflow.com/questions/1344500/efficient-way-to-insert-a-number-into-a-sorted-array-of-numbers  

| Param | Type |
| --- | --- |
| item | <code>any</code> | 
| array | <code>array</code> | 
| [compareFunction] | <code>function</code> | 

<a name="module_core.indexOfSorted"></a>

## core.indexOfSorted ⇒ <code>number</code>
Finds index of something in a sorted array
Returns -1 if not found

**Kind**: static constant of [<code>core</code>](#module_core)  
**Returns**: <code>number</code> - index (in array) or -1  

| Param | Type |
| --- | --- |
| item | <code>any</code> | 
| array | <code>array</code> | 
| [compareFunction] | <code>function</code> | 
| [start] | <code>function</code> | 
| [end] | <code>function</code> | 

<a name="module_core.bounds"></a>

## core.bounds ⇒ <code>Object</code>
Find the bounds of an element
taking padding and margin into account

**Kind**: static constant of [<code>core</code>](#module_core)  

| Param | Type |
| --- | --- |
| el | <code>Element</code> | 

<a name="module_core.borders"></a>

## core.borders ⇒ <code>Object</code>
Find the bounds of an element
taking padding, margin and borders into account

**Kind**: static constant of [<code>core</code>](#module_core)  

| Param | Type |
| --- | --- |
| el | <code>Element</code> | 

<a name="module_core.nodeBounds"></a>

## core.nodeBounds ⇒ <code>DOMRect</code>
Find the bounds of any node
allows for getting bounds of text nodes by wrapping them in a range

**Kind**: static constant of [<code>core</code>](#module_core)  

| Param | Type |
| --- | --- |
| node | <code>Node</code> | 

<a name="module_core.windowBounds"></a>

## core.windowBounds ⇒ <code>Object</code>
Find the equivalent of getBoundingClientRect of a browser window

**Kind**: static constant of [<code>core</code>](#module_core)  
<a name="module_core.indexOfNode"></a>

## core.indexOfNode ⇒ <code>number</code>
Gets the index of a node in its parent

**Kind**: static constant of [<code>core</code>](#module_core)  
**Returns**: <code>number</code> - index  

| Param | Type |
| --- | --- |
| node | <code>Node</code> | 
| typeId | <code>string</code> | 

<a name="module_core.indexOfTextNode"></a>

## core.indexOfTextNode ⇒ <code>number</code>
Gets the index of a text node in its parent

**Kind**: static constant of [<code>core</code>](#module_core)  
**Returns**: <code>number</code> - index  

| Param | Type |
| --- | --- |
| textNode | <code>Node</code> | 

<a name="module_core.indexOfElementNode"></a>

## core.indexOfElementNode ⇒ <code>number</code>
Gets the index of an element node in its parent

**Kind**: static constant of [<code>core</code>](#module_core)  
**Returns**: <code>number</code> - index  

| Param | Type |
| --- | --- |
| elementNode | <code>Element</code> | 

<a name="module_core.isXml"></a>

## core.isXml ⇒ <code>boolean</code>
Check if extension is xml

**Kind**: static constant of [<code>core</code>](#module_core)  

| Param | Type |
| --- | --- |
| ext | <code>string</code> | 

<a name="module_core.createBlob"></a>

## core.createBlob ⇒ <code>Blob</code>
Create a new blob

**Kind**: static constant of [<code>core</code>](#module_core)  

| Param | Type |
| --- | --- |
| content | <code>any</code> | 
| mime | <code>string</code> | 

<a name="module_core.createBlobUrl"></a>

## core.createBlobUrl ⇒ <code>string</code>
Create a new blob url

**Kind**: static constant of [<code>core</code>](#module_core)  
**Returns**: <code>string</code> - url  

| Param | Type |
| --- | --- |
| content | <code>any</code> | 
| mime | <code>string</code> | 

<a name="module_core.revokeBlobUrl"></a>

## core.revokeBlobUrl
Remove a blob url

**Kind**: static constant of [<code>core</code>](#module_core)  

| Param | Type |
| --- | --- |
| url | <code>string</code> | 

<a name="module_core.createBase64Url"></a>

## core.createBase64Url ⇒ <code>string</code>
Create a new base64 encoded url

**Kind**: static constant of [<code>core</code>](#module_core)  
**Returns**: <code>string</code> - url  

| Param | Type |
| --- | --- |
| content | <code>any</code> | 
| mime | <code>string</code> | 

<a name="module_core.type"></a>

## core.type ⇒ <code>string</code>
Get type of an object

**Kind**: static constant of [<code>core</code>](#module_core)  
**Returns**: <code>string</code> - type  

| Param | Type |
| --- | --- |
| obj | <code>object</code> | 

<a name="module_core.parse"></a>

## core.parse ⇒ <code>Document</code>
Parse xml (or html) markup

**Kind**: static constant of [<code>core</code>](#module_core)  
**Returns**: <code>Document</code> - document  

| Param | Type | Description |
| --- | --- | --- |
| markup | <code>string</code> |  |
| mime | <code>string</code> |  |
| forceXMLDom | <code>boolean</code> | force using xmlDom to parse instead of native parser |

<a name="module_core.qs"></a>

## core.qs ⇒ <code>Element</code>
querySelector polyfill

**Kind**: static constant of [<code>core</code>](#module_core)  
**Returns**: <code>Element</code> - element  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> |  |
| sel | <code>string</code> | selector string |

<a name="module_core.qsa"></a>

## core.qsa ⇒ <code>Array.&lt;Element&gt;</code>
querySelectorAll polyfill

**Kind**: static constant of [<code>core</code>](#module_core)  
**Returns**: <code>Array.&lt;Element&gt;</code> - elements  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> |  |
| sel | <code>string</code> | selector string |

<a name="module_core.qsp"></a>

## core.qsp ⇒ <code>Array.&lt;Element&gt;</code>
querySelector by property

**Kind**: static constant of [<code>core</code>](#module_core)  
**Returns**: <code>Array.&lt;Element&gt;</code> - elements  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> |  |
| sel | <code>string</code> | selector string |
| props | <code>Array.&lt;object&gt;</code> |  |

<a name="module_core.sprint"></a>

## core.sprint
Sprint through all text nodes in a document

**Kind**: static constant of [<code>core</code>](#module_core)  

| Param | Type | Description |
| --- | --- | --- |
| root | <code>Element</code> | element to start with |
| func | <code>function</code> | function to run on each element |

<a name="module_core.treeWalker"></a>

## core.treeWalker
Create a treeWalker

**Kind**: static constant of [<code>core</code>](#module_core)  

| Param | Type | Description |
| --- | --- | --- |
| root | <code>Element</code> | element to start with |
| func | <code>function</code> | function to run on each element |
| filter | <code>function</code> \| <code>object</code> | function or object to filter with |

<a name="module_core.walk"></a>

## core.walk ⇒ <code>boolean</code>
**Kind**: static constant of [<code>core</code>](#module_core)  

| Param | Type | Description |
| --- | --- | --- |
| node | <code>Node</code> |  |
| callback | <code>method</code> | false for continue,true for break inside callback |

<a name="module_core.blob2base64"></a>

## core.blob2base64 ⇒ <code>Promise</code>
Convert a blob to a base64 encoded string

**Kind**: static constant of [<code>core</code>](#module_core)  

| Param | Type |
| --- | --- |
| blob | <code>Blog</code> | 

<a name="module_core.querySelectorByType"></a>

## core.querySelectorByType ⇒ <code>Array.&lt;Element&gt;</code>
querySelector with filter by epub type

**Kind**: static constant of [<code>core</code>](#module_core)  
**Returns**: <code>Array.&lt;Element&gt;</code> - elements  

| Param | Type | Description |
| --- | --- | --- |
| html | <code>Element</code> |  |
| element | <code>string</code> | element type to find |
| type | <code>string</code> | epub type to find |

<a name="module_core.findChildren"></a>

## core.findChildren ⇒ <code>Array.&lt;Element&gt;</code>
Find direct descendents of an element

**Kind**: static constant of [<code>core</code>](#module_core)  
**Returns**: <code>Array.&lt;Element&gt;</code> - children  

| Param | Type |
| --- | --- |
| el | <code>Element</code> | 

<a name="module_core.parents"></a>

## core.parents ⇒ <code>Array.&lt;Node&gt;</code>
Find all parents (ancestors) of an element

**Kind**: static constant of [<code>core</code>](#module_core)  
**Returns**: <code>Array.&lt;Node&gt;</code> - parents  

| Param | Type |
| --- | --- |
| node | <code>Node</code> | 

<a name="module_core.filterChildren"></a>

## core.filterChildren ⇒ <code>Array.&lt;Element&gt;</code>
Find all direct descendents of a specific type

**Kind**: static constant of [<code>core</code>](#module_core)  
**Returns**: <code>Array.&lt;Element&gt;</code> - children  

| Param | Type |
| --- | --- |
| el | <code>Element</code> | 
| nodeName | <code>string</code> | 
| [single] | <code>boolean</code> | 

<a name="module_core.getParentByTagName"></a>

## core.getParentByTagName ⇒ <code>Array.&lt;Node&gt;</code>
Filter all parents (ancestors) with tag name

**Kind**: static constant of [<code>core</code>](#module_core)  
**Returns**: <code>Array.&lt;Node&gt;</code> - parents  

| Param | Type |
| --- | --- |
| node | <code>Node</code> | 
| tagname | <code>string</code> | 

