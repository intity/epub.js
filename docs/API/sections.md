<a name="Sections"></a>

# Sections
Sections class

**Kind**: global class  

* [Sections](#Sections)
    * [.get([target])](#Sections+get) ⇒ <code>Section</code> \| <code>null</code>
    * [.first()](#Sections+first) ⇒ <code>Section</code>
    * [.last()](#Sections+last) ⇒ <code>Section</code>
    * [.unpack(packaging, resolve, canonical)](#Sections+unpack)
    * [.each()](#Sections+each) ⇒ <code>method</code>

<a name="Sections+get"></a>

## sections.get([target]) ⇒ <code>Section</code> \| <code>null</code>
Get an item from the spine

**Kind**: instance method of [<code>Sections</code>](#Sections)  
**Returns**: <code>Section</code> \| <code>null</code> - section  

| Param | Type |
| --- | --- |
| [target] | <code>string</code> \| <code>number</code> | 

**Example**  
```js
sections.get();
```
**Example**  
```js
sections.get(1);
```
**Example**  
```js
sections.get("chap1.html");
```
**Example**  
```js
sections.get("#id1234");
```
<a name="Sections+first"></a>

## sections.first() ⇒ <code>Section</code>
Find the first Section in the Spine

**Kind**: instance method of [<code>Sections</code>](#Sections)  
**Returns**: <code>Section</code> - first section  
<a name="Sections+last"></a>

## sections.last() ⇒ <code>Section</code>
Find the last Section in the Spine

**Kind**: instance method of [<code>Sections</code>](#Sections)  
**Returns**: <code>Section</code> - last section  
<a name="Sections+unpack"></a>

## sections.unpack(packaging, resolve, canonical)
Unpack items from a opf into spine items

**Kind**: instance method of [<code>Sections</code>](#Sections)  

| Param | Type | Description |
| --- | --- | --- |
| packaging | <code>Packaging</code> |  |
| resolve | <code>method</code> | URL resolve |
| canonical | <code>method</code> | Resolve canonical url |

<a name="Sections+each"></a>

## sections.each() ⇒ <code>method</code>
Loop over the Sections in the Spine

**Kind**: instance method of [<code>Sections</code>](#Sections)  
**Returns**: <code>method</code> - forEach  
