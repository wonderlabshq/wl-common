const _ = require('lodash');
const utils = require('./utils');
const RuntimeError = require('./errors').RuntimeError;
const ConfigurationError = require('./errors').ConfigurationError;
const ServiceNotFoundError = require('./errors').ServiceNotFoundError;

/**
 * Container Class
 * @param {Object} config
 * @constructor
 */
class Container {
  constructor(config = {}) {
    this.cache = {};
    this.config = {
      prototype: {},
      factory: {},
    };
    this.load(config);
  }

  /**
   * Check whether this container contains a service
   * @param {string} name
   * @returns {boolean}
   */
  has(name) {
    const factories = Object.keys(this.config.factory);
    const prototypes = Object.keys(this.config.prototype);
    return _.includes(factories, name) || _.includes(prototypes, name);
  }

  /**
   * Return service as a promise object
   * @param {string} name
   * @returns {*}
   */
  promisify(name) {
    try {
      const service = this.get(name, undefined);

      if (typeof service.then === 'function') {
        return service;
      }

      return Promise.resolve(service);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Append current config definitions with another config
   * @param {Object} cfg object containing prototype & factory definitions
   * @throws {TypeError} if cfg has no prototype & factory properties
   */
  load(cfg = {}) {
    if (cfg.factory) Object.keys(cfg.factory).forEach(k => this.factory(k, cfg.factory[k]));
    if (cfg.prototype) Object.keys(cfg.prototype).forEach(k => this.prototype(k, cfg.prototype[k]));
  }

  /**
   * Register a factory
   * @param {string} name
   * @param {function} creator
   * @param {boolean} force
   */
  factory(name, creator, force = false) {
    // eslint-disable-next-line no-underscore-dangle
    this._register(name, creator, force, false);
  }

  /**
   * Register a prototype
   * @param {string} name
   * @param {function} creator
   * @param {bolean} force
   */
  prototype(name, creator, force = false) {
    // eslint-disable-next-line no-underscore-dangle
    this._register(name, creator, force, true);
  }

  /**
   * Get service by it's name
   * @param {string} name
   * @param {function} cb
   * @returns {*}
   * @throws {ServiceNotFoundError}
   */
  get(name, cb) {
    if (this.cache[name]) {
      return cb ? cb(null, this.cache[name]) : this.cache[name];
    }

    if (_.includes(Object.keys(this.config.factory), name)) {
      this.cache[name] = this.config.factory[name](this);
      return utils.isFunc(cb) ? cb(null, this.cache[name]) : this.cache[name];
    }

    if (_.includes(Object.keys(this.config.prototype), name)) {
      const service = this.config.prototype[name](this);
      return utils.isFunc(cb) ? cb(null, service) : service;
    }

    const err = new ServiceNotFoundError(`Service '${name}' does not exists.`);

    if (cb) {
      return cb(err);
    }

    throw err;
  }

  /**
   * Register a new factory/prototype, should be used for internal only
   * @param {string} name
   * @param {function} creator
   * @param {boolean} force
   * @param {boolean} isPrototype
   * @throws {RuntimeError}
   * @throws {ConfigurationError}
   * @private
   */
  _register(name, creator, force, isPrototype) { // eslint-disable-line no-underscore-dangle
    if (this.has(name) && !force) {
      throw new RuntimeError(`${name} is already registered, use force register instead.`);
    }

    if (!utils.isFunc(creator)) {
      throw new ConfigurationError(`Factory for ${name} must be a function.`);
    }

    if (isPrototype) {
      this.config.prototype[name] = creator;
    } else {
      this.config.factory[name] = creator;
    }
  }
}

module.exports = Container;
