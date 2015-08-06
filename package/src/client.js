var OAuth = require('oauth').OAuth2,
    querystring = require('qs');

export default class BufferClient {
	/**
	 * Builds the BufferClient class
	 * @param  {string} access_token - The access token associated with the registered app
	 */
	constructor (access_token, callback = function () {}) {
		this._access_token = access_token;
		this._api_version = '1';
		this._api_protocol = 'https';
		this._host = `${this._api_protocol}://api.bufferapp.com`;
		this._stringify_options = {
			arrayFormat: 'brackets'
		};

		this.client = new OAuth(
			app.client_id,
			app.client_secret,
			'https://buffer.com/',
			'oauth2/authorize',
			'oauth2/token',
			null
		);

		// Wait for the Buffer configuration to complete before finalising the instantiation
		new Promise((resolve, reject) => {
			this.getConfiguration((err, res) => {
				if (!err) {
					this.config = res;
					resolve();
				} else {
					reject();
				}
			});
		}).then(() => {
			global.BufferAPI = this;
			callback();
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
			if (res)
				res = JSON.parse(res);

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
			params = '';
		}

		if (typeof(params) === 'object') {
			params = querystring.stringify(params, this._stringify_options);
		}

		this.client._request('POST', `${this._host}/${this._api_version}/${endpoint}`, post_headers, params, this._access_token, function (err, res) {
			if (res)
				res = JSON.parse(res);

			callback(err, res);
		});
	}

	/**
	 * Retrieves a singualar user with a given ID
	 * @param  {Function} callback - The callback to run when the request has been fulfilled
	 */
	getUser (callback) {
		this.get('user.json', callback);
	}

	/**
	 * Retrieves a list of profiles associated with the authorised account
	 * @param  {Function} callback - The callback to run when the request has been fulfilled
	 */
	getProfiles (callback) {
		this.get('profiles.json', (err, res) => {
			this.profiles = res;

			callback(err, res);
		});
	}

	/**
	 * Retrieves a singular profile with the given ID
	 * @param  {integer}  profile_id - The ID of the profile to retrieve
	 * @param  {Function} callback   - The callback to run when the request has been fulfilled
	 */
	getProfileById (profile_id, callback) {
		this.get(`profiles/${profile_id}.json`, callback);
	}

	/**
	 * Retrieves the schedules set up for the associated account
	 * @param  {integer}  profile_id - The ID of the profile to retrieve
	 * @param  {Function} callback   - The callback to run when the request has been fulfilled
	 */
	getProfileSchedules (profile_id, callback) {
		this.get(`profiles/${profile_id}/schedules.json`, callback);
	}

	/**
	 * Retrieves a singular update with a given ID
	 * @param  {integer}  update_id - The ID of the update to retrieve
	 * @param  {Function} callback  - The callback to run when the request has been fulfilled
	 */
	getUpdate (update_id, callback) {
		this.get(`updates/${update_id}.json`, callback);
	}

	/**
	 * Retrieves a list of pending updates for the associated account
	 * @param  {Function} callback - The callback to run when the request has been fulfilled
	 */
	getPendingUpdates (profile_id, params, callback = null) {
		callback = typeof(params) === 'function' ? params : callback;

		this.get(`profiles/${profile_id}/updates/pending.json`, params, callback);
	}

	/**
	 * Retrieves a list of sent updates from the associated account
	 * @param  {integer}  profile_id - ID of the profile of which to retrieve updates
	 * @param  {object}   params     - A list of params to be appended to the URL.
	 * @param  {Function} callback   - The callback to run when the request has been fulfilled
	 */
	getSentUpdates (profile_id, params, callback = null) {
		callback = typeof(params) === 'function' ? params : callback;

		this.get(`profiles/${profile_id}/updates/sent.json`, params, callback);
	}

	/**
	 * Adds a status update to the user's buffer
	 * @param  {object}   params   - Details of the update to be created
	 * @param  {Function} callback - The callback to run when the request has been fulfilled
	 */
	createUpdate (params, callback) {
		this.post(`updates/create.json`, params, callback);
	}

	/**
	 * Gets interactions (e.g. retweets) from an update with a given ID
	 * @param  {integer}  update_id - ID of the update of which to retrieve interactions
	 * @param  {object}   params    - A list of params to be appended to the URL.
	 * @param  {Function} callback  - The callback to run when the request has been fulfilled
	 */
	getInteractions (update_id, params, callback = null) {
		callback = typeof(params) === 'function' ? params : callback;

		this.get(`updates/${update_id}/interactions.json`, params, callback);
	}

	/**
	 * Gets the amount of times a link has been shared using Buffer
	 * @param  {string}   url      - The URL of which to retrieve analytics
	 * @param  {Function} callback - The callback to run when the request has been fulfilled
	 */
	getLinkShares (url, callback) {
		this.get('links/shares.json', { url: url }, callback)
	}

	/**
	 * Retrieves the current Buffer configuration
	 * @param  {Function} callback - The callback to run when the request has been fulfilled
	 */
	getConfiguration (callback) {
		this.get('info/configuration.json', callback);
	}
}