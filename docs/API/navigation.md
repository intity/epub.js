<a name="Navigation"></a>

# Navigation
Navigation Parser

**Kind**: global class  

* [Navigation](#Navigation)
    * [new Navigation(xml)](#new_Navigation_new)
    * [.parse(xml)](#Navigation+parse)
    * [.get(target)](#Navigation+get) ⇒ <code>object</code>
    * [.getByIndex(target, index, navItems)](#Navigation+getByIndex) ⇒ <code>object</code>
    * [.landmark(type)](#Navigation+landmark) ⇒ <code>object</code>
    * [.parseNavList(navListHtml, parent)](#Navigation+parseNavList) ⇒ <code>Array</code>
    * [.load(json)](#Navigation+load) ⇒ <code>Array</code>
    * [.forEach(fn)](#Navigation+forEach) ⇒ <code>method</code>

<a name="new_Navigation_new"></a>

## new Navigation(xml)
Constructor


| Param | Type | Description |
| --- | --- | --- |
| xml | <code>Document</code> | navigation html / xhtml / ncx |

<a name="Navigation+parse"></a>

## navigation.parse(xml)
Parse out the navigation items

**Kind**: instance method of [<code>Navigation</code>](#Navigation)  

| Param | Type | Description |
| --- | --- | --- |
| xml | <code>Document</code> | navigation html / xhtml / ncx |

<a name="Navigation+get"></a>

## navigation.get(target) ⇒ <code>object</code>
Get an item from the navigation

**Kind**: instance method of [<code>Navigation</code>](#Navigation)  
**Returns**: <code>object</code> - navItem  

| Param | Type |
| --- | --- |
| target | <code>string</code> | 

<a name="Navigation+getByIndex"></a>

## navigation.getByIndex(target, index, navItems) ⇒ <code>object</code>
Get an item from navigation subitems recursively by index

**Kind**: instance method of [<code>Navigation</code>](#Navigation)  
**Returns**: <code>object</code> - navItem  

| Param | Type |
| --- | --- |
| target | <code>string</code> | 
| index | <code>number</code> | 
| navItems | <code>Array</code> | 

<a name="Navigation+landmark"></a>

## navigation.landmark(type) ⇒ <code>object</code>
Get a landmark by type

**Kind**: instance method of [<code>Navigation</code>](#Navigation)  
**Returns**: <code>object</code> - landmarkItem  
**Link**: https://idpf.github.io/epub-vocabs/structure/  

| Param | Type |
| --- | --- |
| type | <code>string</code> | 

<a name="Navigation+parseNavList"></a>

## navigation.parseNavList(navListHtml, parent) ⇒ <code>Array</code>
Parses lists in the toc

**Kind**: instance method of [<code>Navigation</code>](#Navigation)  
**Returns**: <code>Array</code> - navigation list  

| Param | Type | Description |
| --- | --- | --- |
| navListHtml | <code>Document</code> |  |
| parent | <code>string</code> | id |

<a name="Navigation+load"></a>

## navigation.load(json) ⇒ <code>Array</code>
Load Spine Items

**Kind**: instance method of [<code>Navigation</code>](#Navigation)  
**Returns**: <code>Array</code> - navItems  

| Param | Type | Description |
| --- | --- | --- |
| json | <code>object</code> | the items to be loaded |

<a name="Navigation+forEach"></a>

## navigation.forEach(fn) ⇒ <code>method</code>
forEach pass through

**Kind**: instance method of [<code>Navigation</code>](#Navigation)  
**Returns**: <code>method</code> - forEach loop  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | function to run on each item |

