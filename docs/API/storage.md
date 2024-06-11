<a name="Storage"></a>

# Storage
Handles saving and requesting files from local storage

**Kind**: global class  

* [Storage](#Storage)
    * [new Storage(name, [requester], [resolver])](#new_Storage_new)
    * _instance_
        * [.add(resources, [force])](#Storage+add) ⇒ <code>Promise.&lt;object&gt;</code>
        * [.put(url, [withCredentials], [headers])](#Storage+put) ⇒ <code>Promise.&lt;Blob&gt;</code>
        * [.request(url, [type], [withCredentials], [headers])](#Storage+request) ⇒ <code>Promise.&lt;(Blob\|string\|JSON\|Document\|XMLDocument)&gt;</code>
        * [.retrieve(url, [type])](#Storage+retrieve) ⇒ <code>Promise.&lt;(Blob\|string\|JSON\|Document\|XMLDocument)&gt;</code>
        * [.getBlob(url, [mimeType])](#Storage+getBlob) ⇒ <code>Blob</code>
        * [.getText(url, [mimeType])](#Storage+getText) ⇒ <code>string</code>
        * [.getBase64(url, [mimeType])](#Storage+getBase64) ⇒ <code>string</code>
        * [.createUrl(url)](#Storage+createUrl) ⇒ <code>Promise</code>
        * [.revokeUrl(url)](#Storage+revokeUrl)
        * [.destroy()](#Storage+destroy)
    * _static_
        * [.online](#Storage.online) : <code>boolean</code>

<a name="new_Storage_new"></a>

## new Storage(name, [requester], [resolver])
Constructor


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | This should be the name of the application for modals |
| [requester] | <code>method</code> |  |
| [resolver] | <code>method</code> |  |

<a name="Storage+add"></a>

## storage.add(resources, [force]) ⇒ <code>Promise.&lt;object&gt;</code>
Add all of a book resources to the store

**Kind**: instance method of [<code>Storage</code>](#Storage)  
**Returns**: <code>Promise.&lt;object&gt;</code> - store objects  

| Param | Type | Description |
| --- | --- | --- |
| resources | <code>Resources</code> | book resources |
| [force] | <code>boolean</code> | force resaving resources |

<a name="Storage+put"></a>

## storage.put(url, [withCredentials], [headers]) ⇒ <code>Promise.&lt;Blob&gt;</code>
Put binary data from a url to storage

**Kind**: instance method of [<code>Storage</code>](#Storage)  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | a url to request from storage |
| [withCredentials] | <code>boolean</code> |  |
| [headers] | <code>object</code> |  |

<a name="Storage+request"></a>

## storage.request(url, [type], [withCredentials], [headers]) ⇒ <code>Promise.&lt;(Blob\|string\|JSON\|Document\|XMLDocument)&gt;</code>
Request a url

**Kind**: instance method of [<code>Storage</code>](#Storage)  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | a url to request from storage |
| [type] | <code>string</code> | specify the type of the returned result |
| [withCredentials] | <code>boolean</code> |  |
| [headers] | <code>object</code> |  |

<a name="Storage+retrieve"></a>

## storage.retrieve(url, [type]) ⇒ <code>Promise.&lt;(Blob\|string\|JSON\|Document\|XMLDocument)&gt;</code>
Request a url from storage

**Kind**: instance method of [<code>Storage</code>](#Storage)  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | a url to request from storage |
| [type] | <code>string</code> | specify the type of the returned result |

<a name="Storage+getBlob"></a>

## storage.getBlob(url, [mimeType]) ⇒ <code>Blob</code>
Get a Blob from Storage by Url

**Kind**: instance method of [<code>Storage</code>](#Storage)  

| Param | Type |
| --- | --- |
| url | <code>string</code> | 
| [mimeType] | <code>string</code> | 

<a name="Storage+getText"></a>

## storage.getText(url, [mimeType]) ⇒ <code>string</code>
Get Text from Storage by Url

**Kind**: instance method of [<code>Storage</code>](#Storage)  

| Param | Type |
| --- | --- |
| url | <code>string</code> | 
| [mimeType] | <code>string</code> | 

<a name="Storage+getBase64"></a>

## storage.getBase64(url, [mimeType]) ⇒ <code>string</code>
Get a base64 encoded result from Storage by Url

**Kind**: instance method of [<code>Storage</code>](#Storage)  
**Returns**: <code>string</code> - base64 encoded  

| Param | Type |
| --- | --- |
| url | <code>string</code> | 
| [mimeType] | <code>string</code> | 

<a name="Storage+createUrl"></a>

## storage.createUrl(url) ⇒ <code>Promise</code>
Create a Url from a stored item

**Kind**: instance method of [<code>Storage</code>](#Storage)  
**Returns**: <code>Promise</code> - url promise with Url string  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> |  |
| [options.base64] | <code>object</code> | use base64 encoding or blob url |

<a name="Storage+revokeUrl"></a>

## storage.revokeUrl(url)
Revoke Temp Url for a archive item

**Kind**: instance method of [<code>Storage</code>](#Storage)  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | url of the item in the store |

<a name="Storage+destroy"></a>

## storage.destroy()
destroy

**Kind**: instance method of [<code>Storage</code>](#Storage)  
<a name="Storage.online"></a>

## Storage.online : <code>boolean</code>
Current status

**Kind**: static property of [<code>Storage</code>](#Storage)  
**Read only**: true  
