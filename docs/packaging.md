<a name="Packaging"></a>

# Packaging
Open Packaging Format Parser

**Kind**: global class  

* [Packaging](#Packaging)
    * [new Packaging(packageDocument)](#new_Packaging_new)
    * _instance_
        * [.parse(packageDocument)](#Packaging+parse) ⇒ <code>object</code>
        * [.load(packageDocument)](#Packaging+load) ⇒ <code>object</code>
        * [.destroy()](#Packaging+destroy)
    * _static_
        * [.manifest](#Packaging.manifest) : <code>object</code>
        * [.metadata](#Packaging.metadata) : <code>object</code>
        * [.navPath](#Packaging.navPath) : <code>string</code>
        * [.ncxPath](#Packaging.ncxPath) : <code>string</code>
        * [.coverPath](#Packaging.coverPath) : <code>string</code>
        * [.spine](#Packaging.spine) : <code>Array.&lt;object&gt;</code>
        * [.spineNodeIndex](#Packaging.spineNodeIndex) : <code>number</code>

<a name="new_Packaging_new"></a>

## new Packaging(packageDocument)
Constructor


| Param | Type | Description |
| --- | --- | --- |
| packageDocument | <code>\*</code> | OPF XML |

<a name="Packaging+parse"></a>

## packaging.parse(packageDocument) ⇒ <code>object</code>
Parse OPF XML

**Kind**: instance method of [<code>Packaging</code>](#Packaging)  
**Returns**: <code>object</code> - parsed package parts  

| Param | Type | Description |
| --- | --- | --- |
| packageDocument | <code>document</code> | OPF XML |

<a name="Packaging+load"></a>

## packaging.load(packageDocument) ⇒ <code>object</code>
Load JSON Manifest

**Kind**: instance method of [<code>Packaging</code>](#Packaging)  
**Returns**: <code>object</code> - parsed package parts  

| Param | Type | Description |
| --- | --- | --- |
| packageDocument | <code>document</code> | OPF XML |

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
