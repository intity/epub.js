## Classes

<dl>
<dt><a href="#Annotations">Annotations</a></dt>
<dd><p>Handles managing adding &amp; removing Annotations</p>
</dd>
<dt><a href="#Annotation">Annotation</a></dt>
<dd><p>Annotation object</p>
</dd>
</dl>

<a name="Annotations"></a>

## Annotations
Handles managing adding & removing Annotations

**Kind**: global class  

* [Annotations](#Annotations)
    * [new Annotations(rendition)](#new_Annotations_new)
    * [.add(type, cfiRange, data, [cb], className, styles)](#Annotations+add) ⇒ [<code>Annotation</code>](#Annotation)
    * [.remove(cfiRange, type)](#Annotations+remove)
    * [.highlight(cfiRange, data, cb, className, styles)](#Annotations+highlight)
    * [.underline(cfiRange, data, cb, className, styles)](#Annotations+underline)
    * [.mark(cfiRange, data, cb)](#Annotations+mark)
    * [.each()](#Annotations+each)
    * [.show()](#Annotations+show)
    * [.hide()](#Annotations+hide)

<a name="new_Annotations_new"></a>

### new Annotations(rendition)

| Param | Type |
| --- | --- |
| rendition | <code>Rendition</code> | 

<a name="Annotations+add"></a>

### annotations.add(type, cfiRange, data, [cb], className, styles) ⇒ [<code>Annotation</code>](#Annotation)
Add an annotation to store

**Kind**: instance method of [<code>Annotations</code>](#Annotations)  
**Returns**: [<code>Annotation</code>](#Annotation) - annotation  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | Type of annotation to add: "highlight", "underline", "mark" |
| cfiRange | <code>EpubCFI</code> | EpubCFI range to attach annotation to |
| data | <code>object</code> | Data to assign to annotation |
| [cb] | <code>function</code> | Callback after annotation is added |
| className | <code>string</code> | CSS class to assign to annotation |
| styles | <code>object</code> | CSS styles to assign to annotation |

<a name="Annotations+remove"></a>

### annotations.remove(cfiRange, type)
Remove an annotation from store

**Kind**: instance method of [<code>Annotations</code>](#Annotations)  

| Param | Type | Description |
| --- | --- | --- |
| cfiRange | <code>EpubCFI</code> | EpubCFI range the annotation is attached to |
| type | <code>string</code> | Type of annotation to add: "highlight", "underline", "mark" |

<a name="Annotations+highlight"></a>

### annotations.highlight(cfiRange, data, cb, className, styles)
Add a highlight to the store

**Kind**: instance method of [<code>Annotations</code>](#Annotations)  

| Param | Type | Description |
| --- | --- | --- |
| cfiRange | <code>EpubCFI</code> | EpubCFI range to attach annotation to |
| data | <code>object</code> | Data to assign to annotation |
| cb | <code>function</code> | Callback after annotation is clicked |
| className | <code>string</code> | CSS class to assign to annotation |
| styles | <code>object</code> | CSS styles to assign to annotation |

<a name="Annotations+underline"></a>

### annotations.underline(cfiRange, data, cb, className, styles)
Add a underline to the store

**Kind**: instance method of [<code>Annotations</code>](#Annotations)  

| Param | Type | Description |
| --- | --- | --- |
| cfiRange | <code>EpubCFI</code> | EpubCFI range to attach annotation to |
| data | <code>object</code> | Data to assign to annotation |
| cb | <code>function</code> | Callback after annotation is clicked |
| className | <code>string</code> | CSS class to assign to annotation |
| styles | <code>object</code> | CSS styles to assign to annotation |

<a name="Annotations+mark"></a>

### annotations.mark(cfiRange, data, cb)
Add a mark to the store

**Kind**: instance method of [<code>Annotations</code>](#Annotations)  

| Param | Type | Description |
| --- | --- | --- |
| cfiRange | <code>EpubCFI</code> | EpubCFI range to attach annotation to |
| data | <code>object</code> | Data to assign to annotation |
| cb | <code>function</code> | Callback after annotation is clicked |

<a name="Annotations+each"></a>

### annotations.each()
iterate over annotations in the store

**Kind**: instance method of [<code>Annotations</code>](#Annotations)  
<a name="Annotations+show"></a>

### annotations.show()
[Not Implemented] Show annotations

**Kind**: instance method of [<code>Annotations</code>](#Annotations)  
**Todo:**: needs implementation in View  
<a name="Annotations+hide"></a>

### annotations.hide()
[Not Implemented] Hide annotations

**Kind**: instance method of [<code>Annotations</code>](#Annotations)  
**Todo:**: needs implementation in View  
<a name="Annotation"></a>

## Annotation
Annotation object

**Kind**: global class  

* [Annotation](#Annotation)
    * [new Annotation(options, className, styles)](#new_Annotation_new)
    * [.update(data)](#Annotation+update)
    * [.attach(view)](#Annotation+attach)
    * [.detach(view)](#Annotation+detach)
    * [.text()](#Annotation+text)

<a name="new_Annotation_new"></a>

### new Annotation(options, className, styles)
**Returns**: [<code>Annotation</code>](#Annotation) - annotation  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| options.type | <code>string</code> | Type of annotation to add: "highlight", "underline", "mark" |
| options.cfiRange | <code>EpubCFI</code> | EpubCFI range to attach annotation to |
| options.data | <code>object</code> | Data to assign to annotation |
| options.sectionIndex | <code>int</code> | Index in the Spine of the Section annotation belongs to |
| [options.cb] | <code>function</code> | Callback after annotation is clicked |
| className | <code>string</code> | CSS class to assign to annotation |
| styles | <code>object</code> | CSS styles to assign to annotation |

<a name="Annotation+update"></a>

### annotation.update(data)
Update stored data

**Kind**: instance method of [<code>Annotation</code>](#Annotation)  

| Param | Type |
| --- | --- |
| data | <code>object</code> | 

<a name="Annotation+attach"></a>

### annotation.attach(view)
Add to a view

**Kind**: instance method of [<code>Annotation</code>](#Annotation)  

| Param | Type |
| --- | --- |
| view | <code>View</code> | 

<a name="Annotation+detach"></a>

### annotation.detach(view)
Remove from a view

**Kind**: instance method of [<code>Annotation</code>](#Annotation)  

| Param | Type |
| --- | --- |
| view | <code>View</code> | 

<a name="Annotation+text"></a>

### annotation.text()
[Not Implemented] Get text of an annotation

**Kind**: instance method of [<code>Annotation</code>](#Annotation)  
**Todo:**: needs implementation in contents  
