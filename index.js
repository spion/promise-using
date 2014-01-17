var Promise = require('bluebird');

function using() {
    var arglen = arguments.length;
    if (arglen < 2) 
        throw new TypeError("At least 2 arguments are required");
    var f = arguments[arglen - 1];
    if (typeof(f) !== 'function')
        throw new TypeError("Last argument must be a function");

    var resources = new Array(arglen - 1);
    for (var k = 0; k < arglen - 1; ++k) {
        resources[k] = toResource(arguments[k]);
    }
    var settled = Promise.settle(resources);
    return settled.then(function(all) { 
        return all.filter(isFulfilled).map(getValue);
    }).then(function(fulfilled) {
        var retval;
        if (resources.length === fulfilled.length) {
            return Promise
            .try(f, fulfilled, this)
            .finally(cleanup(fulfilled))
        }
        return Promise.reject(
            new Promise.RejectionError("Resource allocation failed"))
            .finally(cleanup(fulfilled));
    });

}

function toResource(arg) {
    if (typeof(arg) === 'function') return Promise.try(arg);
    else return Promise.cast(arg);
}

function isFulfilled(i) { return i.isFulfilled(); }
function getValue(i) { return i.value(); }


function cleanup(fulfilled) {
    return function() {
        // how to report failures ?
        return Promise.settle(fulfilled.map(cleanOne));
    }
}

var cleanOne = Promise.method(function cleanOne(resource) {
    for (var k = 0; k < disposers.length; ++k) {
        var test = disposers[k].test,
            dispose = disposers[k].dispose;        
        if (tryCall(test, resource))
            return dispose(resource);
    }
    // what if there is no disposer?
    throw new Error("Unable to free resource");
});

function tryCall(test, item) {
    try { return test(item); }
    catch (e) { return false; }
}

var disposers = [];

exports = module.exports = Promise.method(using);

exports.registerDisposer = function(predicate, disposer) {
    if (typeof(predicate) !== 'function' ||
        typeof(disposer) !== 'function') 
        throw new TypeError("Both predicate and disposer must be functions");
    disposers.push({
        test: predicate, 
        dispose: disposer
    });
}

