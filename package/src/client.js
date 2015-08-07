var OAuth = require('oauth').OAuth2,
    querystring = require('qs');

import Update from './modules/update';
import Profile from './modules/profile';
import Promise from 'promise';

export default class BufferClient {
	/**
	 * Builds the BufferClient class
	 * @param  {string} access_token - The access token associated with the registered app
	 * @param  {Function} callback   - The callback to run when the request has been fulfilled
	 */
	constructor (params, callback = function () {}) {
		this._authenticated = typeof(params.authenticated) !== 'undefined' ? params.authenticated : true;
		this._client_id = params.client_id;
		this._client_secret = params.client_secret;
		this._access_token = params.access_token;
		this._redirect_url = params.redirect_url;
		this._api_version = '1';
		this._api_protocol = 'https';
		this._host = `${this._api_protocol}://api.bufferapp.com`;
		this._stringify_options = {
			arrayFormat: 'index'
		};

		this.client = new OAuth(
			this._client_id,
			this._client_secret,
			'https://buffer.com/',
			'oauth2/authorize',
			'oauth2/token',
			null
		);

		// Wait for the Buffer configuration to complete before finalising the instantiation
		this.promise = new Promise((resolve, reject) => {
			if (!this._authenticated) {
				// If a user hasn't authorized the client for use of their account,
				// we need to get a permanent access token before interacting with the API
				this.getAccessToken(this._access_token, (err, result, response) => {
					if (result) {
						result = JSON.parse(result);
						this._access_token = result.access_token;
						this._authenticated = true;
						resolve();
					} else if (err) {
						reject();
					}
				});
			} else {
				resolve();
			}
		}).then(() => {
			this.getConfiguration((err, res) => {
				if (!err) {
					global._bufferAPI = this;
					this.config = res;
				}

				callback(err, res);
			});
		});
	}

	/**
	 * Queries an API endpoint using the GET method
	 * @param  {string}   endpoint - The API endpoint to query. This should not be the full API URL. Example: 'users.json'
	 * @param  {object}   params   - A list of params to be appended to the URL. If omitted, the default Buffer API attributes will be used.
	 * @param  {Function} callback - The callback to run when the request has been fulfilled
	 * @example <caption>Using the optional `params` parameter:</caption>
	 * this.get('profiles/4eb854340acb04e870000010/updates/sent.json', {
	 * 	page: 2,
	 * 	count: 100
	 * }, function (err, res) {
	 * 	// Do something
	 * });
	 * @example <caption>Omitting the optional `params` parameter</caption>
	 * this.get('profiles/4eb854340acb04e870000010/updates/sent.json', function (err, res) {
	 * 	// Do something
	 * });
	 */
	get (endpoint, params, callback) {
		if (typeof(params) === 'function') {
			callback = params;
			params = '';
		}

		if (typeof(params) === 'object') {
			params = `?${querystring.stringify(params, this._stringify_options)}`;
		}

		this.client.get(`${this._host}/${this._api_version}/${endpoint}${params}`, this._access_token, function (err, res) {
			if (res) {
				res = JSON.parse(res);
			}

			callback(err, res);
		});
	}

	/**
	 * Queries an API endpoint using the POST method
	 * @param  {string}   endpoint - The API endpoint to query. This should not be the full API URL. Example: 'users.json'
	 * @param  {object}   params   - A list of params to be appended to the URL. If omitted, the default Buffer API attributes will be used.
	 * @param  {Function} callback - The callback to run when the request has been fulfilled
	 * @example <caption>Using the optional `params` parameter:</caption>
	 * this.post('profiles/4eb854340acb04e870000010/schedules/update.json', { ... }, function (err, res) {
	 * 	// Do something
	 * });
	 * @example <caption>Omitting the optional `params` parameter</caption>
	 * this.post('user/deauthorize.json', function (err, res) {
	 * 	// Do something
	 * });
	 */
	post (endpoint, params, callback = null) {
		var post_headers = {
			'Content-Type': 'application/x-www-form-urlencoded'
		};

		if (typeof(params) === 'function') {
			callback = params;
			params   = '';
		}

		if (typeof(params) === 'object') {
			params = querystring.stringify(params, this._stringify_options);
		}

		this.client._request('POST', `${this._host}/${this._api_version}/${endpoint}`, post_headers, params, this._access_token, function (err, res) {
			if (res) {
				res = JSON.parse(res);
			}

			callback(err, res);
		});
	}

	/**
	 * Retrieves the current Buffer configuration
	 * @param  {Function} callback - The callback to run when the request has been fulfilled
	 */
	getConfiguration (callback) {
		this.get('info/configuration.json', callback);
	}

	/**
	 * Gets a list of profiles associated with the authenticated user
	 * @param  {Function} callback - The callback to run when the request has been fulfilled
	 */
	getProfiles (callback) {
		this.promise.then(() => {
			this.get('profiles.json', (err, res) => {
				if (!err) {
					this.profiles = {};
					async.forEachOf(res, (profile, index, next) => {
						this.profiles[res[index].id] = new Profile(res[index]);
						this.profiles[res[index].id].promise.then(next);
					}, callback(err, res));
				}
			});
		});
	}

	/**
	 * Revokes access for the Buffer Client to access the API on behalf of the currently logged in user
	 * @param  {Function} callback - The callback to run when the request has been fulfilled
	 */
	deauthorizeUser (callback) {
		this.post('user/deauthorize.json', (err, res) => {
			this.profiles = {};
			this._authenticated = false;

			callback(err, res);
		});
	}

	getAccessToken (access_token, callback) {
		// Okay, this is annoying. The OAuth library has a method to retrieve the access token,
		// but it automatically encodes the temporary access token, invalidating the request.
		// For now, the request needs to be done directly.
		var parsedURL = require('url').parse(this.client._getAccessTokenUrl(), true);
		var post_data = querystring.stringify({
			client_id: this._client_id,
			client_secret: this._client_secret,
			redirect_uri: this._redirect_url,
			grant_type: 'authorization_code',
			code: access_token
		});
		var options = {
			host: 'api.bufferapp.com',
			path: '/1/oauth2/token.json',
			port: 443,
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': post_data.length
			}
		};

		this.client._executeRequest(
			require('https'),
			options,
			post_data,
			callback
		);
	}

	static getAuthorizationUrl (client_id, redirect_url) {
		return new OAuth(
			client_id,
			'',
			'https://buffer.com/',
			'oauth2/authorize',
			'oauth2/token',
			null
		).getAuthorizeUrl({
			redirect_uri: redirect_url,
			response_type: 'code'
		});
	}
}