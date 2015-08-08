if (!global._babelPolyfill) {
	/**
	 * Require babel manually and check if it has been required before,
	 * or else it causes conflicts with the grunt watch function.
	 * See https://github.com/pghalliday/grunt-mocha-test/issues/101
	 */
	require('babel/register');
}

global.app = {
	client_id: '55c4f51e726bfd8513653773',
	client_secret: 'd676b756bbea3441d9d05ee13cd9b470',
	profile_id: '55c2516e8e6e335428e74319',
	redirect_url: 'http://localhost:3000/verify'
};

global.BufferClient      = require('../src/client');
global.chai              = require('chai');
global.faker             = require('faker');
global.http              = require('http');
global.should            = chai.should();
global.expect            = chai.expect;
global.async             = require('async');
global.seleniumWebdriver = require('selenium-webdriver');
global.By                = seleniumWebdriver.By;
global.Profile           = require('../src/modules/profile');
global.Update            = require('../src/modules/update');
global.utils             = require('../src/utils');