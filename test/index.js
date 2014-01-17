var Promise = require('bluebird');

function Resource(opt) {    
    if (opt.failOpen) 
        throw new Error("Cannot open!")
    this.opt = opt;
    this.closed = false;
}

// Safe creation function
var create = Promise.method(function(opt) {
    return new Resource(opt);
});

// Unsafe but wrapped in a function
var createThrow = function() {
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

var t = require('blue-tape');
var using = require('../index');

using.registerDisposer(function(r) {
    return r instanceof Resource;
}, function(r) {
    return r.close();
});

t.test('basic', function(t) {
    var res = [create({}), create({failOpen: true}), create({})];
    return using(res[0], res[1], res[2], function(r1, r2, r3) {
        t.notOk(true, 'should not execute fn');
        t.end();
    }).catch(function(e) {
        return Promise.join(res[0], res[2]).spread(function(r0, r2) {
            //console.log(r0, r2);
            t.ok(r0.closed && r2.closed, "should not leak resources");
            t.end();
        });
    });

})
