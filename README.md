# promise-using

A resource management library for Bluebird

# example

todo

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
```ts

# license

MIT

