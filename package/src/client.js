var OAuth = require('oauth').OAuth2;

export default class BufferClient {
	constructor (access_token, callback) {
		this._access_token = access_token;
		this._api_version = '1';
		this._api_protocol = 'https';
		this._host = `${this._api_protocol}://api.bufferapp.com`;

		this.client = new OAuth(
			app.client_id,
			app.client_secret,
			'https://buffer.com/',
			'oauth2/authorize',
			'oauth2/token',
			null
		);
	}

	/**
	 * Queries an API endpoint using the GET method
	 * @param  {string}   endpoint to query. For example: 'users.json'
	 * @param  {Function} callback to run after the request has been fulfilled
	 * @return void
	 */
	get (endpoint, callback) {
		try {
			this.client.get(`${this._host}/${this._api_version}/${endpoint}`, this._access_token, function (err, res) {
				if (res) {
					res = JSON.parse(res);
				}

				callback(err, res);
			});
		} catch (e) {
			throw new Error(e);
		}
	}

	post (url, params, callback) {
		return
	}

	getUser (callback) {
		this.get('user.json', callback);
	}

	getProfiles (callback) {
		this.get('profiles.json', function (err, res) {
			this.profiles = res;
			callback();
		});
	}

	getProfileById (id, callback) {
		this.get(`profiles/${id}.json`, callback);
	}

	getProfileSchedules (id, callback) {
		this.get(`profiles/${id}/schedules.json`, callback);
	}
}