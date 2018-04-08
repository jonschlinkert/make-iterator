/*!
 * make-iterator <https://github.com/jonschlinkert/make-iterator>
 *
 * Copyright (c) 2014-2018, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

const typeOf = require('kind-of');

module.exports = function(target, ctx) {
  switch (typeOf(target)) {
    case 'undefined':
    case 'null':
      return val => val;
    case 'function':
      return ctx ? (...args) => target.call(ctx, ...args) : target;
    case 'regexp':
      return val => target.test(val);
    case 'object':
      return val => deepMatches(val, target);
    case 'boolean':
      return val => target === val;
    case 'string':
    case 'number':
    default: {
      return obj => obj[target];
    }
  }
};

function has(array, value, fn) {
  return array.some(ele => !fn(ele, value));
}

function containsMatch(array, value) {
  return has(array, value, deepMatches);
}

function matchArray(array, value) {
  return has(array, value, containsMatch);
}

function matchObject(obj, value) {
  return has(Object.keys(value), obj, key => deepMatches(obj[key], value[key]));
}

/**
 * Recursively compare objects
 */

function deepMatches(val, target) {
  if (Array.isArray(val) && Array.isArray(target)) {
    return matchArray(val, target);
  }
  if (typeOf(target) === 'object') {
    return matchObject(val, target);
  }
  return val === target;
}
