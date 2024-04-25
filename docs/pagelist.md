<a name="PageList"></a>

## PageList
Page List Parser

**Kind**: global class  

* [PageList](#PageList)
    * [new PageList([xml])](#new_PageList_new)
    * [.parse(xml)](#PageList+parse)
    * [.pageFromCfi(cfi)](#PageList+pageFromCfi) ⇒ <code>number</code>
    * [.cfiFromPage(pg)](#PageList+cfiFromPage) ⇒ <code>string</code>
    * [.pageFromPercentage(percent)](#PageList+pageFromPercentage) ⇒ <code>number</code>
    * [.percentageFromPage(pg)](#PageList+percentageFromPage) ⇒ <code>number</code>
    * [.percentageFromCfi(cfi)](#PageList+percentageFromCfi) ⇒ <code>number</code>
    * [.destroy()](#PageList+destroy)

<a name="new_PageList_new"></a>

### new PageList([xml])

| Param | Type |
| --- | --- |
| [xml] | <code>document</code> | 

<a name="PageList+parse"></a>

### pageList.parse(xml)
Parse PageList Xml

**Kind**: instance method of [<code>PageList</code>](#PageList)  

| Param | Type |
| --- | --- |
| xml | <code>document</code> | 

<a name="PageList+pageFromCfi"></a>

### pageList.pageFromCfi(cfi) ⇒ <code>number</code>
Get a PageList result from a EpubCFI

**Kind**: instance method of [<code>PageList</code>](#PageList)  
**Returns**: <code>number</code> - page  

| Param | Type | Description |
| --- | --- | --- |
| cfi | <code>string</code> | EpubCFI String |

<a name="PageList+cfiFromPage"></a>

### pageList.cfiFromPage(pg) ⇒ <code>string</code>
Get an EpubCFI from a Page List Item

**Kind**: instance method of [<code>PageList</code>](#PageList)  
**Returns**: <code>string</code> - cfi  

| Param | Type |
| --- | --- |
| pg | <code>string</code> \| <code>number</code> | 

<a name="PageList+pageFromPercentage"></a>

### pageList.pageFromPercentage(percent) ⇒ <code>number</code>
Get a Page from Book percentage

**Kind**: instance method of [<code>PageList</code>](#PageList)  
**Returns**: <code>number</code> - page  

| Param | Type |
| --- | --- |
| percent | <code>number</code> | 

<a name="PageList+percentageFromPage"></a>

### pageList.percentageFromPage(pg) ⇒ <code>number</code>
Returns a value between 0 - 1 corresponding to the location of a page

**Kind**: instance method of [<code>PageList</code>](#PageList)  
**Returns**: <code>number</code> - percentage  

| Param | Type | Description |
| --- | --- | --- |
| pg | <code>number</code> | the page |

<a name="PageList+percentageFromCfi"></a>

### pageList.percentageFromCfi(cfi) ⇒ <code>number</code>
Returns a value between 0 - 1 corresponding to the location of a cfi

**Kind**: instance method of [<code>PageList</code>](#PageList)  
**Returns**: <code>number</code> - percentage  

| Param | Type | Description |
| --- | --- | --- |
| cfi | <code>string</code> | EpubCFI String |

<a name="PageList+destroy"></a>

### pageList.destroy()
Destroy

**Kind**: instance method of [<code>PageList</code>](#PageList)  
