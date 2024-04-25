<a name="Mapping"></a>

## Mapping
Map text locations to CFI ranges

**Kind**: global class  

* [Mapping](#Mapping)
    * [new Mapping(layout, [direction], [axis], [dev])](#new_Mapping_new)
    * [.section()](#Mapping+section)
    * [.page(contents, cfiBase, start, end)](#Mapping+page)
    * [.axis(axis)](#Mapping+axis) ⇒ <code>boolean</code>

<a name="new_Mapping_new"></a>

### new Mapping(layout, [direction], [axis], [dev])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| layout | <code>Layout</code> |  | Layout to apply |
| [direction] | <code>string</code> | <code>&quot;\&quot;ltr\&quot;&quot;</code> | Text direction |
| [axis] | <code>string</code> | <code>&quot;\&quot;horizontal\&quot;&quot;</code> | vertical or horizontal axis |
| [dev] | <code>boolean</code> |  | toggle developer highlighting |

<a name="Mapping+section"></a>

### mapping.section()
Find CFI pairs for entire section at once

**Kind**: instance method of [<code>Mapping</code>](#Mapping)  
<a name="Mapping+page"></a>

### mapping.page(contents, cfiBase, start, end)
Find CFI pairs for a page

**Kind**: instance method of [<code>Mapping</code>](#Mapping)  

| Param | Type | Description |
| --- | --- | --- |
| contents | <code>Contents</code> | Contents from view |
| cfiBase | <code>string</code> | string of the base for a cfi |
| start | <code>number</code> | position to start at |
| end | <code>number</code> | position to end at |

<a name="Mapping+axis"></a>

### mapping.axis(axis) ⇒ <code>boolean</code>
Set the axis for mapping

**Kind**: instance method of [<code>Mapping</code>](#Mapping)  
**Returns**: <code>boolean</code> - is it horizontal?  

| Param | Type | Description |
| --- | --- | --- |
| axis | <code>string</code> | horizontal | vertical |

