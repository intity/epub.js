<a name="Themes"></a>

# Themes
Themes to apply to displayed content

**Kind**: global class  

* [Themes](#Themes)
    * [new Themes(rendition)](#new_Themes_new)
    * _instance_
        * [.register(args)](#Themes+register)
        * [.registerThemes(themes)](#Themes+registerThemes)
        * [.registerUrl(name, input)](#Themes+registerUrl)
        * [.registerRules(name, rules)](#Themes+registerRules)
        * [.select(name)](#Themes+select)
        * [.clear()](#Themes+clear)
        * [.appendRule(name, value, [priority])](#Themes+appendRule)
        * [.removeRule(name)](#Themes+removeRule)
        * [.removeRules()](#Themes+removeRules)
        * [.fontSize(size)](#Themes+fontSize)
        * [.font(f)](#Themes+font)
        * [.destroy()](#Themes+destroy)
    * _static_
        * [.current](#Themes.current) : <code>string</code>
        * [.rules](#Themes.rules) : <code>object</code>
        * ["selected" (name, theme)](#Themes.event_selected)
        * ["injected" (key, theme, contents)](#Themes.event_injected)
        * ["rejected" (key, theme, contents)](#Themes.event_rejected)

<a name="new_Themes_new"></a>

## new Themes(rendition)
Constructor


| Param | Type |
| --- | --- |
| rendition | <code>Rendition</code> | 

<a name="Themes+register"></a>

## themes.register(args)
Add themes to be used by a rendition

**Kind**: instance method of [<code>Themes</code>](#Themes)  

| Param | Type |
| --- | --- |
| args | <code>object</code> \| <code>Array.&lt;object&gt;</code> \| <code>string</code> | 

**Example**  
```js
register("light", "http://example.com/light.css")
```
**Example**  
```js
register("light", { body: { color: "purple"}})
```
**Example**  
```js
register({ light: {...}, dark: {...}})
```
<a name="Themes+registerThemes"></a>

## themes.registerThemes(themes)
Register themes object

**Kind**: instance method of [<code>Themes</code>](#Themes)  

| Param | Type |
| --- | --- |
| themes | <code>object</code> | 

<a name="Themes+registerUrl"></a>

## themes.registerUrl(name, input)
Register a url

**Kind**: instance method of [<code>Themes</code>](#Themes)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Theme name |
| input | <code>string</code> | URL string |

**Example**  
```js
registerUrl("light", "light.css")
```
**Example**  
```js
registerUrl("light", "http://example.com/light.css")
```
<a name="Themes+registerRules"></a>

## themes.registerRules(name, rules)
Register rule

**Kind**: instance method of [<code>Themes</code>](#Themes)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| rules | <code>object</code> | 

**Example**  
```js
registerRules("light", { body: { color: "purple"}})
```
<a name="Themes+select"></a>

## themes.select(name)
Use null to reject the current selected theme

**Kind**: instance method of [<code>Themes</code>](#Themes)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Theme name |

<a name="Themes+clear"></a>

## themes.clear()
Clear all themes

**Kind**: instance method of [<code>Themes</code>](#Themes)  
<a name="Themes+appendRule"></a>

## themes.appendRule(name, value, [priority])
Append rule

**Kind**: instance method of [<code>Themes</code>](#Themes)  

| Param | Type | Default |
| --- | --- | --- |
| name | <code>string</code> |  | 
| value | <code>string</code> |  | 
| [priority] | <code>boolean</code> | <code>false</code> | 

<a name="Themes+removeRule"></a>

## themes.removeRule(name)
Remove rule

**Kind**: instance method of [<code>Themes</code>](#Themes)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

<a name="Themes+removeRules"></a>

## themes.removeRules()
Remove all rules

**Kind**: instance method of [<code>Themes</code>](#Themes)  
<a name="Themes+fontSize"></a>

## themes.fontSize(size)
Adjust the font size of a rendition

**Kind**: instance method of [<code>Themes</code>](#Themes)  

| Param | Type |
| --- | --- |
| size | <code>number</code> | 

<a name="Themes+font"></a>

## themes.font(f)
Adjust the font-family of a rendition

**Kind**: instance method of [<code>Themes</code>](#Themes)  

| Param | Type |
| --- | --- |
| f | <code>string</code> | 

<a name="Themes+destroy"></a>

## themes.destroy()
destroy

**Kind**: instance method of [<code>Themes</code>](#Themes)  
<a name="Themes.current"></a>

## Themes.current : <code>string</code>
**Kind**: static property of [<code>Themes</code>](#Themes)  
**Read only**: true  
<a name="Themes.rules"></a>

## Themes.rules : <code>object</code>
Injected css rules

**Kind**: static property of [<code>Themes</code>](#Themes)  
**Read only**: true  
<a name="Themes.event_selected"></a>

## "selected" (name, theme)
Emit which occurs when theme is selected

**Kind**: event emitted by [<code>Themes</code>](#Themes)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Theme key |
| theme | <code>object</code> | Theme value |

<a name="Themes.event_injected"></a>

## "injected" (key, theme, contents)
Emit of injected a stylesheet into contents

**Kind**: event emitted by [<code>Themes</code>](#Themes)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | Theme key |
| theme | <code>object</code> | Theme value |
| contents | <code>Contents</code> |  |

<a name="Themes.event_rejected"></a>

## "rejected" (key, theme, contents)
Emit of rejected a stylesheet into contents

**Kind**: event emitted by [<code>Themes</code>](#Themes)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | Theme key |
| theme | <code>object</code> | Theme value |
| contents | <code>Contents</code> |  |

