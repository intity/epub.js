<a name="proxyMouse"></a>

# proxyMouse(target, marks)
Start proxying all mouse events that occur on the target node to each node in
a set of tracked marks.

The marks in tracked do not strictly have to be DOM Nodes, but they do have
to have dispatchEvent, getBoundingClientRect, and getClientRects methods.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| target | <code>Node</code> | The node on which to listen for mouse events. |
| marks | <code>Array.&lt;Mark&gt;</code> | A (possibly mutable) array of marks to which to proxy events. |

