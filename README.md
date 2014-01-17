# promise-using

A resource management library for Bluebird

# example

```js
function doWithResources(something) {
    return using(connectTo(src), connectTo(dst), function(src, dst) {
        return src.callApi.then(function(res) {
            return dst.writeApi(res);
        });
    });
}
```

# limitations

Resource allocators (e.g. `connectTo`) must NEVER throw. If they might,
pass a function instead:

```js
using(function() { return allocator(); }, function(res) {
  //...
});
```

Resource allocators may return non-promises.

# usage

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

