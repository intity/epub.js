<a name="Spine"></a>

## Spine
A collection of Spine Items

**Kind**: global class  

* [Spine](#Spine)
    * [.unpack(_package, resolver, canonical)](#Spine+unpack)
    * [.get([target])](#Spine+get) ⇒ <code>Section</code>
    * [.each()](#Spine+each) ⇒ <code>method</code>
    * [.first()](#Spine+first) ⇒ <code>Section</code>
    * [.last()](#Spine+last) ⇒ <code>Section</code>

<a name="Spine+unpack"></a>

### spine.unpack(_package, resolver, canonical)
Unpack items from a opf into spine items

**Kind**: instance method of [<code>Spine</code>](#Spine)  

| Param | Type | Description |
| --- | --- | --- |
| _package | <code>Packaging</code> |  |
| resolver | <code>method</code> | URL resolver |
| canonical | <code>method</code> | Resolve canonical url |

<a name="Spine+get"></a>

### spine.get([target]) ⇒ <code>Section</code>
Get an item from the spine

**Kind**: instance method of [<code>Spine</code>](#Spine)  
**Returns**: <code>Section</code> - section  

| Param | Type |
| --- | --- |
| [target] | <code>string</code> \| <code>number</code> | 

**Example**  
```js
spine.get();
```
**Example**  
```js
spine.get(1);
```
**Example**  
```js
spine.get("chap1.html");
```
**Example**  
```js
spine.get("#id1234");
```
<a name="Spine+each"></a>

### spine.each() ⇒ <code>method</code>
Loop over the Sections in the Spine

**Kind**: instance method of [<code>Spine</code>](#Spine)  
**Returns**: <code>method</code> - forEach  
<a name="Spine+first"></a>

### spine.first() ⇒ <code>Section</code>
Find the first Section in the Spine

**Kind**: instance method of [<code>Spine</code>](#Spine)  
**Returns**: <code>Section</code> - first section  
<a name="Spine+last"></a>

### spine.last() ⇒ <code>Section</code>
Find the last Section in the Spine

**Kind**: instance method of [<code>Spine</code>](#Spine)  
**Returns**: <code>Section</code> - last section  
