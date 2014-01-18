# promise-using

A resource management library for Bluebird.

# example


```js

var using = require('promise-using');

function doWithResources(something) {
    return using(connectTo(src), connectTo(dst), function(src, dst) {
        return src.callApi().then(function(res) {
            return dst.writeApi(res);
        });
    });
}
```

# explanation

Using the specified resources, execute the passed function.

If the function throws, or if it returns a promise that is rejected,
or when the promise chain that is returned fully resolves, dispose
of all the allocated resources.

Returns a promise that resolves to the same value as the promise
returned by the passed function.

Resource disposers can be registered with `using.registerDisposer`

# limitations

Resource allocators (e.g. `connectTo`) must NEVER throw. If they might,
pass a function instead:

```js
using(function() { return allocator(); }, function(res) {
  //...
});
```

The easiest way to make sure that an allocator never throws is to wrap
it with bluebird's `Promise.method` which will convert any exceptions 
into a rejection:

```js
var allocator = Promise.method(function() {
  // code
})
```


To see why an allocator must never throw, consider that

```js
using(alloc1(), alloc2(), fn);
```

is the same as


```js
var r1 = alloc1();
var r2 = alloc2();
using(r1, r2, fn);
```

In this case, if `alloc2` throws, the resource `r1` will leak.

Resource allocators may return non-promises.

# api 

### using.registerDisposer

```ts
(predicate: (resource:any) => boolean, 
   dispose: (resource:any) => Promise<any>) => void;
```

### using

```ts
using<U>(...resources:Promise<any>[], 
         fn: (...resources:any[]) => Promise<U>) => Promise<U>
```

# license

MIT

