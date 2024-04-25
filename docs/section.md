<a name="Section"></a>

## Section
Represents a Section of the Book

In most books this is equivalent to a Chapter

**Kind**: global class  

* [Section](#Section)
    * [new Section(item, hooks)](#new_Section_new)
    * [.load([_request])](#Section+load) ⇒ <code>document</code>
    * [.render([_request])](#Section+render) ⇒ <code>string</code>
    * [.find(_query)](#Section+find) ⇒ <code>Array.&lt;object&gt;</code>
    * [.search(_query, maxSeqEle)](#Section+search) ⇒ <code>Array.&lt;object&gt;</code>
    * [.reconcileLayoutSettings(globalLayout)](#Section+reconcileLayoutSettings) ⇒ <code>object</code>
    * [.cfiFromRange(_range)](#Section+cfiFromRange) ⇒ <code>string</code>
    * [.cfiFromElement(el)](#Section+cfiFromElement) ⇒ <code>string</code>
    * [.unload()](#Section+unload)

<a name="new_Section_new"></a>

### new Section(item, hooks)

| Param | Type | Description |
| --- | --- | --- |
| item | <code>object</code> | The spine item representing the section |
| hooks | <code>object</code> | hooks for serialize and content |

<a name="Section+load"></a>

### section.load([_request]) ⇒ <code>document</code>
Load the section from its url

**Kind**: instance method of [<code>Section</code>](#Section)  
**Returns**: <code>document</code> - a promise with the xml document  

| Param | Type | Description |
| --- | --- | --- |
| [_request] | <code>method</code> | a request method to use for loading |

<a name="Section+render"></a>

### section.render([_request]) ⇒ <code>string</code>
Render the contents of a section

**Kind**: instance method of [<code>Section</code>](#Section)  
**Returns**: <code>string</code> - output a serialized XML Document  

| Param | Type | Description |
| --- | --- | --- |
| [_request] | <code>method</code> | a request method to use for loading |

<a name="Section+find"></a>

### section.find(_query) ⇒ <code>Array.&lt;object&gt;</code>
Find a string in a section

**Kind**: instance method of [<code>Section</code>](#Section)  
**Returns**: <code>Array.&lt;object&gt;</code> - A list of matches, with form {cfi, excerpt}  

| Param | Type | Description |
| --- | --- | --- |
| _query | <code>string</code> | The query string to find |

<a name="Section+search"></a>

### section.search(_query, maxSeqEle) ⇒ <code>Array.&lt;object&gt;</code>
Search a string in multiple sequential Element of the section. If the document.createTreeWalker api is missed(eg: IE8), use `find` as a fallback.

**Kind**: instance method of [<code>Section</code>](#Section)  
**Returns**: <code>Array.&lt;object&gt;</code> - A list of matches, with form {cfi, excerpt}  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| _query | <code>string</code> |  | The query string to search |
| maxSeqEle | <code>int</code> | <code>5</code> | The maximum number of Element that are combined for search, default value is 5. |

<a name="Section+reconcileLayoutSettings"></a>

### section.reconcileLayoutSettings(globalLayout) ⇒ <code>object</code>
Reconciles the current chapters layout properties with
the global layout properties.

**Kind**: instance method of [<code>Section</code>](#Section)  
**Returns**: <code>object</code> - layoutProperties Object with layout properties  

| Param | Type | Description |
| --- | --- | --- |
| globalLayout | <code>object</code> | The global layout settings object, chapter properties string |

<a name="Section+cfiFromRange"></a>

### section.cfiFromRange(_range) ⇒ <code>string</code>
Get a CFI from a Range in the Section

**Kind**: instance method of [<code>Section</code>](#Section)  
**Returns**: <code>string</code> - cfi an EpubCFI string  

| Param | Type |
| --- | --- |
| _range | <code>range</code> | 

<a name="Section+cfiFromElement"></a>

### section.cfiFromElement(el) ⇒ <code>string</code>
Get a CFI from an Element in the Section

**Kind**: instance method of [<code>Section</code>](#Section)  
**Returns**: <code>string</code> - cfi an EpubCFI string  

| Param | Type |
| --- | --- |
| el | <code>element</code> | 

<a name="Section+unload"></a>

### section.unload()
Unload the section document

**Kind**: instance method of [<code>Section</code>](#Section)  
