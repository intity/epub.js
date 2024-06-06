<a name="Annotations"></a>

# Annotations
Handles managing adding & removing Annotations

**Kind**: global class  

* [Annotations](#Annotations)
    * [new Annotations(rendition)](#new_Annotations_new)
    * [.append(type, cfiRange, [options])](#Annotations+append) ⇒ <code>Annotation</code>
    * [.remove(type, cfiRange)](#Annotations+remove)
    * [.highlight(cfiRange, [options])](#Annotations+highlight)
    * [.underline(cfiRange, [options])](#Annotations+underline)
    * [.show()](#Annotations+show)
    * [.hide()](#Annotations+hide)

<a name="new_Annotations_new"></a>

## new Annotations(rendition)
Constructor


| Param | Type |
| --- | --- |
| rendition | <code>Rendition</code> | 

<a name="Annotations+append"></a>

## annotations.append(type, cfiRange, [options]) ⇒ <code>Annotation</code>
Append an annotation to store

**Kind**: instance method of [<code>Annotations</code>](#Annotations)  
**Returns**: <code>Annotation</code> - Annotation that was append  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | Type of annotation to append: `"highlight"` OR `"underline"` |
| cfiRange | <code>string</code> | EpubCFI range to attach annotation to |
| [options] | <code>object</code> |  |
| [options.data] | <code>object</code> | Data to assign to annotation |
| [options.cb] | <code>method</code> | Callback after annotation is added |
| [options.className] | <code>string</code> | CSS class to assign to annotation |
| [options.styles] | <code>object</code> | CSS styles to assign to annotation |

<a name="Annotations+remove"></a>

## annotations.remove(type, cfiRange)
Remove an annotation from store

**Kind**: instance method of [<code>Annotations</code>](#Annotations)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | Type of annotation to remove: `"highlight"` OR `"underline"` |
| cfiRange | <code>string</code> | EpubCFI range to attach annotation to |

<a name="Annotations+highlight"></a>

## annotations.highlight(cfiRange, [options])
Add a highlight to the store

**Kind**: instance method of [<code>Annotations</code>](#Annotations)  

| Param | Type | Description |
| --- | --- | --- |
| cfiRange | <code>string</code> | EpubCFI range to attach annotation to |
| [options] | <code>object</code> |  |
| [options.data] | <code>object</code> | Data to assign to annotation |
| [options.cb] | <code>method</code> | Callback after annotation is clicked |
| [options.className] | <code>string</code> | CSS class to assign to annotation |
| [options.styles] | <code>object</code> | CSS styles to assign to annotation |

<a name="Annotations+underline"></a>

## annotations.underline(cfiRange, [options])
Add a underline to the store

**Kind**: instance method of [<code>Annotations</code>](#Annotations)  

| Param | Type | Description |
| --- | --- | --- |
| cfiRange | <code>string</code> | EpubCFI range to attach annotation to |
| [options] | <code>object</code> |  |
| [options.data] | <code>object</code> | Data to assign to annotation |
| [options.cb] | <code>method</code> | Callback after annotation is clicked |
| [options.className] | <code>string</code> | CSS class to assign to annotation |
| [options.styles] | <code>object</code> | CSS styles to assign to annotation |

<a name="Annotations+show"></a>

## annotations.show()
[Not Implemented] Show annotations

**Kind**: instance method of [<code>Annotations</code>](#Annotations)  
**Todo:**: needs implementation in View  
<a name="Annotations+hide"></a>

## annotations.hide()
[Not Implemented] Hide annotations

**Kind**: instance method of [<code>Annotations</code>](#Annotations)  
**Todo:**: needs implementation in View  
