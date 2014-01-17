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

Resource disposers can be registered with `using.registerDisposer`

# limitations

Resource allocators (e.g. `connectTo`) must NEVER throw. If they might,
pass a function instead:

```js
using(function() { return allocator(); }, function(res) {
  //...
});
```

Resource allocators may return non-promises.

# api 

### using.registerDisposer

```ts
(predicate: (resource:any) => boolean, 
 dispose: (resource:any) => Promise<T>) => void;
```

### using

```ts
(...resources:Promise<T>[], 
 fn: (...resources:any) => Promise<U>) => Promise<any>
```

# license

MIT

