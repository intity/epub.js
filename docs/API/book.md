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
        * [.spine](#Book.spine) : <code>Spine</code>
        * [.locations](#Book.locations) : <code>Locations</code>
        * [.navigation](#Book.navigation) : <code>Navigation</code>
        * [.pagelist](#Book.pagelist) : <code>PageList</code>

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
| element | <code>element</code> \| <code>string</code> | element or string to add a rendition to |
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
<a name="Book.spine"></a>

## Book.spine : <code>Spine</code>
**Kind**: static property of [<code>Book</code>](#Book)  
<a name="Book.locations"></a>

## Book.locations : <code>Locations</code>
**Kind**: static property of [<code>Book</code>](#Book)  
<a name="Book.navigation"></a>

## Book.navigation : <code>Navigation</code>
**Kind**: static property of [<code>Book</code>](#Book)  
<a name="Book.pagelist"></a>

## Book.pagelist : <code>PageList</code>
**Kind**: static property of [<code>Book</code>](#Book)  
