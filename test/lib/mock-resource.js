var Promise = require('bluebird');

function Resource(opt) {    
    if (opt.failOpen) 
        throw new Error("Cannot open!")
    this.opt = opt;
    this.closed = false;
}

// Safe creation function
Resource.create = Promise.method(function(opt) {
    return new Resource(opt);
});

// Unsafe but wrapped in a function
Resource.createThrow = function() {
    throw new Error("Cannot open!");
}

Resource.prototype.close = function() {
    if (this.opt.failClose)
        throw new Error("Cant close!");
    var self = this;
    return new Promise(function(ok, err) {
        setTimeout(function() {
            self.closed = true;
            ok();
        }, 20);
    });
}

module.exports = Resource;

