<a name="Section"></a>

# Section
Represents a Section of the Book
In most books this is equivalent to a Chapter

**Kind**: global class  

* [Section](#Section)
    * [new Section(item, hooks)](#new_Section_new)
    * _instance_
        * [.load(request)](#Section+load) ⇒ <code>Promise</code>
        * [.render(request)](#Section+render) ⇒ <code>Promise</code>
        * [.find(query)](#Section+find) ⇒ <code>Array.&lt;object&gt;</code>
        * [.search(query, [maxSeqEle])](#Section+search) ⇒ <code>Array.&lt;object&gt;</code>
        * [.reconcileLayoutSettings(globalLayout)](#Section+reconcileLayoutSettings) ⇒ <code>object</code>
        * [.cfiFromRange(range)](#Section+cfiFromRange) ⇒ <code>string</code>
        * [.cfiFromElement(el)](#Section+cfiFromElement) ⇒ <code>string</code>
        * [.unload()](#Section+unload)
        * [.destroy()](#Section+destroy)
    * _static_
        * [.idref](#Section.idref) : <code>string</code>
        * [.linear](#Section.linear) : <code>boolean</code>
        * [.index](#Section.index) : <code>number</code>
        * [.href](#Section.href) : <code>string</code>
        * [.url](#Section.url) : <code>string</code>
        * [.canonical](#Section.canonical) : <code>string</code>
        * [.cfiBase](#Section.cfiBase) : <code>string</code>
        * [.next](#Section.next) : <code>function</code>
        * [.prev](#Section.prev) : <code>function</code>
        * [.properties](#Section.properties) : <code>Array.&lt;object&gt;</code>

<a name="new_Section_new"></a>

## new Section(item, hooks)
Constructor


| Param | Type |
| --- | --- |
| item | <code>object</code> | 
| hooks | <code>object</code> | 

<a name="Section+load"></a>

## section.load(request) ⇒ <code>Promise</code>
Load the section from its url

**Kind**: instance method of [<code>Section</code>](#Section)  
**Returns**: <code>Promise</code> - a promise with the xml document  

| Param | Type | Description |
| --- | --- | --- |
| request | <code>function</code> | a request method to use for loading |

<a name="Section+render"></a>

## section.render(request) ⇒ <code>Promise</code>
Render the contents of a section

**Kind**: instance method of [<code>Section</code>](#Section)  
**Returns**: <code>Promise</code> - output a serialized XML Document  

| Param | Type | Description |
| --- | --- | --- |
| request | <code>function</code> | a request method to use for loading |

<a name="Section+find"></a>

## section.find(query) ⇒ <code>Array.&lt;object&gt;</code>
Find a string in a section

**Kind**: instance method of [<code>Section</code>](#Section)  
**Returns**: <code>Array.&lt;object&gt;</code> - A list of matches, with form {cfi, excerpt}  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>string</code> | The query string to find |

<a name="Section+search"></a>

## section.search(query, [maxSeqEle]) ⇒ <code>Array.&lt;object&gt;</code>
Search a string in multiple sequential Element of the section.
If the document.createTreeWalker api is missed(eg: IE8), use 
`find` as a fallback.

**Kind**: instance method of [<code>Section</code>](#Section)  
**Returns**: <code>Array.&lt;object&gt;</code> - A list of matches, with form {cfi, excerpt}  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| query | <code>string</code> |  | The query string to search |
| [maxSeqEle] | <code>number</code> | <code>5</code> | The maximum number of Element that are combined for search, default value is 5. |

<a name="Section+reconcileLayoutSettings"></a>

## section.reconcileLayoutSettings(globalLayout) ⇒ <code>object</code>
Reconciles the current chapters layout properties with
the global layout properties.

**Kind**: instance method of [<code>Section</code>](#Section)  
**Returns**: <code>object</code> - layoutProperties Object with layout properties  

| Param | Type | Description |
| --- | --- | --- |
| globalLayout | <code>object</code> | The global layout settings object, chapter properties string |

<a name="Section+cfiFromRange"></a>

## section.cfiFromRange(range) ⇒ <code>string</code>
Get a CFI from a Range in the Section

**Kind**: instance method of [<code>Section</code>](#Section)  
**Returns**: <code>string</code> - cfi an EpubCFI string  

| Param | Type |
| --- | --- |
| range | <code>range</code> | 

<a name="Section+cfiFromElement"></a>

## section.cfiFromElement(el) ⇒ <code>string</code>
Get a CFI from an Element in the Section

**Kind**: instance method of [<code>Section</code>](#Section)  
**Returns**: <code>string</code> - cfi an EpubCFI string  

| Param | Type |
| --- | --- |
| el | <code>element</code> | 

<a name="Section+unload"></a>

## section.unload()
Unload the section document

**Kind**: instance method of [<code>Section</code>](#Section)  
<a name="Section+destroy"></a>

## section.destroy()
destroy

**Kind**: instance method of [<code>Section</code>](#Section)  
<a name="Section.idref"></a>

## Section.idref : <code>string</code>
**Kind**: static property of [<code>Section</code>](#Section)  
**Read only**: true  
<a name="Section.linear"></a>

## Section.linear : <code>boolean</code>
**Kind**: static property of [<code>Section</code>](#Section)  
**Read only**: true  
<a name="Section.index"></a>

## Section.index : <code>number</code>
**Kind**: static property of [<code>Section</code>](#Section)  
**Read only**: true  
<a name="Section.href"></a>

## Section.href : <code>string</code>
**Kind**: static property of [<code>Section</code>](#Section)  
**Read only**: true  
<a name="Section.url"></a>

## Section.url : <code>string</code>
**Kind**: static property of [<code>Section</code>](#Section)  
**Read only**: true  
<a name="Section.canonical"></a>

## Section.canonical : <code>string</code>
**Kind**: static property of [<code>Section</code>](#Section)  
**Read only**: true  
<a name="Section.cfiBase"></a>

## Section.cfiBase : <code>string</code>
**Kind**: static property of [<code>Section</code>](#Section)  
**Read only**: true  
<a name="Section.next"></a>

## Section.next : <code>function</code>
**Kind**: static property of [<code>Section</code>](#Section)  
**Read only**: true  
<a name="Section.prev"></a>

## Section.prev : <code>function</code>
**Kind**: static property of [<code>Section</code>](#Section)  
**Read only**: true  
<a name="Section.properties"></a>

## Section.properties : <code>Array.&lt;object&gt;</code>
**Kind**: static property of [<code>Section</code>](#Section)  
**Read only**: true  
