<a name="Book"></a>

# Book
An Epub representation with methods for the loading, parsing and manipulation
of its contents.

**Kind**: global class  

* [Book](#Book)
    * [new Book([url], [options])](#new_Book_new)
    * _instance_
        * [.open(input, [what])](#Book+open) ⇒ <code>Promise</code>
        * [.load(path)](#Book+load) ⇒ <code>Promise</code>
        * [.resolve(path, [absolute])](#Book+resolve) ⇒ <code>string</code>
        * [.canonical(path)](#Book+canonical) ⇒ <code>string</code>
        * [.section(target)](#Book+section) ⇒ <code>Section</code>
        * [.renderTo(element, [options])](#Book+renderTo) ⇒ <code>Rendition</code>
        * [.setRequestCredentials(credentials)](#Book+setRequestCredentials)
        * [.setRequestHeaders(headers)](#Book+setRequestHeaders)
        * [.coverUrl()](#Book+coverUrl) ⇒ <code>Promise.&lt;?string&gt;</code>
        * [.getRange(cfiRange)](#Book+getRange) ⇒ <code>Promise</code>
        * [.key([identifier])](#Book+key) ⇒ <code>string</code>
        * [.destroy()](#Book+destroy)
    * _static_
        * [.opened](#Book.opened) : <code>promise</code>
        * [.isOpen](#Book.isOpen) : <code>boolean</code>
        * [.ready](#Book.ready) : <code>promise</code>
        * [.isRendered](#Book.isRendered) : <code>boolean</code>
        * [.request](#Book.request) : <code>method</code>
        * [.spine](#Book.spine) : <code>Spine</code>
        * [.locations](#Book.locations) : <code>Locations</code>
        * [.navigation](#Book.navigation) : <code>Navigation</code>
        * [.pagelist](#Book.pagelist) : <code>PageList</code>
        * [.url](#Book.url) : <code>Url</code>
        * [.path](#Book.path) : <code>Path</code>
        * [.archived](#Book.archived) : <code>boolean</code>
        * [.storage](#Book.storage) : <code>Store</code>
        * [.resources](#Book.resources) : <code>Resources</code>
        * [.rendition](#Book.rendition) : <code>Rendition</code>
        * [.container](#Book.container) : <code>Container</code>
        * [.packaging](#Book.packaging) : <code>Packaging</code>
        * ["openFailed" (error)](#Book.event_openFailed)

<a name="new_Book_new"></a>

## new Book([url], [options])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [url] | <code>string</code> |  |  |
| [options] | <code>object</code> |  |  |
| [options.requestMethod] | <code>method</code> |  | a request function to use instead of the default |
| [options.requestCredentials] | <code>boolean</code> |  | send the xhr request withCredentials |
| [options.requestHeaders] | <code>object</code> |  | send the xhr request headers |
| [options.encoding] | <code>string</code> | <code>&quot;binary&quot;</code> | optional to pass 'binary' or base64' for archived Epubs |
| [options.replacements] | <code>string</code> | <code>&quot;none&quot;</code> | use base64, blobUrl, or none for replacing assets in archived Epubs |
| [options.canonical] | <code>method</code> |  | optional function to determine canonical urls for a path |
| [options.openAs] | <code>string</code> |  | optional string to determine the input type |
| [options.store] | <code>string</code> | <code>false</code> | cache the contents in local storage, value should be the name of the reader |

**Example**  
```js
new Book("/path/to/book.epub", {})
```
**Example**  
```js
new Book({ replacements: "blobUrl" })
```
<a name="Book+open"></a>

## book.open(input, [what]) ⇒ <code>Promise</code>
Open a epub or url

**Kind**: instance method of [<code>Book</code>](#Book)  
**Returns**: <code>Promise</code> - of when the book has been loaded  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| input | <code>string</code> \| <code>ArrayBuffer</code> |  | Url, Path or ArrayBuffer |
| [what] | <code>string</code> | <code>&quot;\&quot;binary\&quot;, \&quot;base64\&quot;, \&quot;epub\&quot;, \&quot;opf\&quot;, \&quot;json\&quot;, \&quot;directory\&quot;&quot;</code> | force opening as a certain type |

**Example**  
```js
book.open("/path/to/book.epub")
```
<a name="Book+load"></a>

## book.load(path) ⇒ <code>Promise</code>
Load a resource from the Book

**Kind**: instance method of [<code>Book</code>](#Book)  
**Returns**: <code>Promise</code> - returns a promise with the requested resource  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | path to the resource to load |

<a name="Book+resolve"></a>

## book.resolve(path, [absolute]) ⇒ <code>string</code>
Resolve a path to it's absolute position in the Book

**Kind**: instance method of [<code>Book</code>](#Book)  
**Returns**: <code>string</code> - the resolved path string  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> |  |
| [absolute] | <code>boolean</code> | force resolving the full URL |

<a name="Book+canonical"></a>

## book.canonical(path) ⇒ <code>string</code>
Get a canonical link to a path

**Kind**: instance method of [<code>Book</code>](#Book)  
**Returns**: <code>string</code> - the canonical path string  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 

<a name="Book+section"></a>

## book.section(target) ⇒ <code>Section</code>
Gets a Section of the Book from the Spine
Alias for `book.spine.get`

**Kind**: instance method of [<code>Book</code>](#Book)  

| Param | Type |
| --- | --- |
| target | <code>string</code> | 

<a name="Book+renderTo"></a>

## book.renderTo(element, [options]) ⇒ <code>Rendition</code>
Sugar to render a book to an element

**Kind**: instance method of [<code>Book</code>](#Book)  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>Element</code> \| <code>string</code> | element or string to add a rendition to |
| [options] | <code>object</code> |  |

<a name="Book+setRequestCredentials"></a>

## book.setRequestCredentials(credentials)
Set if request should use withCredentials

**Kind**: instance method of [<code>Book</code>](#Book)  

| Param | Type |
| --- | --- |
| credentials | <code>boolean</code> | 

<a name="Book+setRequestHeaders"></a>

## book.setRequestHeaders(headers)
Set headers request should use

**Kind**: instance method of [<code>Book</code>](#Book)  

| Param | Type |
| --- | --- |
| headers | <code>object</code> | 

<a name="Book+coverUrl"></a>

## book.coverUrl() ⇒ <code>Promise.&lt;?string&gt;</code>
Get the cover url

**Kind**: instance method of [<code>Book</code>](#Book)  
**Returns**: <code>Promise.&lt;?string&gt;</code> - coverUrl  
<a name="Book+getRange"></a>

## book.getRange(cfiRange) ⇒ <code>Promise</code>
Find a DOM Range for a given CFI Range

**Kind**: instance method of [<code>Book</code>](#Book)  

| Param | Type | Description |
| --- | --- | --- |
| cfiRange | <code>EpubCFI</code> | a epub cfi range |

<a name="Book+key"></a>

## book.key([identifier]) ⇒ <code>string</code>
Generates the Book Key using the identifier in the manifest or other string provided

**Kind**: instance method of [<code>Book</code>](#Book)  
**Returns**: <code>string</code> - key  

| Param | Type | Description |
| --- | --- | --- |
| [identifier] | <code>string</code> | to use instead of metadata identifier |

<a name="Book+destroy"></a>

## book.destroy()
Destroy the Book and all associated objects

**Kind**: instance method of [<code>Book</code>](#Book)  
<a name="Book.opened"></a>

## Book.opened : <code>promise</code>
returns after the book is loaded

**Kind**: static property of [<code>Book</code>](#Book)  
**Read only**: true  
<a name="Book.isOpen"></a>

## Book.isOpen : <code>boolean</code>
**Kind**: static property of [<code>Book</code>](#Book)  
**Read only**: true  
<a name="Book.ready"></a>

## Book.ready : <code>promise</code>
returns after the book is loaded and parsed

**Kind**: static property of [<code>Book</code>](#Book)  
**Read only**: true  
<a name="Book.isRendered"></a>

## Book.isRendered : <code>boolean</code>
Queue for methods used before opening

**Kind**: static property of [<code>Book</code>](#Book)  
**Read only**: true  
<a name="Book.request"></a>

## Book.request : <code>method</code>
**Kind**: static property of [<code>Book</code>](#Book)  
**Read only**: true  
<a name="Book.spine"></a>

## Book.spine : <code>Spine</code>
**Kind**: static property of [<code>Book</code>](#Book)  
**Read only**: true  
<a name="Book.locations"></a>

## Book.locations : <code>Locations</code>
**Kind**: static property of [<code>Book</code>](#Book)  
**Read only**: true  
<a name="Book.navigation"></a>

## Book.navigation : <code>Navigation</code>
**Kind**: static property of [<code>Book</code>](#Book)  
**Read only**: true  
<a name="Book.pagelist"></a>

## Book.pagelist : <code>PageList</code>
**Kind**: static property of [<code>Book</code>](#Book)  
**Read only**: true  
<a name="Book.url"></a>

## Book.url : <code>Url</code>
**Kind**: static property of [<code>Book</code>](#Book)  
**Read only**: true  
<a name="Book.path"></a>

## Book.path : <code>Path</code>
**Kind**: static property of [<code>Book</code>](#Book)  
**Read only**: true  
<a name="Book.archived"></a>

## Book.archived : <code>boolean</code>
**Kind**: static property of [<code>Book</code>](#Book)  
**Read only**: true  
<a name="Book.storage"></a>

## Book.storage : <code>Store</code>
**Kind**: static property of [<code>Book</code>](#Book)  
**Read only**: true  
<a name="Book.resources"></a>

## Book.resources : <code>Resources</code>
**Kind**: static property of [<code>Book</code>](#Book)  
**Read only**: true  
<a name="Book.rendition"></a>

## Book.rendition : <code>Rendition</code>
**Kind**: static property of [<code>Book</code>](#Book)  
**Read only**: true  
<a name="Book.container"></a>

## Book.container : <code>Container</code>
**Kind**: static property of [<code>Book</code>](#Book)  
**Read only**: true  
<a name="Book.packaging"></a>

## Book.packaging : <code>Packaging</code>
**Kind**: static property of [<code>Book</code>](#Book)  
**Read only**: true  
<a name="Book.event_openFailed"></a>

## "openFailed" (error)
**Kind**: event emitted by [<code>Book</code>](#Book)  

| Param | Type |
| --- | --- |
| error | <code>object</code> | 

