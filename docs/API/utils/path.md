<a name="Path"></a>

# Path
Creates a Path object for parsing and manipulation of a path strings

**Kind**: global class  
**Link**: https://nodejs.org/api/path.html  

* [Path](#Path)
    * [new Path(uri)](#new_Path_new)
    * _instance_
        * [.parse(path)](#Path+parse) ⇒ <code>object</code>
        * [.dirname(path)](#Path+dirname) ⇒ <code>string</code>
        * [.isAbsolute(path)](#Path+isAbsolute) ⇒ <code>boolean</code>
        * [.isDirectory(path)](#Path+isDirectory) ⇒ <code>boolean</code>
        * [.resolve()](#Path+resolve) ⇒ <code>string</code>
        * [.relative(from, to)](#Path+relative) ⇒ <code>string</code>
        * [.normalize(path)](#Path+normalize) ⇒ <code>string</code>
        * [.toString()](#Path+toString) ⇒ <code>string</code>
    * _static_
        * [.directory](#Path.directory) : <code>string</code>
        * [.filename](#Path.filename) : <code>string</code>
        * [.extension](#Path.extension) : <code>string</code>
        * [.path](#Path.path) : <code>string</code>

<a name="new_Path_new"></a>

## new Path(uri)
Constructor


| Param | Type | Description |
| --- | --- | --- |
| uri | <code>string</code> | a url string (relative or absolute) |

<a name="Path+parse"></a>

## path.parse(path) ⇒ <code>object</code>
Parse the path

**Kind**: instance method of [<code>Path</code>](#Path)  
**Link**: https://nodejs.org/api/path.html#path_path_parse_path  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 

<a name="Path+dirname"></a>

## path.dirname(path) ⇒ <code>string</code>
dirname

**Kind**: instance method of [<code>Path</code>](#Path)  
**Link**: https://nodejs.org/api/path.html#pathdirnamepath  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 

<a name="Path+isAbsolute"></a>

## path.isAbsolute(path) ⇒ <code>boolean</code>
isAbsolute

**Kind**: instance method of [<code>Path</code>](#Path)  
**Link**: https://nodejs.org/api/path.html#pathisabsolutepath  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 

<a name="Path+isDirectory"></a>

## path.isDirectory(path) ⇒ <code>boolean</code>
Check if path ends with a directory

**Kind**: instance method of [<code>Path</code>](#Path)  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 

<a name="Path+resolve"></a>

## path.resolve() ⇒ <code>string</code>
Resolve path

**Kind**: instance method of [<code>Path</code>](#Path)  
**Returns**: <code>string</code> - resolved  
**Link**: https://nodejs.org/api/path.html#pathresolvepaths  
<a name="Path+relative"></a>

## path.relative(from, to) ⇒ <code>string</code>
Relative path resolve

**Kind**: instance method of [<code>Path</code>](#Path)  
**Returns**: <code>string</code> - relative path  
**Link**: https://nodejs.org/api/path.html#pathrelativefrom-to  

| Param | Type |
| --- | --- |
| from | <code>string</code> | 
| to | <code>string</code> | 

<a name="Path+normalize"></a>

## path.normalize(path) ⇒ <code>string</code>
Normalize path

**Kind**: instance method of [<code>Path</code>](#Path)  
**Link**: https://nodejs.org/api/path.html#pathnormalizepath  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 

<a name="Path+toString"></a>

## path.toString() ⇒ <code>string</code>
Return the path string

**Kind**: instance method of [<code>Path</code>](#Path)  
**Returns**: <code>string</code> - path  
<a name="Path.directory"></a>

## Path.directory : <code>string</code>
**Kind**: static property of [<code>Path</code>](#Path)  
**Read only**: true  
<a name="Path.filename"></a>

## Path.filename : <code>string</code>
**Kind**: static property of [<code>Path</code>](#Path)  
**Read only**: true  
<a name="Path.extension"></a>

## Path.extension : <code>string</code>
**Kind**: static property of [<code>Path</code>](#Path)  
**Read only**: true  
<a name="Path.path"></a>

## Path.path : <code>string</code>
**Kind**: static property of [<code>Path</code>](#Path)  
**Read only**: true  
