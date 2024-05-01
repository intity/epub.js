<a name="Archive"></a>

# Archive
Handles Unzipping a requesting files from an Epub Archive

**Kind**: global class  

* [Archive](#Archive)
    * [.open(input, [isBase64])](#Archive+open) ⇒ <code>Promise</code>
    * [.openUrl(zipUrl, [isBase64])](#Archive+openUrl) ⇒ <code>Promise</code>
    * [.request(url, [type])](#Archive+request) ⇒ <code>Promise.&lt;(Blob\|string\|JSON\|Document\|XMLDocument)&gt;</code>
    * [.getBlob(url, [mimeType])](#Archive+getBlob) ⇒ <code>Blob</code>
    * [.getText(url, [encoding])](#Archive+getText) ⇒ <code>string</code>
    * [.getBase64(url, [mimeType])](#Archive+getBase64) ⇒ <code>string</code>
    * [.createUrl(url)](#Archive+createUrl) ⇒ <code>Promise</code>
    * [.revokeUrl(url)](#Archive+revokeUrl)

<a name="Archive+open"></a>

## archive.open(input, [isBase64]) ⇒ <code>Promise</code>
Open an archive

**Kind**: instance method of [<code>Archive</code>](#Archive)  
**Returns**: <code>Promise</code> - zipfile  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>binary</code> |  |
| [isBase64] | <code>boolean</code> | tells JSZip if the input data is base64 encoded |

<a name="Archive+openUrl"></a>

## archive.openUrl(zipUrl, [isBase64]) ⇒ <code>Promise</code>
Load and Open an archive

**Kind**: instance method of [<code>Archive</code>](#Archive)  
**Returns**: <code>Promise</code> - zipfile  

| Param | Type | Description |
| --- | --- | --- |
| zipUrl | <code>string</code> |  |
| [isBase64] | <code>boolean</code> | tells JSZip if the input data is base64 encoded |

<a name="Archive+request"></a>

## archive.request(url, [type]) ⇒ <code>Promise.&lt;(Blob\|string\|JSON\|Document\|XMLDocument)&gt;</code>
Request a url from the archive

**Kind**: instance method of [<code>Archive</code>](#Archive)  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | a url to request from the archive |
| [type] | <code>string</code> | specify the type of the returned result |

<a name="Archive+getBlob"></a>

## archive.getBlob(url, [mimeType]) ⇒ <code>Blob</code>
Get a Blob from Archive by Url

**Kind**: instance method of [<code>Archive</code>](#Archive)  

| Param | Type |
| --- | --- |
| url | <code>string</code> | 
| [mimeType] | <code>string</code> | 

<a name="Archive+getText"></a>

## archive.getText(url, [encoding]) ⇒ <code>string</code>
Get Text from Archive by Url

**Kind**: instance method of [<code>Archive</code>](#Archive)  

| Param | Type |
| --- | --- |
| url | <code>string</code> | 
| [encoding] | <code>string</code> | 

<a name="Archive+getBase64"></a>

## archive.getBase64(url, [mimeType]) ⇒ <code>string</code>
Get a base64 encoded result from Archive by Url

**Kind**: instance method of [<code>Archive</code>](#Archive)  
**Returns**: <code>string</code> - base64 encoded  

| Param | Type |
| --- | --- |
| url | <code>string</code> | 
| [mimeType] | <code>string</code> | 

<a name="Archive+createUrl"></a>

## archive.createUrl(url) ⇒ <code>Promise</code>
Create a Url from an unarchived item

**Kind**: instance method of [<code>Archive</code>](#Archive)  
**Returns**: <code>Promise</code> - url promise with Url string  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> |  |
| [options.base64] | <code>object</code> | use base64 encoding or blob url |

<a name="Archive+revokeUrl"></a>

## archive.revokeUrl(url)
Revoke Temp Url for a archive item

**Kind**: instance method of [<code>Archive</code>](#Archive)  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | url of the item in the archive |

