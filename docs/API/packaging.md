<a name="Packaging"></a>

# Packaging
Open Packaging Format Parser

**Kind**: global class  

* [Packaging](#Packaging)
    * [new Packaging(packageXml)](#new_Packaging_new)
    * _instance_
        * [.parse(packageXml)](#Packaging+parse) ⇒ <code>object</code>
        * [.load(json)](#Packaging+load) ⇒ <code>object</code>
        * [.destroy()](#Packaging+destroy)
    * _static_
        * [.manifest](#Packaging.manifest) : <code>object</code>
        * [.metadata](#Packaging.metadata) : <code>object</code>
        * [.navPath](#Packaging.navPath) : <code>string</code>
        * [.ncxPath](#Packaging.ncxPath) : <code>string</code>
        * [.coverPath](#Packaging.coverPath) : <code>string</code>
        * [.spine](#Packaging.spine) : <code>Array.&lt;object&gt;</code>
        * [.spineNodeIndex](#Packaging.spineNodeIndex) : <code>number</code>
        * [.version](#Packaging.version) : <code>string</code>

<a name="new_Packaging_new"></a>

## new Packaging(packageXml)
Constructor


| Param | Type | Description |
| --- | --- | --- |
| packageXml | <code>Document</code> | OPF XML |

<a name="Packaging+parse"></a>

## packaging.parse(packageXml) ⇒ <code>object</code>
Parse OPF XML

**Kind**: instance method of [<code>Packaging</code>](#Packaging)  
**Returns**: <code>object</code> - parsed package parts  

| Param | Type | Description |
| --- | --- | --- |
| packageXml | <code>Document</code> | OPF XML |

<a name="Packaging+load"></a>

## packaging.load(json) ⇒ <code>object</code>
Load JSON Manifest

**Kind**: instance method of [<code>Packaging</code>](#Packaging)  
**Returns**: <code>object</code> - parsed package parts  

| Param | Type |
| --- | --- |
| json | <code>json</code> | 

<a name="Packaging+destroy"></a>

## packaging.destroy()
destroy

**Kind**: instance method of [<code>Packaging</code>](#Packaging)  
<a name="Packaging.manifest"></a>

## Packaging.manifest : <code>object</code>
**Kind**: static property of [<code>Packaging</code>](#Packaging)  
**Read only**: true  
<a name="Packaging.metadata"></a>

## Packaging.metadata : <code>object</code>
**Kind**: static property of [<code>Packaging</code>](#Packaging)  
**Read only**: true  
**Properties**

| Name | Type |
| --- | --- |
| title | <code>string</code> | 
| creator | <code>string</code> | 
| description | <code>string</code> | 
| publisher | <code>string</code> | 
| language | <code>string</code> | 
| rights | <code>string</code> | 
| date | <code>string</code> | 
| modified | <code>string</code> | 
| flow | <code>string</code> | 
| layout | <code>string</code> | 
| spread | <code>string</code> | 
| viewport | <code>string</code> | 
| orientation | <code>string</code> | 
| media_active_class | <code>string</code> | 

<a name="Packaging.navPath"></a>

## Packaging.navPath : <code>string</code>
**Kind**: static property of [<code>Packaging</code>](#Packaging)  
**Read only**: true  
<a name="Packaging.ncxPath"></a>

## Packaging.ncxPath : <code>string</code>
**Kind**: static property of [<code>Packaging</code>](#Packaging)  
**Read only**: true  
<a name="Packaging.coverPath"></a>

## Packaging.coverPath : <code>string</code>
**Kind**: static property of [<code>Packaging</code>](#Packaging)  
**Read only**: true  
<a name="Packaging.spine"></a>

## Packaging.spine : <code>Array.&lt;object&gt;</code>
**Kind**: static property of [<code>Packaging</code>](#Packaging)  
**Read only**: true  
<a name="Packaging.spineNodeIndex"></a>

## Packaging.spineNodeIndex : <code>number</code>
**Kind**: static property of [<code>Packaging</code>](#Packaging)  
**Read only**: true  
<a name="Packaging.version"></a>

## Packaging.version : <code>string</code>
Package version

**Kind**: static property of [<code>Packaging</code>](#Packaging)  
**Read only**: true  
