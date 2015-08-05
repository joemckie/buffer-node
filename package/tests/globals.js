if (!global._babelPolyfill) {
	/**
	 * Require babel manually and check if it has been required before,
	 * or else it causes conflicts with the grunt watch function.
	 * See https://github.com/pghalliday/grunt-mocha-test/issues/101
	 */
	require('babel/register');
}

global.app = {
	access_key: '1/4345acc1e6c65935d3dc50ed4702a479',
	profile_id: '55c2516e8e6e335428e74319'
};

global.BufferClient = require('../src/client');
global.chai         = require('chai');
global.faker        = require('faker');
global.http         = require('http');
global.should       = chai.should();