<a name="Layout"></a>

# Layout
Figures out the CSS values to apply for a layout

**Kind**: global class  

* [Layout](#Layout)
    * [new Layout(options)](#new_Layout_new)
    * _instance_
        * [.flow(str)](#Layout+flow) ⇒ <code>string</code>
        * [.spread([spread], [min])](#Layout+spread) ⇒ <code>boolean</code>
        * [.calculate(width, height, [gap])](#Layout+calculate)
        * [.format(contents)](#Layout+format) ⇒ <code>Promise</code>
        * [.count(totalLength, pageLength)](#Layout+count) ⇒ <code>Object</code>
    * _static_
        * [.name](#Layout.name) : <code>string</code>
        * [.minSpreadWidth](#Layout.minSpreadWidth) : <code>number</code>
        * [.evenSpreads](#Layout.evenSpreads) : <code>boolean</code>
        * [.width](#Layout.width) : <code>number</code>
        * [.height](#Layout.height) : <code>number</code>
        * [.spreadWidth](#Layout.spreadWidth) : <code>number</code>
        * [.delta](#Layout.delta) : <code>number</code>
        * [.columnWidth](#Layout.columnWidth) : <code>number</code>
        * [.gap](#Layout.gap) : <code>number</code>
        * [.divisor](#Layout.divisor) : <code>number</code>

<a name="new_Layout_new"></a>

## new Layout(options)
Constructor


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> |  |  |
| [options.layout] | <code>string</code> | <code>&quot;&#x27;reflowable&#x27;&quot;</code> | values: `"reflowable"` OR `"pre-paginated"` |
| [options.spread] | <code>string</code> |  | values: `"none"` OR `"auto"` |
| [options.minSpreadWidth] | <code>number</code> | <code>800</code> |  |
| [options.evenSpreads] | <code>boolean</code> | <code>false</code> |  |

<a name="Layout+flow"></a>

## layout.flow(str) ⇒ <code>string</code>
Switch the flow between paginated and scrolled

**Kind**: instance method of [<code>Layout</code>](#Layout)  
**Returns**: <code>string</code> - Simplified flow  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | `"paginated"` OR `"scrolled"` |

<a name="Layout+spread"></a>

## layout.spread([spread], [min]) ⇒ <code>boolean</code>
Switch between using spreads or not, and set the
width at which they switch to single.

**Kind**: instance method of [<code>Layout</code>](#Layout)  
**Returns**: <code>boolean</code> - true OR false  

| Param | Type | Description |
| --- | --- | --- |
| [spread] | <code>string</code> | `"none"` OR `"always"` OR `"auto"` |
| [min] | <code>number</code> | integer in pixels |

<a name="Layout+calculate"></a>

## layout.calculate(width, height, [gap])
Calculate the dimensions of the pagination

**Kind**: instance method of [<code>Layout</code>](#Layout)  

| Param | Type | Description |
| --- | --- | --- |
| width | <code>number</code> | width of the rendering |
| height | <code>number</code> | height of the rendering |
| [gap] | <code>number</code> | width of the gap between columns |

<a name="Layout+format"></a>

## layout.format(contents) ⇒ <code>Promise</code>
Apply Css to a Document

**Kind**: instance method of [<code>Layout</code>](#Layout)  

| Param | Type |
| --- | --- |
| contents | <code>Contents</code> | 

<a name="Layout+count"></a>

## layout.count(totalLength, pageLength) ⇒ <code>Object</code>
Count number of pages

**Kind**: instance method of [<code>Layout</code>](#Layout)  

| Param | Type |
| --- | --- |
| totalLength | <code>number</code> | 
| pageLength | <code>number</code> | 

<a name="Layout.name"></a>

## Layout.name : <code>string</code>
Layout name

**Kind**: static property of [<code>Layout</code>](#Layout)  
**Access**: protected  
<a name="Layout.minSpreadWidth"></a>

## Layout.minSpreadWidth : <code>number</code>
**Kind**: static property of [<code>Layout</code>](#Layout)  
**Read only**: true  
<a name="Layout.evenSpreads"></a>

## Layout.evenSpreads : <code>boolean</code>
**Kind**: static property of [<code>Layout</code>](#Layout)  
**Readonlys**:   
<a name="Layout.width"></a>

## Layout.width : <code>number</code>
Layout width

**Kind**: static property of [<code>Layout</code>](#Layout)  
**Read only**: true  
<a name="Layout.height"></a>

## Layout.height : <code>number</code>
Layout height

**Kind**: static property of [<code>Layout</code>](#Layout)  
**Read only**: true  
<a name="Layout.spreadWidth"></a>

## Layout.spreadWidth : <code>number</code>
Spread width

**Kind**: static property of [<code>Layout</code>](#Layout)  
**Read only**: true  
<a name="Layout.delta"></a>

## Layout.delta : <code>number</code>
**Kind**: static property of [<code>Layout</code>](#Layout)  
**Read only**: true  
<a name="Layout.columnWidth"></a>

## Layout.columnWidth : <code>number</code>
Column width

**Kind**: static property of [<code>Layout</code>](#Layout)  
**Read only**: true  
<a name="Layout.gap"></a>

## Layout.gap : <code>number</code>
**Kind**: static property of [<code>Layout</code>](#Layout)  
**Read only**: true  
<a name="Layout.divisor"></a>

## Layout.divisor : <code>number</code>
**Kind**: static property of [<code>Layout</code>](#Layout)  
**Read only**: true  
