import utils from '../utils';
import Update from './update';
import async from 'async';

export default class Profile {
	constructor (profile_id) {
		this.updates = {
			sent:    {},
			pending: {}
		}

		this.promise = new Promise((resolve, reject) => {
			this.getByID(profile_id, (err, res) => {
				if (!err) {
					resolve(res);
				} else {
					throw err;
					reject();
				}
			});
		}).then((profile) => {
			// Map the profile to this object
			utils.mapObject(this, profile);
		});
	}

	get pending_updates () {
		return this.updates.pending;
	}

	set pending_updates (value) {
		this.updates.pending = value;
	}

	get sent_updates () {
		return this.updates.sent;
	}

	set sent_updates (value) {
		this.updates.sent = value;
	}

	/**
	 * Gets a single profile by its ID
	 * @param  {integer}  profile_id - The ID of the profile to retrieve
	 * @param  {Function} callback   - The callback to run when the request has been fulfilled
	 */
	getByID (profile_id, callback) {
		_bufferAPI.get(`profiles/${profile_id}.json`, callback);
	}

	/**
	 * Gets a list of pending updates for a given profile and associates them with this object
	 * @param  {object}   params   - API parameters to pass through to the URL
	 * @param  {Function} callback - The callback to run when the request has been fulfilled
	 */
	getPendingUpdates (params, callback) {
		if (typeof(params) === 'function') {
			callback = params;
			params   = '';
		}

		_bufferAPI.get(`profiles/${this.id}/updates/pending.json`, params, (err, res) => {
			if (!err) {
				async.forEachOf(res.updates, function (update, index, next) {
					res.updates[index] = new Update(update);
					res.updates[index].promise.then(next);
				}, (err) => {
					this.pending_updates = res.updates;
					callback(err, res);
				});
			} else {
				callback(err, res);
			}

		});
	}

	/**
	 * Gets a list of sent updates for a given profile and associates them with this object
	 * @param  {object}   params   - API parameters to pass through to the URL
	 * @param  {Function} callback - The callback to run when the request has been fulfilled
	 */
	getSentUpdates (params, callback) {
		if (typeof(params) === 'function') {
			callback = params;
			params   = '';
		}

		_bufferAPI.get(`profiles/${this.id}/updates/sent.json`, params, (err, res) => {
			if (!err) {
				async.forEachOf(res.updates, function (update, index, next) {
					res.updates[index] = new Update(update);
					res.updates[index].promise.then(next);
				}, (err) => {
					this.sent_updates = res.updates;
					callback(err, res);
				});
			} else {
				callback(err, res);
			}
		});
	}

	/**
	 * Reorders updates in the user's buffer, given a new order
	 * @param  {object}   params   - API parameters to pass through to the URL. "updates" must be present.
	 * @param  {Function} callback - The callback to run when the request has been fulfilled
	 */
	reorderUpdates (params, callback) {
		_bufferAPI.post(`profiles/${this.id}/updates/reorder.json`, params, callback);
	}

	/**
	 * Shuffles updates in the user's buffer at random
	 * @param  {Function} callback - The callback to run when the request has been fulfilled
	 */
	shuffleUpdates (params, callback = function () {}) {
		if (typeof(params) === 'function') {
			callback = params;
			params   = '';
		}

		_bufferAPI.post(`profiles/${this.id}/updates/shuffle.json`, params, callback);
	}
}