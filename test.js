/*!
 * make-iterator <https://github.com/jonschlinkert/make-iterator>
 *
 * Copyright (c) 2014-2018 Jon Schlinkert
 * Copyright (c) 2012, 2013 moutjs team and contributors (http://moutjs.com)
 * Licensed under the MIT License
 */

'use strict';

require('mocha');
const assert = require('assert');
const iterator = require('./');

describe('make iterator', () => {
  it('should return source argument if it is already a function with no context', () => {
    const fn = () => {};
    assert.deepEqual(iterator(fn), fn);
  });

  it('should return a function that calls object/deepMatches if argument is an object', () => {
    const fn = iterator({ a: 1, b: { c: 2 } });
    assert(fn({ a: 1, b: { c: 2, d: 3 } }));
    assert(!fn({ a: 1, b: { c: 3 } }));
  });

  it('should return a function that calls object/deepMatches if argument is a regex', () => {
    assert(iterator(/[a-c]/)(['a', 'b', 'c', 'd']));
    assert(!iterator(/[m-z]/)(['a', 'b', 'c', 'd']));
  });

  it('should return a function that returns the property value if argument is a string', () => {
    const fn = iterator('a');
    assert.strictEqual(fn({ a: 1, b: 2 }), 1);
    assert.strictEqual(fn({ a: 2, b: 2 }), 2);
  });

  it('should return a function that returns the property value if argument is a number', () => {
    const fn = iterator(1);
    assert.strictEqual(fn([0, 4, 5]), 4);
    assert.strictEqual(fn([6, 7, 8]), 7);
  });

  it('should return an identify function if no args', () => {
    const fn = iterator();
    assert.strictEqual(fn(null), null);
    assert.strictEqual(fn(void 0), void 0);
    assert.strictEqual(fn(3), 3);
  });

  it('should return an identify function if first arg is `null`', () => {
    const fn = iterator(null);
    assert.strictEqual(fn(null), null);
    assert.strictEqual(fn(void 0), void 0);
    assert.strictEqual(fn(3), 3);
  });

  it('should return a function that is called with the specified context', () => {
    const context = { a: 'b' };
    const fn = iterator(function() {
      return this;
    }, context);
    assert.deepEqual(fn(), context);
    assert.deepEqual(fn().a, 'b');
  });
});
