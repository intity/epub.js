<a name="Layout"></a>

# Layout
Figures out the CSS values to apply for a layout

**Kind**: global class  

* [Layout](#Layout)
    * [new Layout(options)](#new_Layout_new)
    * _instance_
        * [.set(options)](#Layout+set)
        * [.calculate([width], [height], [gap])](#Layout+calculate)
        * [.format(contents, [section], [axis])](#Layout+format) ⇒ <code>Promise</code>
        * [.count(totalLength, [pageLength])](#Layout+count) ⇒ <code>Object</code>
    * _static_
        * [.name](#Layout.name) : <code>string</code>
        * [.flow](#Layout.flow) : <code>string</code>
        * [.spread](#Layout.spread) : <code>boolean</code>
        * [.direction](#Layout.direction) : <code>string</code>
        * [.orientation](#Layout.orientation) : <code>string</code>
        * [.viewport](#Layout.viewport) : <code>string</code>
        * [.minSpreadWidth](#Layout.minSpreadWidth) : <code>number</code>
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
| [options.name] | <code>string</code> | <code>&quot;&#x27;reflowable&#x27;&quot;</code> | values: `"reflowable"` OR `"pre-paginated"` |
| [options.flow] | <code>string</code> | <code>&quot;&#x27;paginated&#x27;&quot;</code> | values: `"paginated"` OR `"scrolled"` OR `"scrolled-doc"` |
| [options.spread] | <code>string</code> | <code>&quot;&#x27;auto&#x27;&quot;</code> | values: `"auto"` OR `"none"` |
| [options.direction] | <code>string</code> | <code>&quot;&#x27;ltr&#x27;&quot;</code> | values: `"ltr"` OR `"rtl"` |
| [options.orientation] | <code>string</code> | <code>&quot;&#x27;auto&#x27;&quot;</code> | values: `"auto"` OR `"landscape"` OR `"portrait"` |
| [options.minSpreadWidth] | <code>number</code> | <code>800</code> |  |

<a name="Layout+set"></a>

## layout.set(options)
Set options

**Kind**: instance method of [<code>Layout</code>](#Layout)  

| Param | Type |
| --- | --- |
| options | <code>object</code> | 

<a name="Layout+calculate"></a>

## layout.calculate([width], [height], [gap])
Calculate the dimensions of the pagination

**Kind**: instance method of [<code>Layout</code>](#Layout)  

| Param | Type | Description |
| --- | --- | --- |
| [width] | <code>number</code> | width of the rendering |
| [height] | <code>number</code> | height of the rendering |
| [gap] | <code>number</code> | width of the gap between columns |

<a name="Layout+format"></a>

## layout.format(contents, [section], [axis]) ⇒ <code>Promise</code>
Apply Css to a Document

**Kind**: instance method of [<code>Layout</code>](#Layout)  

| Param | Type |
| --- | --- |
| contents | <code>Contents</code> | 
| [section] | <code>Section</code> | 
| [axis] | <code>string</code> | 

<a name="Layout+count"></a>

## layout.count(totalLength, [pageLength]) ⇒ <code>Object</code>
Count number of pages

**Kind**: instance method of [<code>Layout</code>](#Layout)  

| Param | Type |
| --- | --- |
| totalLength | <code>number</code> | 
| [pageLength] | <code>number</code> | 

<a name="Layout.name"></a>

## Layout.name : <code>string</code>
Layout name

**Kind**: static property of [<code>Layout</code>](#Layout)  
**Access**: protected  
<a name="Layout.flow"></a>

## Layout.flow : <code>string</code>
**Kind**: static property of [<code>Layout</code>](#Layout)  
**Read only**: true  
<a name="Layout.spread"></a>

## Layout.spread : <code>boolean</code>
**Kind**: static property of [<code>Layout</code>](#Layout)  
**Read only**: true  
<a name="Layout.direction"></a>

## Layout.direction : <code>string</code>
**Kind**: static property of [<code>Layout</code>](#Layout)  
**Read only**: true  
<a name="Layout.orientation"></a>

## Layout.orientation : <code>string</code>
no implementation

**Kind**: static property of [<code>Layout</code>](#Layout)  
**Read only**: true  
<a name="Layout.viewport"></a>

## Layout.viewport : <code>string</code>
no implementation

**Kind**: static property of [<code>Layout</code>](#Layout)  
**Read only**: true  
<a name="Layout.minSpreadWidth"></a>

## Layout.minSpreadWidth : <code>number</code>
**Kind**: static property of [<code>Layout</code>](#Layout)  
**Read only**: true  
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
