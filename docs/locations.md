<a name="Locations"></a>

# Locations
Find Locations for a Book

**Kind**: global class  

* [Locations](#Locations)
    * [new Locations(spine, request, [pause])](#new_Locations_new)
    * [.currentLocation](#Locations+currentLocation)
    * [.currentLocation](#Locations+currentLocation)
    * [.generate(chars)](#Locations+generate) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
    * [.generateFromWords(startCfi, wordCount, count)](#Locations+generateFromWords) ⇒ <code>object</code>
    * [.locationFromCfi(cfi)](#Locations+locationFromCfi) ⇒ <code>number</code>
    * [.percentageFromCfi(cfi)](#Locations+percentageFromCfi) ⇒ <code>number</code>
    * [.percentageFromLocation(location)](#Locations+percentageFromLocation) ⇒ <code>number</code>
    * [.cfiFromLocation(loc)](#Locations+cfiFromLocation) ⇒ <code>EpubCFI</code>
    * [.cfiFromPercentage(percentage)](#Locations+cfiFromPercentage) ⇒ <code>EpubCFI</code>
    * [.load(locations)](#Locations+load)
    * [.save()](#Locations+save) ⇒ <code>json</code>
    * [.length()](#Locations+length)

<a name="new_Locations_new"></a>

## new Locations(spine, request, [pause])

| Param | Type | Default |
| --- | --- | --- |
| spine | <code>Spine</code> |  | 
| request | <code>request</code> |  | 
| [pause] | <code>number</code> | <code>100</code> | 

<a name="Locations+currentLocation"></a>

## locations.currentLocation
Get the current location

**Kind**: instance property of [<code>Locations</code>](#Locations)  
<a name="Locations+currentLocation"></a>

## locations.currentLocation
Set the current location

**Kind**: instance property of [<code>Locations</code>](#Locations)  
<a name="Locations+generate"></a>

## locations.generate(chars) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
Load all of sections in the book to generate locations

**Kind**: instance method of [<code>Locations</code>](#Locations)  
**Returns**: <code>Promise.&lt;Array.&lt;string&gt;&gt;</code> - locations  

| Param | Type | Description |
| --- | --- | --- |
| chars | <code>int</code> | how many chars to split on |

<a name="Locations+generateFromWords"></a>

## locations.generateFromWords(startCfi, wordCount, count) ⇒ <code>object</code>
Load all of sections in the book to generate locations

**Kind**: instance method of [<code>Locations</code>](#Locations)  
**Returns**: <code>object</code> - locations  

| Param | Type | Description |
| --- | --- | --- |
| startCfi | <code>string</code> | start position |
| wordCount | <code>int</code> | how many words to split on |
| count | <code>int</code> | result count |

<a name="Locations+locationFromCfi"></a>

## locations.locationFromCfi(cfi) ⇒ <code>number</code>
Get a location from an EpubCFI

**Kind**: instance method of [<code>Locations</code>](#Locations)  

| Param | Type |
| --- | --- |
| cfi | <code>EpubCFI</code> | 

<a name="Locations+percentageFromCfi"></a>

## locations.percentageFromCfi(cfi) ⇒ <code>number</code>
Get a percentage position in locations from an EpubCFI

**Kind**: instance method of [<code>Locations</code>](#Locations)  

| Param | Type |
| --- | --- |
| cfi | <code>EpubCFI</code> | 

<a name="Locations+percentageFromLocation"></a>

## locations.percentageFromLocation(location) ⇒ <code>number</code>
Get a percentage position from a location index

**Kind**: instance method of [<code>Locations</code>](#Locations)  

| Param | Type |
| --- | --- |
| location | <code>number</code> | 

<a name="Locations+cfiFromLocation"></a>

## locations.cfiFromLocation(loc) ⇒ <code>EpubCFI</code>
Get an EpubCFI from location index

**Kind**: instance method of [<code>Locations</code>](#Locations)  
**Returns**: <code>EpubCFI</code> - cfi  

| Param | Type |
| --- | --- |
| loc | <code>number</code> | 

<a name="Locations+cfiFromPercentage"></a>

## locations.cfiFromPercentage(percentage) ⇒ <code>EpubCFI</code>
Get an EpubCFI from location percentage

**Kind**: instance method of [<code>Locations</code>](#Locations)  
**Returns**: <code>EpubCFI</code> - cfi  

| Param | Type |
| --- | --- |
| percentage | <code>number</code> | 

<a name="Locations+load"></a>

## locations.load(locations)
Load locations from JSON

**Kind**: instance method of [<code>Locations</code>](#Locations)  

| Param | Type |
| --- | --- |
| locations | <code>json</code> | 

<a name="Locations+save"></a>

## locations.save() ⇒ <code>json</code>
Save locations to JSON

**Kind**: instance method of [<code>Locations</code>](#Locations)  
<a name="Locations+length"></a>

## locations.length()
Locations length

**Kind**: instance method of [<code>Locations</code>](#Locations)  
