<a name="Resources"></a>

# Resources
Handle Package Resources

**Kind**: global class  

* [Resources](#Resources)
    * [new Resources(manifest, [options])](#new_Resources_new)
    * [.process(manifest)](#Resources+process)
    * [.createUrl(url)](#Resources+createUrl) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.replacements()](#Resources+replacements) ⇒ <code>Promise</code>
    * [.relativeTo(absoluteUri, [resolve])](#Resources+relativeTo) ⇒ <code>Array.&lt;string&gt;</code>
    * [.get(path)](#Resources+get) ⇒ <code>string</code> \| <code>null</code>
    * [.substitute(content, [url])](#Resources+substitute) ⇒ <code>string</code>
    * [.destroy()](#Resources+destroy)

<a name="new_Resources_new"></a>

## new Resources(manifest, [options])
Constructor


| Param | Type | Default |
| --- | --- | --- |
| manifest | <code>Manifest</code> |  | 
| [options] | <code>object</code> |  | 
| [options.archive] | <code>Archive</code> |  | 
| [options.request] | <code>method</code> |  | 
| [options.resolve] | <code>method</code> |  | 
| [options.replacements] | <code>string</code> | <code>&quot;&#x27;base64&#x27;&quot;</code> | 

<a name="Resources+process"></a>

## resources.process(manifest)
Process resources

**Kind**: instance method of [<code>Resources</code>](#Resources)  

| Param | Type |
| --- | --- |
| manifest | <code>Manifest</code> | 

<a name="Resources+createUrl"></a>

## resources.createUrl(url) ⇒ <code>Promise.&lt;string&gt;</code>
Create a url to a resource

**Kind**: instance method of [<code>Resources</code>](#Resources)  
**Returns**: <code>Promise.&lt;string&gt;</code> - Promise resolves with url string  

| Param | Type |
| --- | --- |
| url | <code>string</code> | 

<a name="Resources+replacements"></a>

## resources.replacements() ⇒ <code>Promise</code>
Create blob urls for all the assets

**Kind**: instance method of [<code>Resources</code>](#Resources)  
**Returns**: <code>Promise</code> - returns replacement urls  
<a name="Resources+relativeTo"></a>

## resources.relativeTo(absoluteUri, [resolve]) ⇒ <code>Array.&lt;string&gt;</code>
Resolve all resources URLs relative to an absolute URL

**Kind**: instance method of [<code>Resources</code>](#Resources)  
**Returns**: <code>Array.&lt;string&gt;</code> - array with relative Urls  

| Param | Type | Description |
| --- | --- | --- |
| absoluteUri | <code>string</code> | to be resolved to |
| [resolve] | <code>method</code> |  |

<a name="Resources+get"></a>

## resources.get(path) ⇒ <code>string</code> \| <code>null</code>
Get a URL for a resource

**Kind**: instance method of [<code>Resources</code>](#Resources)  
**Returns**: <code>string</code> \| <code>null</code> - url  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 

<a name="Resources+substitute"></a>

## resources.substitute(content, [url]) ⇒ <code>string</code>
Substitute urls in content, with replacements,
relative to a url if provided

**Kind**: instance method of [<code>Resources</code>](#Resources)  
**Returns**: <code>string</code> - content with urls substituted  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>string</code> |  |
| [url] | <code>string</code> | url to resolve to |

<a name="Resources+destroy"></a>

## resources.destroy()
destroy

**Kind**: instance method of [<code>Resources</code>](#Resources)  
