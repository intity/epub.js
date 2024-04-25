<a name="Url"></a>

## Url
creates a Url object for parsing and manipulation of a url string

**Kind**: global class  

* [Url](#Url)
    * [new Url(urlString, [baseString])](#new_Url_new)
    * [.path()](#Url+path) ⇒ <code>Path</code>
    * [.resolve(what)](#Url+resolve) ⇒ <code>string</code>
    * [.relative(what)](#Url+relative) ⇒ <code>string</code>
    * [.toString()](#Url+toString) ⇒ <code>string</code>

<a name="new_Url_new"></a>

### new Url(urlString, [baseString])

| Param | Type | Description |
| --- | --- | --- |
| urlString | <code>string</code> | a url string (relative or absolute) |
| [baseString] | <code>string</code> | optional base for the url, default to window.location.href |

<a name="Url+path"></a>

### url.path() ⇒ <code>Path</code>
**Kind**: instance method of [<code>Url</code>](#Url)  
<a name="Url+resolve"></a>

### url.resolve(what) ⇒ <code>string</code>
Resolves a relative path to a absolute url

**Kind**: instance method of [<code>Url</code>](#Url)  
**Returns**: <code>string</code> - url  

| Param | Type |
| --- | --- |
| what | <code>string</code> | 

<a name="Url+relative"></a>

### url.relative(what) ⇒ <code>string</code>
Resolve a path relative to the url

**Kind**: instance method of [<code>Url</code>](#Url)  
**Returns**: <code>string</code> - path  

| Param | Type |
| --- | --- |
| what | <code>string</code> | 

<a name="Url+toString"></a>

### url.toString() ⇒ <code>string</code>
**Kind**: instance method of [<code>Url</code>](#Url)  
