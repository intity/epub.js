<a name="EpubCFI"></a>

## EpubCFI
Parsing and creation of EpubCFIs: http://www.idpf.org/epub/linking/cfi/epub-cfi.html
Implements:
- Character Offset: epubcfi(/6/4[chap01ref]!/4[body01]/10[para05]/2/1:3)
- Simple Ranges : epubcfi(/6/4[chap01ref]!/4[body01]/10[para05],/2/1:1,/3:4)
Does Not Implement:
- Temporal Offset (~)
- Spatial Offset (@)
- Temporal-Spatial Offset (~ + @)
- Text Location Assertion ([)

**Kind**: global class  

* [EpubCFI](#EpubCFI)
    * [new EpubCFI([cfiFrom], [base], [ignoreClass])](#new_EpubCFI_new)
    * [.parse(cfiStr)](#EpubCFI+parse) ⇒ <code>object</code>
    * [.toString()](#EpubCFI+toString) ⇒ <code>string</code>
    * [.compare()](#EpubCFI+compare) ⇒ <code>number</code>
    * [.fromRange(range, base, [ignoreClass])](#EpubCFI+fromRange) ⇒ <code>object</code>
    * [.fromNode(anchor, base, [ignoreClass])](#EpubCFI+fromNode) ⇒ <code>object</code>
    * [.toRange(_doc, [ignoreClass])](#EpubCFI+toRange) ⇒ <code>Range</code>
    * [.isCfiString(str)](#EpubCFI+isCfiString) ⇒ <code>boolean</code>
    * [.collapse([toStart])](#EpubCFI+collapse)

<a name="new_EpubCFI_new"></a>

### new EpubCFI([cfiFrom], [base], [ignoreClass])

| Param | Type | Description |
| --- | --- | --- |
| [cfiFrom] | <code>string</code> \| <code>Range</code> \| <code>Node</code> |  |
| [base] | <code>string</code> \| <code>object</code> |  |
| [ignoreClass] | <code>string</code> | class to ignore when parsing DOM |

<a name="EpubCFI+parse"></a>

### epubCFI.parse(cfiStr) ⇒ <code>object</code>
Parse a cfi string to a CFI object representation

**Kind**: instance method of [<code>EpubCFI</code>](#EpubCFI)  
**Returns**: <code>object</code> - cfi  

| Param | Type |
| --- | --- |
| cfiStr | <code>string</code> | 

<a name="EpubCFI+toString"></a>

### epubCFI.toString() ⇒ <code>string</code>
Convert CFI to a epubcfi(...) string

**Kind**: instance method of [<code>EpubCFI</code>](#EpubCFI)  
**Returns**: <code>string</code> - epubcfi  
<a name="EpubCFI+compare"></a>

### epubCFI.compare() ⇒ <code>number</code>
Compare which of two CFIs is earlier in the text

**Kind**: instance method of [<code>EpubCFI</code>](#EpubCFI)  
**Returns**: <code>number</code> - First is earlier = -1, Second is earlier = 1, They are equal = 0  
<a name="EpubCFI+fromRange"></a>

### epubCFI.fromRange(range, base, [ignoreClass]) ⇒ <code>object</code>
Create a CFI object from a Range

**Kind**: instance method of [<code>EpubCFI</code>](#EpubCFI)  
**Returns**: <code>object</code> - cfi  

| Param | Type |
| --- | --- |
| range | <code>Range</code> | 
| base | <code>string</code> \| <code>object</code> | 
| [ignoreClass] | <code>string</code> | 

<a name="EpubCFI+fromNode"></a>

### epubCFI.fromNode(anchor, base, [ignoreClass]) ⇒ <code>object</code>
Create a CFI object from a Node

**Kind**: instance method of [<code>EpubCFI</code>](#EpubCFI)  
**Returns**: <code>object</code> - cfi  

| Param | Type |
| --- | --- |
| anchor | <code>Node</code> | 
| base | <code>string</code> \| <code>object</code> | 
| [ignoreClass] | <code>string</code> | 

<a name="EpubCFI+toRange"></a>

### epubCFI.toRange(_doc, [ignoreClass]) ⇒ <code>Range</code>
Creates a DOM range representing a CFI

**Kind**: instance method of [<code>EpubCFI</code>](#EpubCFI)  

| Param | Type | Description |
| --- | --- | --- |
| _doc | <code>document</code> | document referenced in the base |
| [ignoreClass] | <code>string</code> |  |

<a name="EpubCFI+isCfiString"></a>

### epubCFI.isCfiString(str) ⇒ <code>boolean</code>
Check if a string is wrapped with "epubcfi()"

**Kind**: instance method of [<code>EpubCFI</code>](#EpubCFI)  

| Param | Type |
| --- | --- |
| str | <code>string</code> | 

<a name="EpubCFI+collapse"></a>

### epubCFI.collapse([toStart])
Collapse a CFI Range to a single CFI Position

**Kind**: instance method of [<code>EpubCFI</code>](#EpubCFI)  

| Param | Type | Default |
| --- | --- | --- |
| [toStart] | <code>boolean</code> | <code>false</code> | 

