<a name="Path"></a>

# Path
Creates a Path object for parsing and manipulation of a path strings

Uses a polyfill for Nodejs path: https://nodejs.org/api/path.html

**Kind**: global class  

* [Path](#Path)
    * [new Path(pathString)](#new_Path_new)
    * [.parse(what)](#Path+parse) ⇒ <code>object</code>
    * [.isAbsolute(what)](#Path+isAbsolute) ⇒ <code>boolean</code>
    * [.isDirectory(what)](#Path+isDirectory) ⇒ <code>boolean</code>
    * [.resolve(what)](#Path+resolve) ⇒ <code>string</code>
    * [.relative(what)](#Path+relative) ⇒ <code>string</code>
    * [.toString()](#Path+toString) ⇒ <code>string</code>

<a name="new_Path_new"></a>

## new Path(pathString)

| Param | Type | Description |
| --- | --- | --- |
| pathString | <code>string</code> | a url string (relative or absolute) |

<a name="Path+parse"></a>

## path.parse(what) ⇒ <code>object</code>
Parse the path: https://nodejs.org/api/path.html#path_path_parse_path

**Kind**: instance method of [<code>Path</code>](#Path)  

| Param | Type |
| --- | --- |
| what | <code>string</code> | 

<a name="Path+isAbsolute"></a>

## path.isAbsolute(what) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>Path</code>](#Path)  

| Param | Type |
| --- | --- |
| what | <code>string</code> | 

<a name="Path+isDirectory"></a>

## path.isDirectory(what) ⇒ <code>boolean</code>
Check if path ends with a directory

**Kind**: instance method of [<code>Path</code>](#Path)  

| Param | Type |
| --- | --- |
| what | <code>string</code> | 

<a name="Path+resolve"></a>

## path.resolve(what) ⇒ <code>string</code>
Resolve a path against the directory of the Path

https://nodejs.org/api/path.html#path_path_resolve_paths

**Kind**: instance method of [<code>Path</code>](#Path)  
**Returns**: <code>string</code> - resolved  

| Param | Type |
| --- | --- |
| what | <code>string</code> | 

<a name="Path+relative"></a>

## path.relative(what) ⇒ <code>string</code>
Resolve a path relative to the directory of the Path

https://nodejs.org/api/path.html#path_path_relative_from_to

**Kind**: instance method of [<code>Path</code>](#Path)  
**Returns**: <code>string</code> - relative  

| Param | Type |
| --- | --- |
| what | <code>string</code> | 

<a name="Path+toString"></a>

## path.toString() ⇒ <code>string</code>
Return the path string

**Kind**: instance method of [<code>Path</code>](#Path)  
**Returns**: <code>string</code> - path  
