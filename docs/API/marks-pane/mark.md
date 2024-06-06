<a name="Mark"></a>

# Mark
Mark class

**Kind**: global class  

* [Mark](#Mark)
    * _instance_
        * [.bind(element, container)](#Mark+bind)
        * [.unbind()](#Mark+unbind) ⇒ <code>Node</code>
        * [.clear()](#Mark+clear)
        * *[.render()](#Mark+render)*
        * [.dispatchEvent(e)](#Mark+dispatchEvent)
        * [.getBoundingClientRect()](#Mark+getBoundingClientRect) ⇒ <code>DOMRect</code>
        * [.getClientRects()](#Mark+getClientRects) ⇒ <code>Array.&lt;object&gt;</code>
    * _static_
        * [.element](#Mark.element) : <code>Node</code>

<a name="Mark+bind"></a>

## mark.bind(element, container)
bind

**Kind**: instance method of [<code>Mark</code>](#Mark)  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>Node</code> | the mark container to rects |
| container | <code>Node</code> | the epub-view container |

<a name="Mark+unbind"></a>

## mark.unbind() ⇒ <code>Node</code>
unbind

**Kind**: instance method of [<code>Mark</code>](#Mark)  
<a name="Mark+clear"></a>

## mark.clear()
Clear the mark container

**Kind**: instance method of [<code>Mark</code>](#Mark)  
<a name="Mark+render"></a>

## *mark.render()*
render

**Kind**: instance abstract method of [<code>Mark</code>](#Mark)  
<a name="Mark+dispatchEvent"></a>

## mark.dispatchEvent(e)
Dispatch event

**Kind**: instance method of [<code>Mark</code>](#Mark)  

| Param | Type |
| --- | --- |
| e | <code>MouseEvent</code> | 

<a name="Mark+getBoundingClientRect"></a>

## mark.getBoundingClientRect() ⇒ <code>DOMRect</code>
Get bounding client rect

**Kind**: instance method of [<code>Mark</code>](#Mark)  
<a name="Mark+getClientRects"></a>

## mark.getClientRects() ⇒ <code>Array.&lt;object&gt;</code>
Get client rects

**Kind**: instance method of [<code>Mark</code>](#Mark)  
<a name="Mark.element"></a>

## Mark.element : <code>Node</code>
the mark container to rects

**Kind**: static property of [<code>Mark</code>](#Mark)  
**Read only**: true  
