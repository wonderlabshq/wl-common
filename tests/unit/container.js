/* eslint-disable no-undef */
const _ = require('lodash');
const Container = require('../../src/container');

describe('Container class unit test', () => {
  test('has & get methods should work correctly', () => {
    const config = {
      factory: { foo: () => 'bar' },
    };

    const container = new Container(config);
    expect(container.has('test')).toBeFalsy();
    expect(container.has('foo')).toBeTruthy();
    expect(container.get('foo')).toEqual('bar');
    expect(() => container.get('something')).toThrow();

    container.get('foo', (err, service) => {
      expect(err).toBeNull();
      expect(service).toEqual('bar');
    });

    container.get('something', (err, service) => {
      expect(err instanceof Error).toBeTruthy();
      expect(service).toBeUndefined();
    });
  });

  test('promisify method should always return promise and works as expected', () => {
    const config = {
      factory: {
        foo: () => 'bar',
        bar: () => Promise.resolve('baz'),
      },
    };

    const container = new Container(config);

    const testService = container.promisify('test');
    testService.catch(() => {});

    expect(testService.then).toEqual(expect.any(Function));

    expect(container.promisify('foo').then).toEqual(expect.any(Function));
    expect(container.promisify('bar').then).toEqual(expect.any(Function));

    container.promisify('foo').then((service) => {
      expect(service).toEqual('bar');
    });

    container.promisify('bar').then((service) => {
      expect(service).toEqual('baz');
    });
  });

  test('load method should works as expected', () => {
    const createZee = jest.fn();

    const config = {
      factory: {
        foo: () => 'bar',
      },
      prototype: {
        zoo: () => undefined,
        zee: createZee,
      },
    };

    const container = new Container({});

    expect(_.size(container.config.factory)).toEqual(0);
    expect(_.size(container.config.prototype)).toEqual(0);

    container.load(config);

    expect(_.size(container.config.factory)).toEqual(1);
    expect(_.size(container.config.prototype)).toEqual(2);

    expect(container.get('zoo')).toBeUndefined();

    container.get('zee');
    container.get('zee');
    expect(createZee.mock.calls.length).toEqual(2);

    container.get('zee');
    expect(createZee.mock.calls.length).toEqual(3);
  });

  test('factory and prototype method should work as expected', () => {
    const fn = () => {};

    const config = {
      factory: {
        foo: fn,
        bar: fn,
      },
      prototype: {
        zoo: fn,
        zee: fn,
      },
    };

    const container = new Container(config);

    expect(_.size(container.config.factory)).toEqual(2);
    expect(_.size(container.config.prototype)).toEqual(2);

    container.factory('hello', fn);
    expect(_.size(container.config.factory)).toEqual(3);

    container.prototype('world', fn);
    expect(_.size(container.config.prototype)).toEqual(3);

    expect(() => container.factory('hello', fn)).toThrow();
    expect(() => container.prototype('world', fn)).toThrow();

    container.factory('hello', fn, true);
    expect(_.size(container.config.factory)).toEqual(3);

    container.prototype('world', fn, true);
    expect(_.size(container.config.prototype)).toEqual(3);

    expect(() => { container.prototype('test', null); }).toThrow();
  });
});
