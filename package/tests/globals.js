if (!global._babelPolyfill) {
	/**
	 * Require babel manually and check if it has been required before,
	 * or else it causes conflicts with the grunt watch function.
	 * See https://github.com/pghalliday/grunt-mocha-test/issues/101
	 */
	require('babel/register');
}

global.app = {
	access_key: '1/0592f2761c2fdcfabfab6a901a43c771',
	client_id: '55bbf88ea306363322810e24',
	client_secret: '2b20ad58d6c73d2e1674f4db7eae316c'
};

global.BufferClient = require('../src/client');
global.chai         = require('chai');
global.faker        = require('faker');
global.http         = require('http');
global.should       = chai.should();