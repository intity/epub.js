<a name="EpubCFI"></a>

# EpubCFI
Parsing and creation of EpubCFIs: https://idpf.org/epub/linking/cfi/epub-cfi.html

Implements:
- Character Offset: `epubcfi(/6/4[chap01ref]!/4[body01]/10[para05]/2/1:3)`
- Simple Ranges : `epubcfi(/6/4[chap01ref]!/4[body01]/10[para05],/2/1:1,/3:4)`

Does Not Implement:
- Temporal Offset `(~)`
- Spatial Offset `(@)`
- Temporal-Spatial Offset `(~ + @)`
- Text Location Assertion `([)`

**Kind**: global class  

* [EpubCFI](#EpubCFI)
    * [new EpubCFI([cfiFrom], [base], [ignoreClass])](#new_EpubCFI_new)
    * _instance_
        * [.collapse([toStart])](#EpubCFI+collapse)
        * [.compare(cfiOne, cfiTwo)](#EpubCFI+compare) ⇒ <code>number</code>
        * [.equalStep(stepA, stepB)](#EpubCFI+equalStep) ⇒ <code>boolean</code>
        * [.filter(anchor, ignoreClass)](#EpubCFI+filter) ⇒ <code>Element</code> \| <code>false</code>
        * [.fromNode(anchor, base, [ignoreClass])](#EpubCFI+fromNode) ⇒ [<code>EpubCFI</code>](#EpubCFI)
        * [.fromRange(range, base, [ignoreClass])](#EpubCFI+fromRange) ⇒ [<code>EpubCFI</code>](#EpubCFI)
        * [.isCfiString(str)](#EpubCFI+isCfiString) ⇒ <code>boolean</code>
        * [.parse(cfiStr)](#EpubCFI+parse) ⇒ [<code>EpubCFI</code>](#EpubCFI)
        * [.toRange([_doc], [ignoreClass])](#EpubCFI+toRange) ⇒ <code>Range</code>
        * [.toString()](#EpubCFI+toString) ⇒ <code>string</code>
    * _static_
        * [.base](#EpubCFI.base) : <code>object</code>
        * [.spinePos](#EpubCFI.spinePos) : <code>number</code>
        * [.path](#EpubCFI.path) : <code>object</code>
        * [.range](#EpubCFI.range) : <code>boolean</code>
        * [.start](#EpubCFI.start) : <code>object</code>
        * [.end](#EpubCFI.end) : <code>object</code>
        * [.str](#EpubCFI.str) : <code>string</code>

<a name="new_EpubCFI_new"></a>

## new EpubCFI([cfiFrom], [base], [ignoreClass])
Constructor


| Param | Type | Description |
| --- | --- | --- |
| [cfiFrom] | <code>string</code> \| <code>Range</code> \| <code>Node</code> |  |
| [base] | <code>string</code> \| <code>object</code> |  |
| [ignoreClass] | <code>string</code> | class to ignore when parsing DOM |

<a name="EpubCFI+collapse"></a>

## epubCFI.collapse([toStart])
Collapse a CFI Range to a single CFI Position

**Kind**: instance method of [<code>EpubCFI</code>](#EpubCFI)  

| Param | Type | Default |
| --- | --- | --- |
| [toStart] | <code>boolean</code> | <code>false</code> | 

<a name="EpubCFI+compare"></a>

## epubCFI.compare(cfiOne, cfiTwo) ⇒ <code>number</code>
Compare which of two CFIs is earlier in the text

**Kind**: instance method of [<code>EpubCFI</code>](#EpubCFI)  
**Returns**: <code>number</code> - First is earlier = -1, Second is earlier = 1, They are equal = 0  

| Param | Type |
| --- | --- |
| cfiOne | <code>string</code> \| [<code>EpubCFI</code>](#EpubCFI) | 
| cfiTwo | <code>string</code> \| [<code>EpubCFI</code>](#EpubCFI) | 

<a name="EpubCFI+equalStep"></a>

## epubCFI.equalStep(stepA, stepB) ⇒ <code>boolean</code>
equalStep

**Kind**: instance method of [<code>EpubCFI</code>](#EpubCFI)  

| Param | Type |
| --- | --- |
| stepA | <code>object</code> | 
| stepB | <code>object</code> | 

<a name="EpubCFI+filter"></a>

## epubCFI.filter(anchor, ignoreClass) ⇒ <code>Element</code> \| <code>false</code>
filter

**Kind**: instance method of [<code>EpubCFI</code>](#EpubCFI)  

| Param | Type |
| --- | --- |
| anchor | <code>Element</code> | 
| ignoreClass | <code>string</code> | 

<a name="EpubCFI+fromNode"></a>

## epubCFI.fromNode(anchor, base, [ignoreClass]) ⇒ [<code>EpubCFI</code>](#EpubCFI)
Create a EpubCFI object from a Node

**Kind**: instance method of [<code>EpubCFI</code>](#EpubCFI)  

| Param | Type |
| --- | --- |
| anchor | <code>Node</code> | 
| base | <code>string</code> \| <code>object</code> | 
| [ignoreClass] | <code>string</code> | 

<a name="EpubCFI+fromRange"></a>

## epubCFI.fromRange(range, base, [ignoreClass]) ⇒ [<code>EpubCFI</code>](#EpubCFI)
Create a CFI object from a Range

**Kind**: instance method of [<code>EpubCFI</code>](#EpubCFI)  

| Param | Type |
| --- | --- |
| range | <code>Range</code> | 
| base | <code>string</code> \| <code>object</code> | 
| [ignoreClass] | <code>string</code> | 

<a name="EpubCFI+isCfiString"></a>

## epubCFI.isCfiString(str) ⇒ <code>boolean</code>
Check if a string is wrapped with "epubcfi()"

**Kind**: instance method of [<code>EpubCFI</code>](#EpubCFI)  

| Param | Type |
| --- | --- |
| str | <code>string</code> | 

<a name="EpubCFI+parse"></a>

## epubCFI.parse(cfiStr) ⇒ [<code>EpubCFI</code>](#EpubCFI)
Parse a cfi string to a EpubCFI object representation

**Kind**: instance method of [<code>EpubCFI</code>](#EpubCFI)  

| Param | Type |
| --- | --- |
| cfiStr | <code>string</code> | 

<a name="EpubCFI+toRange"></a>

## epubCFI.toRange([_doc], [ignoreClass]) ⇒ <code>Range</code>
Creates a DOM range representing a CFI

**Kind**: instance method of [<code>EpubCFI</code>](#EpubCFI)  

| Param | Type | Description |
| --- | --- | --- |
| [_doc] | <code>Document</code> | document referenced in the base |
| [ignoreClass] | <code>string</code> |  |

<a name="EpubCFI+toString"></a>

## epubCFI.toString() ⇒ <code>string</code>
Convert CFI to a epubcfi(...) string

**Kind**: instance method of [<code>EpubCFI</code>](#EpubCFI)  
**Returns**: <code>string</code> - EpubCFI string format  
<a name="EpubCFI.base"></a>

## EpubCFI.base : <code>object</code>
**Kind**: static property of [<code>EpubCFI</code>](#EpubCFI)  
<a name="EpubCFI.spinePos"></a>

## EpubCFI.spinePos : <code>number</code>
spine position

**Kind**: static property of [<code>EpubCFI</code>](#EpubCFI)  
<a name="EpubCFI.path"></a>

## EpubCFI.path : <code>object</code>
**Kind**: static property of [<code>EpubCFI</code>](#EpubCFI)  
<a name="EpubCFI.range"></a>

## EpubCFI.range : <code>boolean</code>
**Kind**: static property of [<code>EpubCFI</code>](#EpubCFI)  
<a name="EpubCFI.start"></a>

## EpubCFI.start : <code>object</code>
**Kind**: static property of [<code>EpubCFI</code>](#EpubCFI)  
<a name="EpubCFI.end"></a>

## EpubCFI.end : <code>object</code>
**Kind**: static property of [<code>EpubCFI</code>](#EpubCFI)  
<a name="EpubCFI.str"></a>

## EpubCFI.str : <code>string</code>
EpubCFI string format

**Kind**: static property of [<code>EpubCFI</code>](#EpubCFI)  
