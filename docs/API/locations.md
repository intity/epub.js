<a name="Locations"></a>

# Locations
Find Locations for a Book

**Kind**: global class  

* [Locations](#Locations)
    * [new Locations([spine], [request], [pause])](#new_Locations_new)
    * _instance_
        * [.generate([chars])](#Locations+generate) ⇒ <code>Promise</code>
        * [.createRange()](#Locations+createRange) ⇒ <code>object</code>
        * [.process(section)](#Locations+process) ⇒ <code>Promise</code>
        * [.parse(contents, cfiBase, [chars])](#Locations+parse) ⇒ [<code>Locations</code>](#Locations)
        * [.locationFromCfi(value)](#Locations+locationFromCfi) ⇒ <code>number</code>
        * [.percentageFromCfi(cfi)](#Locations+percentageFromCfi) ⇒ <code>number</code>
        * [.percentageFromLocation(loc)](#Locations+percentageFromLocation) ⇒ <code>number</code>
        * [.cfiFromLocation(loc)](#Locations+cfiFromLocation) ⇒ <code>string</code> \| <code>null</code>
        * [.cfiFromPercentage(percentage)](#Locations+cfiFromPercentage) ⇒ <code>string</code> \| <code>null</code>
        * [.load(locations)](#Locations+load)
        * [.save()](#Locations+save) ⇒ <code>json</code>
        * [.set(options)](#Locations+set)
        * [.destroy()](#Locations+destroy)
    * _static_
        * [.current](#Locations.current) : <code>object</code>
        * ["changed" (current, changed)](#Locations.event_changed)

<a name="new_Locations_new"></a>

## new Locations([spine], [request], [pause])
Constructor


| Param | Type | Default |
| --- | --- | --- |
| [spine] | <code>Spine</code> |  | 
| [request] | <code>method</code> |  | 
| [pause] | <code>number</code> | <code>100</code> | 

<a name="Locations+generate"></a>

## locations.generate([chars]) ⇒ <code>Promise</code>
Load all of sections in the book to generate locations

**Kind**: instance method of [<code>Locations</code>](#Locations)  
**Returns**: <code>Promise</code> - locations  

| Param | Type | Description |
| --- | --- | --- |
| [chars] | <code>number</code> | how many chars to split on (default:150) |

<a name="Locations+createRange"></a>

## locations.createRange() ⇒ <code>object</code>
createRange

**Kind**: instance method of [<code>Locations</code>](#Locations)  
<a name="Locations+process"></a>

## locations.process(section) ⇒ <code>Promise</code>
process

**Kind**: instance method of [<code>Locations</code>](#Locations)  

| Param | Type |
| --- | --- |
| section | <code>Section</code> | 

<a name="Locations+parse"></a>

## locations.parse(contents, cfiBase, [chars]) ⇒ [<code>Locations</code>](#Locations)
parse

**Kind**: instance method of [<code>Locations</code>](#Locations)  

| Param | Type |
| --- | --- |
| contents | <code>Element</code> | 
| cfiBase | <code>string</code> | 
| [chars] | <code>number</code> | 

<a name="Locations+locationFromCfi"></a>

## locations.locationFromCfi(value) ⇒ <code>number</code>
Get a location from an EpubCFI

**Kind**: instance method of [<code>Locations</code>](#Locations)  
**Returns**: <code>number</code> - Location index  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | EpubCFI string format |

<a name="Locations+percentageFromCfi"></a>

## locations.percentageFromCfi(cfi) ⇒ <code>number</code>
Get a percentage position in locations from an EpubCFI

**Kind**: instance method of [<code>Locations</code>](#Locations)  
**Returns**: <code>number</code> - Percentage  

| Param | Type | Description |
| --- | --- | --- |
| cfi | <code>string</code> | EpubCFI string format |

<a name="Locations+percentageFromLocation"></a>

## locations.percentageFromLocation(loc) ⇒ <code>number</code>
Get a percentage position from a location index

**Kind**: instance method of [<code>Locations</code>](#Locations)  
**Returns**: <code>number</code> - Percentage  

| Param | Type | Description |
| --- | --- | --- |
| loc | <code>number</code> | Location index |

<a name="Locations+cfiFromLocation"></a>

## locations.cfiFromLocation(loc) ⇒ <code>string</code> \| <code>null</code>
Get an EpubCFI from location index

**Kind**: instance method of [<code>Locations</code>](#Locations)  
**Returns**: <code>string</code> \| <code>null</code> - EpubCFI string format  

| Param | Type | Description |
| --- | --- | --- |
| loc | <code>number</code> | Location index |

<a name="Locations+cfiFromPercentage"></a>

## locations.cfiFromPercentage(percentage) ⇒ <code>string</code> \| <code>null</code>
Get an EpubCFI from location percentage

**Kind**: instance method of [<code>Locations</code>](#Locations)  
**Returns**: <code>string</code> \| <code>null</code> - EpubCFI string format  

| Param | Type |
| --- | --- |
| percentage | <code>number</code> | 

<a name="Locations+load"></a>

## locations.load(locations)
Load locations from JSON

**Kind**: instance method of [<code>Locations</code>](#Locations)  

| Param | Type |
| --- | --- |
| locations | <code>string</code> | 

<a name="Locations+save"></a>

## locations.save() ⇒ <code>json</code>
Save locations to JSON

**Kind**: instance method of [<code>Locations</code>](#Locations)  
<a name="Locations+set"></a>

## locations.set(options)
Set current location

**Kind**: instance method of [<code>Locations</code>](#Locations)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| [options.cfi] | <code>string</code> | EpubCFI string format |
| [options.index] | <code>number</code> | Location index |
| [options.percentage] | <code>number</code> | Percentage |

<a name="Locations+destroy"></a>

## locations.destroy()
destroy

**Kind**: instance method of [<code>Locations</code>](#Locations)  
<a name="Locations.current"></a>

## Locations.current : <code>object</code>
Current Location

**Kind**: static property of [<code>Locations</code>](#Locations)  
**Read only**: true  
**Properties**

| Name | Type |
| --- | --- |
| current.cfi | <code>string</code> | 
| current.index | <code>number</code> | 
| current.percentage | <code>number</code> | 

<a name="Locations.event_changed"></a>

## "changed" (current, changed)
Current location changed

**Kind**: event emitted by [<code>Locations</code>](#Locations)  

| Param | Type | Description |
| --- | --- | --- |
| current | <code>object</code> | Current location |
| changed | <code>object</code> | Changed properties |

