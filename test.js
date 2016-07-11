/*!
 * make-iterator <https://github.com/jonschlinkert/make-iterator>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Copyright (c) 2012, 2013 moutjs team and contributors (http://moutjs.com)
 * Licensed under the MIT License
 */

'use strict';

require('mocha');
var assert = require('assert');
var makeIterator = require('./');

describe('make iterator', function() {
  it('should return source argument if it is already a function with no context', function() {
    var fn = function() {};
    assert.deepEqual(makeIterator(fn), fn);
  });

  it('should return a function that calls object/deepMatches if argument is an object', function() {
    var fn =  makeIterator({ a: 1, b: { c: 2 } });
    assert.deepEqual(fn({ a: 1, b: { c: 2, d: 3 } }), true);
    assert.deepEqual(fn({ a: 1, b: { c: 3 } }), false);
  });

  it('should return a function that calls object/deepMatches if argument is a regex', function() {
    assert.strictEqual(makeIterator(/[a-c]/)(['a', 'b', 'c', 'd']), true);
    assert.strictEqual(makeIterator(/[m-z]/)(['a', 'b', 'c', 'd']), false);
  });

  it('should return a function that returns the property value if argument is a string', function() {
    var fn =  makeIterator('a');
    assert.strictEqual(fn({a:1,b:2}), 1);
    assert.strictEqual(fn({a:2,b:2}), 2);
  });

  it('should return a function that returns the property value if argument is a number', function() {
    var fn =  makeIterator(1);
    assert.strictEqual(fn([0,4,5]), 4);
    assert.strictEqual(fn([6,7,8]), 7);
  });

  it('should return an identify function if no args', function() {
    var fn = makeIterator();
    assert.strictEqual(fn(null), null);
    assert.strictEqual(fn(void(0)), void(0));
    assert.strictEqual(fn(3), 3);
  });

  it('should return an identify function if first arg is `null`', function() {
    var fn = makeIterator(null);
    assert.strictEqual(fn(null), null);
    assert.strictEqual(fn(void(0)), void(0));
    assert.strictEqual(fn(3), 3);
  });

  it('should return a function that is called with the specified context', function() {
    var context = {};
    var iterator = makeIterator(function() { return this; }, context);
    assert.deepEqual(iterator(), context);
  });
});
