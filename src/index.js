const common = {};
module.exports = common;

common.config = require('./config');
common.container = require('./container');
common.Container = common.container;
common.errors = require('./errors');
common.utils = require('./utils');
