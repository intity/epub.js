<a name="Spine"></a>

# Spine
A collection of Spine Items

**Kind**: global class  

* [Spine](#Spine)
    * _instance_
        * [.unpack(packege, resolver, canonical)](#Spine+unpack)
        * [.get([target])](#Spine+get) ⇒ <code>Section</code> \| <code>null</code>
        * [.each()](#Spine+each) ⇒ <code>method</code>
        * [.first()](#Spine+first) ⇒ <code>Section</code>
        * [.last()](#Spine+last) ⇒ <code>Section</code>
        * [.destroy()](#Spine+destroy)
    * _static_
        * [.hooks](#Spine.hooks) : <code>object</code>
        * [.loaded](#Spine.loaded) : <code>boolean</code>

<a name="Spine+unpack"></a>

## spine.unpack(packege, resolver, canonical)
Unpack items from a opf into spine items

**Kind**: instance method of [<code>Spine</code>](#Spine)  

| Param | Type | Description |
| --- | --- | --- |
| packege | <code>Packaging</code> |  |
| resolver | <code>method</code> | URL resolver |
| canonical | <code>method</code> | Resolve canonical url |

<a name="Spine+get"></a>

## spine.get([target]) ⇒ <code>Section</code> \| <code>null</code>
Get an item from the spine

**Kind**: instance method of [<code>Spine</code>](#Spine)  
**Returns**: <code>Section</code> \| <code>null</code> - section  

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

## spine.each() ⇒ <code>method</code>
Loop over the Sections in the Spine

**Kind**: instance method of [<code>Spine</code>](#Spine)  
**Returns**: <code>method</code> - forEach  
<a name="Spine+first"></a>

## spine.first() ⇒ <code>Section</code>
Find the first Section in the Spine

**Kind**: instance method of [<code>Spine</code>](#Spine)  
**Returns**: <code>Section</code> - first section  
<a name="Spine+last"></a>

## spine.last() ⇒ <code>Section</code>
Find the last Section in the Spine

**Kind**: instance method of [<code>Spine</code>](#Spine)  
**Returns**: <code>Section</code> - last section  
<a name="Spine+destroy"></a>

## spine.destroy()
destroy

**Kind**: instance method of [<code>Spine</code>](#Spine)  
<a name="Spine.hooks"></a>

## Spine.hooks : <code>object</code>
**Kind**: static property of [<code>Spine</code>](#Spine)  
**Read only**: true  
**Properties**

| Name | Type |
| --- | --- |
| content | <code>Hook</code> | 
| serialize | <code>Hook</code> | 

<a name="Spine.loaded"></a>

## Spine.loaded : <code>boolean</code>
**Kind**: static property of [<code>Spine</code>](#Spine)  
**Read only**: true  
