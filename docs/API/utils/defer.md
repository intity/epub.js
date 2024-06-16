<a name="Defer"></a>

# Defer
Creates a new pending promise and provides methods to resolve or reject it.

**Kind**: global class  

* [Defer](#Defer)
    * [.id](#Defer.id) : <code>string</code>
    * [.resolve](#Defer.resolve) : <code>method</code>
    * [.reject](#Defer.reject) : <code>method</code>
    * [.promise](#Defer.promise) : <code>Promise</code>

<a name="Defer.id"></a>

## Defer.id : <code>string</code>
**Kind**: static property of [<code>Defer</code>](#Defer)  
**Read only**: true  
<a name="Defer.resolve"></a>

## Defer.resolve : <code>method</code>
A method to resolve the associated Promise with the value passed.
If the promise is already settled it does nothing.

**Kind**: static property of [<code>Defer</code>](#Defer)  
**Read only**: true  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>anything</code> | : This value is used to resolve the promise If the value is a Promise then the associated promise assumes the state of Promise passed as value. |

<a name="Defer.reject"></a>

## Defer.reject : <code>method</code>
A method to reject the associated Promise with the value passed.
If the promise is already settled it does nothing.

**Kind**: static property of [<code>Defer</code>](#Defer)  
**Read only**: true  

| Param | Type | Description |
| --- | --- | --- |
| reason: | <code>anything</code> | The reason for the rejection of the Promise. Generally its an Error object. If however a Promise is passed, then the Promise itself will be the reason for rejection no matter the state of the Promise. |

<a name="Defer.promise"></a>

## Defer.promise : <code>Promise</code>
A newly created Pomise object.
Initially in pending state.

**Kind**: static property of [<code>Defer</code>](#Defer)  
**Read only**: true  
