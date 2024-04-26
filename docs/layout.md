<a name="Layout"></a>

# Layout
Figures out the CSS values to apply for a layout

**Kind**: global class  

* [Layout](#Layout)
    * [new Layout(settings)](#new_Layout_new)
    * [.flow(flow)](#Layout+flow) ⇒ <code>string</code>
    * [.spread(spread, min)](#Layout+spread) ⇒ <code>boolean</code>
    * [.calculate(_width, _height, _gap)](#Layout+calculate)
    * [.format(contents)](#Layout+format) ⇒ <code>Promise</code>
    * [.count(totalLength, pageLength)](#Layout+count) ⇒ <code>Object</code>

<a name="new_Layout_new"></a>

## new Layout(settings)

| Param | Type | Default |
| --- | --- | --- |
| settings | <code>object</code> |  | 
| [settings.layout] | <code>string</code> | <code>&quot;&#x27;reflowable&#x27;&quot;</code> | 
| [settings.spread] | <code>string</code> |  | 
| [settings.minSpreadWidth] | <code>number</code> | <code>800</code> | 
| [settings.evenSpreads] | <code>boolean</code> | <code>false</code> | 

<a name="Layout+flow"></a>

## layout.flow(flow) ⇒ <code>string</code>
Switch the flow between paginated and scrolled

**Kind**: instance method of [<code>Layout</code>](#Layout)  
**Returns**: <code>string</code> - simplified flow  

| Param | Type | Description |
| --- | --- | --- |
| flow | <code>string</code> | paginated | scrolled |

<a name="Layout+spread"></a>

## layout.spread(spread, min) ⇒ <code>boolean</code>
Switch between using spreads or not, and set the
width at which they switch to single.

**Kind**: instance method of [<code>Layout</code>](#Layout)  
**Returns**: <code>boolean</code> - spread true | false  

| Param | Type | Description |
| --- | --- | --- |
| spread | <code>string</code> | "none" | "always" | "auto" |
| min | <code>number</code> | integer in pixels |

<a name="Layout+calculate"></a>

## layout.calculate(_width, _height, _gap)
Calculate the dimensions of the pagination

**Kind**: instance method of [<code>Layout</code>](#Layout)  

| Param | Type | Description |
| --- | --- | --- |
| _width | <code>number</code> | width of the rendering |
| _height | <code>number</code> | height of the rendering |
| _gap | <code>number</code> | width of the gap between columns |

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

