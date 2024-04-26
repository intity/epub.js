<a name="Snap"></a>

# Snap
Snap

**Kind**: global class  

* [Snap](#Snap)
    * [new Snap(manager, options)](#new_Snap_new)
    * [.setup(manager)](#Snap+setup)
    * [.supportsTouch()](#Snap+supportsTouch) ⇒ <code>boolean</code>
    * [.disableScroll()](#Snap+disableScroll)
    * [.enableScroll()](#Snap+enableScroll)
    * [.addListeners()](#Snap+addListeners)
    * [.removeListeners()](#Snap+removeListeners)
    * [.afterDisplayed(view)](#Snap+afterDisplayed)
    * [.triggerViewEvent(e, contents)](#Snap+triggerViewEvent)
    * [.onScroll(e)](#Snap+onScroll)
    * [.onResize(e)](#Snap+onResize)
    * [.onTouchStart(e)](#Snap+onTouchStart)
    * [.onTouchMove(e)](#Snap+onTouchMove)
    * [.onTouchEnd(e)](#Snap+onTouchEnd)
    * [.wasSwiped()](#Snap+wasSwiped) ⇒ <code>number</code>
    * [.needsSnap()](#Snap+needsSnap) ⇒ <code>boolean</code>
    * [.snap([howMany])](#Snap+snap) ⇒ <code>Promise</code>
    * [.smoothScrollTo(destination)](#Snap+smoothScrollTo) ⇒ <code>Promise</code>
    * [.scrollTo([left], [top])](#Snap+scrollTo)
    * [.now()](#Snap+now) ⇒ <code>number</code>
    * [.destroy()](#Snap+destroy) ⇒ <code>void</code>

<a name="new_Snap_new"></a>

## new Snap(manager, options)

| Param | Type |
| --- | --- |
| manager | <code>\*</code> | 
| options | <code>object</code> | 

<a name="Snap+setup"></a>

## snap.setup(manager)
setup

**Kind**: instance method of [<code>Snap</code>](#Snap)  

| Param | Type |
| --- | --- |
| manager | <code>\*</code> | 

<a name="Snap+supportsTouch"></a>

## snap.supportsTouch() ⇒ <code>boolean</code>
supportsTouch

**Kind**: instance method of [<code>Snap</code>](#Snap)  
<a name="Snap+disableScroll"></a>

## snap.disableScroll()
disableScroll

**Kind**: instance method of [<code>Snap</code>](#Snap)  
<a name="Snap+enableScroll"></a>

## snap.enableScroll()
enableScroll

**Kind**: instance method of [<code>Snap</code>](#Snap)  
<a name="Snap+addListeners"></a>

## snap.addListeners()
addListeners

**Kind**: instance method of [<code>Snap</code>](#Snap)  
<a name="Snap+removeListeners"></a>

## snap.removeListeners()
removeListeners

**Kind**: instance method of [<code>Snap</code>](#Snap)  
<a name="Snap+afterDisplayed"></a>

## snap.afterDisplayed(view)
afterDisplayed

**Kind**: instance method of [<code>Snap</code>](#Snap)  

| Param | Type |
| --- | --- |
| view | <code>\*</code> | 

<a name="Snap+triggerViewEvent"></a>

## snap.triggerViewEvent(e, contents)
triggerViewEvent

**Kind**: instance method of [<code>Snap</code>](#Snap)  

| Param | Type |
| --- | --- |
| e | <code>\*</code> | 
| contents | <code>\*</code> | 

<a name="Snap+onScroll"></a>

## snap.onScroll(e)
onScroll

**Kind**: instance method of [<code>Snap</code>](#Snap)  

| Param | Type |
| --- | --- |
| e | <code>\*</code> | 

<a name="Snap+onResize"></a>

## snap.onResize(e)
onResize

**Kind**: instance method of [<code>Snap</code>](#Snap)  

| Param | Type |
| --- | --- |
| e | <code>\*</code> | 

<a name="Snap+onTouchStart"></a>

## snap.onTouchStart(e)
onTouchStart

**Kind**: instance method of [<code>Snap</code>](#Snap)  

| Param | Type |
| --- | --- |
| e | <code>\*</code> | 

<a name="Snap+onTouchMove"></a>

## snap.onTouchMove(e)
onTouchMove

**Kind**: instance method of [<code>Snap</code>](#Snap)  

| Param | Type |
| --- | --- |
| e | <code>\*</code> | 

<a name="Snap+onTouchEnd"></a>

## snap.onTouchEnd(e)
onTouchEnd

**Kind**: instance method of [<code>Snap</code>](#Snap)  

| Param | Type |
| --- | --- |
| e | <code>\*</code> | 

<a name="Snap+wasSwiped"></a>

## snap.wasSwiped() ⇒ <code>number</code>
wasSwiped

**Kind**: instance method of [<code>Snap</code>](#Snap)  
<a name="Snap+needsSnap"></a>

## snap.needsSnap() ⇒ <code>boolean</code>
needsSnap

**Kind**: instance method of [<code>Snap</code>](#Snap)  
<a name="Snap+snap"></a>

## snap.snap([howMany]) ⇒ <code>Promise</code>
snap

**Kind**: instance method of [<code>Snap</code>](#Snap)  

| Param | Type | Default |
| --- | --- | --- |
| [howMany] | <code>number</code> | <code>0</code> | 

<a name="Snap+smoothScrollTo"></a>

## snap.smoothScrollTo(destination) ⇒ <code>Promise</code>
smoothScrollTo

**Kind**: instance method of [<code>Snap</code>](#Snap)  

| Param | Type |
| --- | --- |
| destination | <code>\*</code> | 

<a name="Snap+scrollTo"></a>

## snap.scrollTo([left], [top])
scrollTo

**Kind**: instance method of [<code>Snap</code>](#Snap)  

| Param | Type | Default |
| --- | --- | --- |
| [left] | <code>number</code> | <code>0</code> | 
| [top] | <code>number</code> | <code>0</code> | 

<a name="Snap+now"></a>

## snap.now() ⇒ <code>number</code>
now

**Kind**: instance method of [<code>Snap</code>](#Snap)  
<a name="Snap+destroy"></a>

## snap.destroy() ⇒ <code>void</code>
destroy

**Kind**: instance method of [<code>Snap</code>](#Snap)  
