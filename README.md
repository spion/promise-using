# promise-using

A resource management library for Bluebird

# example

todo

# usage

```ts
using.registerDisposer(predicate: (resource:any) => boolean, dispose: (resource:any) => Promise<T>);
using(...resources:Promise<T>[], fn: (...resources:any) => Promise<U>)
```

# license

MIT

