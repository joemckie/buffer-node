import utils from '../utils'

export default class Update {
	constructor (update, client) {
		// Reference the API client
		this.client = client;

		this.promise = new Promise((resolve, reject) => {
			if (typeof(update) === 'string') {
				// Instantiating the update from an ID
				this.getByID(update, function (err, res) {
					resolve(res);
				});
			} else {
				// Instantiating the update from an object
				resolve(update);
			}
		}).then((update) => {
			// Map the update to this object
			utils.mapObject(this, update);
		});
	}

	/**
	 * Retrieves a singular update with a given ID
	 * @param  {integer}  update_id - The ID of the update to retrieve
	 * @param  {Function} callback  - The callback to run when the request has been fulfilled
	 */
	getByID (update_id, callback) {
		this.client.get(`updates/${update_id}.json`, callback);
	}

	/**
	 * Updates the current status update on the API, then modifies the object to match the edit
	 * @param  {object}   params   - The parameters to update
	 * @param  {Function} callback - The callback to run when the request has been fulfilled
	 */
	edit (params, callback) {
		this.promise.then(() => {
			this.client.post(`updates/${this.id}/update.json`, {
				text:         params.text         || this.text,
				now:          params.now          || this.now,
				media:        params.media        || this.media,
				utc:          params.utc          || false,
				scheduled_at: params.scheduled_at || this.scheduled_at
			}, (err, res) => {
				if (!err) {
					utils.mapObject(this, res.update);
				}

				callback(err, res);
			});
		});
	}

	/**
	 * Saves a status update to the user's buffer
	 * @param  {Function} callback - The callback to run when the request has been fulfilled
	 */
	save (callback = function () {}) {
		this.promise.then(() => {
			this.client.post('updates/create.json', {
				profile_ids:  this.profile_ids,
				text:         this.text,
				shorten:      this.shorten,
				now:          this.now,
				top:          this.top,
				media:        this.media,
				attachment:   this.attachment,
				scheduled_at: this.scheduled_at
			}, (err, res) => {
				if (!err && res.updates) {
					utils.mapObject(this, res.updates[0]);
				}

				callback(err, res);
			});
		});
	}

	/**
	 * Deletes a status update from the user's buffer
	 * @param  {Function} callback - The callback to run when the request has been fulfilled
	 */
	destroy (callback = function () {}) {
		this.promise.then(() => {
			this.client.post(`updates/${this.id}/destroy.json`, (err, res) => {
				if (!err) {
					// TODO:
					// There's probably a better way of doing this...
					// Ideally it wants to be scrubbed from the profile it's assigned to,
					// and the instance destroyed
					this.destroyed = true;
				}

				callback(err, res);
			});
		});
	}

	/**
	 * Instantly shares an update to the selected account
	 * @param  {Function} callback - The callback to run when the request has been fulfilled
	 */
	share (callback) {
		this.client.post(`updates/${this.id}/share.json`, (err, res) => {
			if (!err) {
				// The update object will have changed upon sharing, so map it
				this.getByID(this.id, (err, res) => {
					if (!err) {
						utils.mapObject(this, res);
						callback(err, res);
					}
				});
			}
		});
	}

	/**
	 * Gets interactions (e.g. retweets) from an update with a given ID
	 * @param  {object}   params   - A list of params to be appended to the URL.
	 * @param  {Function} callback - The callback to run when the request has been fulfilled
	 */
	getInteractions (event, params, callback) {
		this.client.post(`updates/${this.id}/interactions.json`, {
			event: event,
			page:  params.page  || null,
			count: params.count || null
		}, callback);
	}

	/**
	 * Moves the current update to the top of the Buffer queue
	 * @param  {Function} callback - The callback to run when the request has been fulfilled
	 */
	moveToTop (callback) {
		this.client.post(`updates/${this.id}/move_to_top.json`, callback);
	}
}