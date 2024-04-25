<a name="Store"></a>

## Store
Handles saving and requesting files from local storage

**Kind**: global class  

* [Store](#Store)
    * [new Store(name, [requester], [resolver])](#new_Store_new)
    * [.add(resources, [force])](#Store+add) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.put(url, [withCredentials], [headers])](#Store+put) ⇒ <code>Promise.&lt;Blob&gt;</code>
    * [.request(url, [type], [withCredentials], [headers])](#Store+request) ⇒ <code>Promise.&lt;(Blob\|string\|JSON\|Document\|XMLDocument)&gt;</code>
    * [.retrieve(url, [type])](#Store+retrieve) ⇒ <code>Promise.&lt;(Blob\|string\|JSON\|Document\|XMLDocument)&gt;</code>
    * [.getBlob(url, [mimeType])](#Store+getBlob) ⇒ <code>Blob</code>
    * [.getText(url, [mimeType])](#Store+getText) ⇒ <code>string</code>
    * [.getBase64(url, [mimeType])](#Store+getBase64) ⇒ <code>string</code>
    * [.createUrl(url)](#Store+createUrl) ⇒ <code>Promise</code>
    * [.revokeUrl(url)](#Store+revokeUrl)

<a name="new_Store_new"></a>

### new Store(name, [requester], [resolver])

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | This should be the name of the application for modals |
| [requester] | <code>function</code> |  |
| [resolver] | <code>function</code> |  |

<a name="Store+add"></a>

### store.add(resources, [force]) ⇒ <code>Promise.&lt;object&gt;</code>
Add all of a book resources to the store

**Kind**: instance method of [<code>Store</code>](#Store)  
**Returns**: <code>Promise.&lt;object&gt;</code> - store objects  

| Param | Type | Description |
| --- | --- | --- |
| resources | <code>Resources</code> | book resources |
| [force] | <code>boolean</code> | force resaving resources |

<a name="Store+put"></a>

### store.put(url, [withCredentials], [headers]) ⇒ <code>Promise.&lt;Blob&gt;</code>
Put binary data from a url to storage

**Kind**: instance method of [<code>Store</code>](#Store)  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | a url to request from storage |
| [withCredentials] | <code>boolean</code> |  |
| [headers] | <code>object</code> |  |

<a name="Store+request"></a>

### store.request(url, [type], [withCredentials], [headers]) ⇒ <code>Promise.&lt;(Blob\|string\|JSON\|Document\|XMLDocument)&gt;</code>
Request a url

**Kind**: instance method of [<code>Store</code>](#Store)  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | a url to request from storage |
| [type] | <code>string</code> | specify the type of the returned result |
| [withCredentials] | <code>boolean</code> |  |
| [headers] | <code>object</code> |  |

<a name="Store+retrieve"></a>

### store.retrieve(url, [type]) ⇒ <code>Promise.&lt;(Blob\|string\|JSON\|Document\|XMLDocument)&gt;</code>
Request a url from storage

**Kind**: instance method of [<code>Store</code>](#Store)  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | a url to request from storage |
| [type] | <code>string</code> | specify the type of the returned result |

<a name="Store+getBlob"></a>

### store.getBlob(url, [mimeType]) ⇒ <code>Blob</code>
Get a Blob from Storage by Url

**Kind**: instance method of [<code>Store</code>](#Store)  

| Param | Type |
| --- | --- |
| url | <code>string</code> | 
| [mimeType] | <code>string</code> | 

<a name="Store+getText"></a>

### store.getText(url, [mimeType]) ⇒ <code>string</code>
Get Text from Storage by Url

**Kind**: instance method of [<code>Store</code>](#Store)  

| Param | Type |
| --- | --- |
| url | <code>string</code> | 
| [mimeType] | <code>string</code> | 

<a name="Store+getBase64"></a>

### store.getBase64(url, [mimeType]) ⇒ <code>string</code>
Get a base64 encoded result from Storage by Url

**Kind**: instance method of [<code>Store</code>](#Store)  
**Returns**: <code>string</code> - base64 encoded  

| Param | Type |
| --- | --- |
| url | <code>string</code> | 
| [mimeType] | <code>string</code> | 

<a name="Store+createUrl"></a>

### store.createUrl(url) ⇒ <code>Promise</code>
Create a Url from a stored item

**Kind**: instance method of [<code>Store</code>](#Store)  
**Returns**: <code>Promise</code> - url promise with Url string  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> |  |
| [options.base64] | <code>object</code> | use base64 encoding or blob url |

<a name="Store+revokeUrl"></a>

### store.revokeUrl(url)
Revoke Temp Url for a archive item

**Kind**: instance method of [<code>Store</code>](#Store)  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | url of the item in the store |

