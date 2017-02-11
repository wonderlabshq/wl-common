/* eslint-disable no-undef */
const path = require('path');
const config = require('../../src/config');

describe('Config helper unit test', () => {
  test('test resolveLocalConfig should work as expected', () => {
    const dir = path.join(path.dirname(__dirname), 'files');
    process.env.CONFIG_FILE = 'config-test.js';

    expect(config.resolveLocalConfig(dir)).toEqual(`${dir}/config-test.js`);

    const result = config.resolveLocalConfig(dir, (err, file) => {
      expect(err).toBeFalsy();
      expect(file).toEqual(`${dir}/config-test.js`);
      return true;
    });

    expect(result).toBeTruthy();

    process.env.CONFIG_FILE = 'nonexistence.js';

    expect(() => { config.resolveLocalConfig(dir); }).toThrow();
    expect(() => { config.resolveLocalConfig(dir, null); }).toThrow();

    config.resolveLocalConfig(dir, (err, file) => {
      expect(err).toBeTruthy();
      expect(file).toBeUndefined();
    });

    const env = process.env.NODE_ENV;
    process.env.NODE_ENV = 'staging';

    expect(config.resolveLocalConfig(dir)).toEqual(`${dir}/staging.local.js`);

    process.env.NODE_ENV = env;
  });

  test('merge function works as expected', () => {
    const orig = {
      foo: 'bar',
      bar: 'baz',
    };

    config.merge(orig, {
      foo: 'baz',
      hello: 'world',
    });

    expect(orig.foo).toEqual('baz');
    expect(orig.bar).toEqual('baz');
    expect(orig.hello).toEqual('world');
  });
});
