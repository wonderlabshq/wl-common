/* eslint-disable no-undef */
const utils = require('../../src/utils');

describe('Util functions unit test', () => {
  test('isArray function should return false if anything passed to parameter is not an array', () => {
    expect(utils.isArray('foo')).toBeFalsy();
    expect(utils.isArray(123)).toBeFalsy();
    expect(utils.isArray({})).toBeFalsy();
    expect(utils.isArray(() => {})).toBeFalsy();
    expect(utils.isArray(undefined)).toBeFalsy();
    expect(utils.isArray(null)).toBeFalsy();
    expect(utils.isArray([])).toBeTruthy();
  });

  test('isObject function should return false if anything passed to parameter is not an object', () => {
    expect(utils.isObject('foo')).toBeFalsy();
    expect(utils.isObject(123)).toBeFalsy();
    expect(utils.isObject({})).toBeTruthy();
    expect(utils.isObject(() => {})).toBeFalsy();
    expect(utils.isObject(undefined)).toBeFalsy();
    expect(utils.isObject(null)).toBeFalsy();
    expect(utils.isObject([])).toBeFalsy();
  });

  test('isFunction function should return false if anything passed to parameter is not a function', () => {
    expect(utils.isFunction('foo')).toBeFalsy();
    expect(utils.isFunction(123)).toBeFalsy();
    expect(utils.isFunction({})).toBeFalsy();
    expect(utils.isFunction(() => {})).toBeTruthy();
    expect(utils.isFunction(undefined)).toBeFalsy();
    expect(utils.isFunction(null)).toBeFalsy();
    expect(utils.isFunction([])).toBeFalsy();
  });

  test('isString function should return false if anything passed to parameter is not a string', () => {
    expect(utils.isString('foo')).toBeTruthy();
    expect(utils.isString(123)).toBeFalsy();
    expect(utils.isString({})).toBeFalsy();
    expect(utils.isString(() => {})).toBeFalsy();
    expect(utils.isString(undefined)).toBeFalsy();
    expect(utils.isString(null)).toBeFalsy();
    expect(utils.isString([])).toBeFalsy();
  });
});
