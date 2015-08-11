import {OAuth, OAuthEcho, OAuth2} from 'oauth';
import querystring from 'qs';
import Update from './modules/update';
import Profile from './modules/profile';
import Promise from 'promise';

export default class BufferClient {
	/**
	 * Builds the BufferClient class
	 * @param {String}  params - The access token associated with the registered app
	 * @param {Boolean} [params.authenticated] - Flag to determine whether the user has been authenticated or not. If false, a long-lived access token will be generated and assigned upon instantiation.
	 * @param {String}  params.client_id - The client ID of your Buffer application
	 * @param {String}  params.client_secret - The client secret of your Buffer application
	 * @param {String}  params.access_token - The access token for the user. If the `authentication` parameter is false, this will be overwritten by the `getAccessToken` method.
	 * @param {String}  params.redirect_url - The redirection URL for your Buffer application
	 * @param {Function} [callback] - The callback to run when the request has been fulfilled
	 * @example <caption>Simple instantiation, no authentication needed. E.g. for a user that has already authenticated their account</caption>
	 * new BufferClient({
	 *   access_token: '<your_access_token>',
	 *   client_id: '<your_client_id>',
	 *   client_secret: '<your_client_secret>',
	 *   redirect_url: '<your_redirection_url>'
	 * });
	 * @example <caption>Force access_token generation with the `authentication` flag</caption>
	 * new BufferClient({
	 *   access_token: '<your_access_token>',
	 *   client_id: '<your_client_id>',
	 *   client_secret: '<your_client_secret>',
	 *   redirect_url: '<your_redirection_url>',
	 *   authenticated: false
	 * }, function (err, res) {
	 *   // Do something here
	 * });
	 */
	constructor (params, callback = function () {}) {
		this._authenticated = typeof(params.authenticated) !== 'undefined' ? params.authenticated : true;
		this._client_id = params.client_id;
		this._client_secret = params.client_secret;
		this._access_token = params.access_token;
		this._redirect_url = params.redirect_url;
		this._api_version = '1';
		this._protocol = 'https';
		this._hostname = 'api.bufferapp.com';
		this._host = `${this._protocol}://${this._hostname}`;
		this._stringify_options = {
			arrayFormat: 'index'
		};

		/**
		 * The Buffer configuration retrieved from the /info/configuration.json endpoint
		 * @type {Object}
		 */
		this.config = {};

		/**
		 * The OAuth2 client that will be used to automatically authenticate API URLs
		 * @type {Object}
		 */
		this.client = new OAuth2(
			this._client_id,
			this._client_secret,
			`${this._host}/${this._api_version}/`,
			'oauth2/authorize',
			'oauth2/token.json',
			null
		);

		/**
		 * A promise that will return after the BufferClient instance has been built
		 * @type {Promise}
		 */
		this.promise = new Promise((resolve, reject) => {
			if (!this._authenticated) {
				// If a user hasn't authorized the client for use of their account,
				// we need to get a permanent access token before interacting with the API
				this.getAccessToken(this._access_token, (err, res) => {
					if (res) {
						this._access_token = res;
						this._authenticated = true;
						resolve();
					} else {
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
	 * @param  {String}   endpoint - The API endpoint to query. This should not be the full API URL. Example: 'users.json'
	 * @param  {Object}   params   - A list of params to be appended to the URL. If omitted, the default Buffer API attributes will be used.
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

		this.client.get(`${this._host}/${this._api_version}/${endpoint}${params}`, this._access_token, function (err, res, response) {
			if (res) {
				res = JSON.parse(res);
			}

			callback(err, res, response);
		});
	}

	/**
	 * Queries an API endpoint using the POST method
	 * @param  {String}   endpoint - The API endpoint to query. This should not be the full API URL. Example: 'users.json'
	 * @param  {Object}   params   - A list of params to be appended to the URL. If omitted, the default Buffer API attributes will be used.
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

		this.client._request('POST', `${this._host}/${this._api_version}/${endpoint}`, post_headers, params, this._access_token, function (err, res, response) {
			if (res) {
				res = JSON.parse(res);
			}

			callback(err, res, response);
		});
	}

	/**
	 * Retrieves the current Buffer configuration
	 * @param  {Function} callback - The callback to run when the request has been fulfilled
	 * @example
	 * // ...
	 * client.getConfiguration(function (err, res) {
	 *   // Do something
	 * });
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
					this._profiles = {};
					async.eachSeries(res, (profile, next) => {
						this._profiles[profile.id] = new Profile(profile);
						this._profiles[profile.id].promise.then(next);
					}, function () {
						callback(err, res)
					});
				}
			});
		});
	}

	/**
	 * Returns a profile object with a given ID.
	 * Note that this does not query the API, so a list of profiles must have been retrieved beforehand.
	 * @param  {String} profile_id - The ID of the profile to retrieve
	 * @return {Object}            - The queried profile object
	 */
	getProfile (profile_id) {
		return this._profiles[profile_id];
	}

	/**
	 * Revokes access for the Buffer Client to access the API on behalf of the currently logged in user
	 * @param  {Function} callback - The callback to run when the request has been fulfilled
	 */
	deauthorizeUser (callback) {
		this.post('user/deauthorize.json', (err, res) => {
			this._profiles = {};
			this._authenticated = false;

			callback(err, res);
		});
	}

	/**
	 * Gets a permanent access token when authenticating the user.
	 * @param  {String}   access_token - The temporary access token assigned when passing through the OAuth gateway
	 * @param  {Function} callback     - The callback to run when the request has been fulfilled
	 */
	getAccessToken (access_token, callback) {
		this.client.getOAuthAccessToken(access_token, {
			redirect_uri: this._redirect_url,
			grant_type: 'authorization_code'
		}, callback);
	}

	/**
	 * Gets the authorization URL for the current app
	 * @param  {String} client_id    - The client ID you were assigned when registering your Buffer application
	 * @param  {String} redirect_url - The redirect URL you set when registering your Buffer application
	 */
	static getAuthorizationUrl (client_id, redirect_url) {
		return new OAuth2(
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