<a name="Snap"></a>

# Snap
Snap

**Kind**: global class  

* [Snap](#Snap)
    * [new Snap(manager, [options])](#new_Snap_new)
    * [.setup(manager)](#Snap+setup)
    * [.supportsTouch()](#Snap+supportsTouch) ⇒ <code>boolean</code>
    * [.wasSwiped()](#Snap+wasSwiped) ⇒ <code>number</code>
    * [.needsSnap()](#Snap+needsSnap) ⇒ <code>boolean</code>
    * [.snap([howMany])](#Snap+snap) ⇒ <code>Promise</code>
    * [.smoothScrollTo(destination)](#Snap+smoothScrollTo) ⇒ <code>Promise</code>
    * [.scrollTo([left], [top])](#Snap+scrollTo)
    * [.destroy()](#Snap+destroy) ⇒ <code>void</code>

<a name="new_Snap_new"></a>

## new Snap(manager, [options])
Constructor


| Param | Type | Default |
| --- | --- | --- |
| manager | <code>\*</code> |  | 
| [options] | <code>object</code> |  | 
| [options.duration] | <code>number</code> | <code>300</code> | 
| [options.minVelocity] | <code>number</code> | <code>0.2</code> | 
| [options.minDistance] | <code>number</code> | <code>10</code> | 

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
| destination | <code>number</code> | 

<a name="Snap+scrollTo"></a>

## snap.scrollTo([left], [top])
scrollTo

**Kind**: instance method of [<code>Snap</code>](#Snap)  

| Param | Type | Default |
| --- | --- | --- |
| [left] | <code>number</code> | <code>0</code> | 
| [top] | <code>number</code> | <code>0</code> | 

<a name="Snap+destroy"></a>

## snap.destroy() ⇒ <code>void</code>
destroy

**Kind**: instance method of [<code>Snap</code>](#Snap)  
