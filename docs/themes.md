<a name="Themes"></a>

# Themes
Themes to apply to displayed content

**Kind**: global class  

* [Themes](#Themes)
    * [new Themes(rendition)](#new_Themes_new)
    * [.register()](#Themes+register)
    * [.default(theme)](#Themes+default)
    * [.registerThemes(themes)](#Themes+registerThemes)
    * [.registerCss(name, css)](#Themes+registerCss)
    * [.registerUrl(name, input)](#Themes+registerUrl)
    * [.registerRules(name, rules)](#Themes+registerRules)
    * [.select(name)](#Themes+select)
    * [.update(name)](#Themes+update)
    * [.inject(contents)](#Themes+inject)
    * [.add(name, contents)](#Themes+add)
    * [.override(name, value, priority)](#Themes+override)
    * [.overrides(content)](#Themes+overrides)
    * [.fontSize(size)](#Themes+fontSize)
    * [.font(f)](#Themes+font)

<a name="new_Themes_new"></a>

## new Themes(rendition)

| Param | Type |
| --- | --- |
| rendition | <code>Rendition</code> | 

<a name="Themes+register"></a>

## themes.register()
Add themes to be used by a rendition

**Kind**: instance method of [<code>Themes</code>](#Themes)  

| Param | Type |
| --- | --- |
|  | <code>object</code> \| <code>Array.&lt;object&gt;</code> \| <code>string</code> | 

**Example**  
```js
themes.register("light", "http://example.com/light.css")
```
**Example**  
```js
themes.register("light", { "body": { "color": "purple"}})
```
**Example**  
```js
themes.register({ "light" : {...}, "dark" : {...}})
```
<a name="Themes+default"></a>

## themes.default(theme)
Add a default theme to be used by a rendition

**Kind**: instance method of [<code>Themes</code>](#Themes)  

| Param | Type |
| --- | --- |
| theme | <code>object</code> \| <code>string</code> | 

**Example**  
```js
themes.register("http://example.com/default.css")
```
**Example**  
```js
themes.register({ "body": { "color": "purple"}})
```
<a name="Themes+registerThemes"></a>

## themes.registerThemes(themes)
Register themes object

**Kind**: instance method of [<code>Themes</code>](#Themes)  

| Param | Type |
| --- | --- |
| themes | <code>object</code> | 

<a name="Themes+registerCss"></a>

## themes.registerCss(name, css)
Register a theme by passing its css as string

**Kind**: instance method of [<code>Themes</code>](#Themes)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| css | <code>string</code> | 

<a name="Themes+registerUrl"></a>

## themes.registerUrl(name, input)
Register a url

**Kind**: instance method of [<code>Themes</code>](#Themes)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| input | <code>string</code> | 

<a name="Themes+registerRules"></a>

## themes.registerRules(name, rules)
Register rule

**Kind**: instance method of [<code>Themes</code>](#Themes)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| rules | <code>object</code> | 

<a name="Themes+select"></a>

## themes.select(name)
Select a theme

**Kind**: instance method of [<code>Themes</code>](#Themes)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

<a name="Themes+update"></a>

## themes.update(name)
Update a theme

**Kind**: instance method of [<code>Themes</code>](#Themes)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

<a name="Themes+inject"></a>

## themes.inject(contents)
Inject all themes into contents

**Kind**: instance method of [<code>Themes</code>](#Themes)  

| Param | Type |
| --- | --- |
| contents | <code>Contents</code> | 

<a name="Themes+add"></a>

## themes.add(name, contents)
Add Theme to contents

**Kind**: instance method of [<code>Themes</code>](#Themes)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| contents | <code>Contents</code> | 

<a name="Themes+override"></a>

## themes.override(name, value, priority)
Add override

**Kind**: instance method of [<code>Themes</code>](#Themes)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| value | <code>string</code> | 
| priority | <code>boolean</code> | 

<a name="Themes+overrides"></a>

## themes.overrides(content)
Add all overrides

**Kind**: instance method of [<code>Themes</code>](#Themes)  

| Param | Type |
| --- | --- |
| content | <code>Content</code> | 

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

