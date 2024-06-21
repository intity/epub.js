<a name="Url"></a>

# Url
Creates a Url object for parsing and manipulation of a url string

**Kind**: global class  

* [Url](#Url)
    * [new Url(url, [base])](#new_Url_new)
    * _instance_
        * [.resolve(path)](#Url+resolve) ⇒ <code>string</code>
        * [.relative(path)](#Url+relative) ⇒ <code>string</code>
        * [.toString()](#Url+toString) ⇒ <code>string</code>
    * _static_
        * [.path](#Url.path) : <code>Path</code>

<a name="new_Url_new"></a>

## new Url(url, [base])
Constructor


| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | a url string (relative or absolute) |
| [base] | <code>string</code> | optional base for the url, default to window.location.href |

<a name="Url+resolve"></a>

## url.resolve(path) ⇒ <code>string</code>
Resolves a relative path to a absolute url

**Kind**: instance method of [<code>Url</code>](#Url)  
**Returns**: <code>string</code> - url  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 

<a name="Url+relative"></a>

## url.relative(path) ⇒ <code>string</code>
Resolve a path relative to the url

**Kind**: instance method of [<code>Url</code>](#Url)  
**Returns**: <code>string</code> - path  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 

<a name="Url+toString"></a>

## url.toString() ⇒ <code>string</code>
toString

**Kind**: instance method of [<code>Url</code>](#Url)  
<a name="Url.path"></a>

## Url.path : <code>Path</code>
**Kind**: static property of [<code>Url</code>](#Url)  
**Read only**: true  
