var Promise = require('bluebird');

var Resource = require('./lib/mock-resource'),
    create = Resource.create,
    createThrow = Resource.createThrow;

var using = require('../index');

using.registerDisposer(function(r) {
    return r instanceof Resource;
}, function(r) {
    return r.close();
});

// tests

var t = require('blue-tape');

t.test('resource alloc fails', function(t) {
    var res = [create({}), create({failOpen: true}), create({})];
    return using(res[0], res[1], res[2], function(r1, r2, r3) {
        t.notOk(true, 'should not execute fn');
    }).catch(function(e) {
        return Promise.join(res[0], res[2]).spread(function(r0, r2) {
            t.ok(r0.closed && r2.closed, "should not leak resources");
        });
    });

})

t.test('function fails', function(t) {
    var r = create({});
    return using(r, function(r) {
        t.ok(r.opt, 'resource should have opt member');
        t.notOk(r.closed, 'resource should be available within function');
        throw new Error('function-failed');
    }).catch(function(e) {
        t.equals(e.message, 'function-failed', 'should fail because function failed');
        return r.then(function(r) {
            t.ok(r.closed, 'resource should be closed outside function');
        });
    });

})

t.test('single close fails', function(t) {
    var r = [create({}), create({failClose:true}), create({})];
    return using(r[0], r[1], r[2], function(r) {
        t.ok(true, 'should execute fn');
    }).then(function(e) {
        return Promise.join(r[0], r[2]).spread(function(r0, r2) {
            t.ok(r0.closed && r2.closed, "should not leak other resources");
        });
    });

})


t.test('all ok', function(t) {
    var r1 = create({first:true}), r2 = create({second:true});
    return using(r1, r2, function(r1, r2) {
        t.ok(r2.opt, 'resource should have  opt member');
        return [r2, r1];
    }).spread(function(r2, r1) {
        t.ok(r1.opt.first, 'should be first');
        t.ok(r2.opt.second, 'should be second');
        t.ok(r1.closed && r2.closed, 'both should be closed');
    });

})


