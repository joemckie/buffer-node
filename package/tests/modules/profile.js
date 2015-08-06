import Profile from '../../src/modules/profile';
import Update from '../../src/modules/update';
import utils from '../../src/utils';

describe('Module: Profile', function () {
	let profile, updates;

	this.timeout(3000);

	before(function () {
		new BufferClient(app.access_key);
	});

	beforeEach(function (done) {
		profile = new Profile(app.profile_id);
		profile.promise.then(done);
	});

	describe('Instantiation', function () {
		afterEach(function (done) {
			profile = undefined;
			done();
		});

		it('should be able to be instantiated with an profile ID', function (done) {
			profile = new Profile(app.profile_id);
			profile.promise.then(function () {
				profile.id.should.equal(app.profile_id);
				done();
			});
		});
	});

	describe('Property: pending_updates', function () {
		it('should retrieve the pending update list', function (done) {
			profile.pending_updates.should.equal(profile.updates.pending);
			done();
		});
	});

	describe('Property: sent_updates', function () {
		it('should retrieve the sent update list', function (done) {
			profile.sent_updates.should.equal(profile.updates.sent);
			done();
		});
	});

	describe('Method: getPendingUpdates', function () {
		beforeEach(function (done) {
			this.timeout(10000);

			updates = []

			async.times(5, function (n, next) {
				var update = new Update({
					profile_ids: [app.profile_id],
					text: faker.lorem.sentences()
				});
				update.save(function () {
					updates.push(update);
					next();
				});
			}, done);
		});

		afterEach(function (done) {
			async.each(updates, function (update, next) {
				update.destroy(next);
			}, done);
		});

		it('should not throw an error', function (done) {
			profile.getPendingUpdates(function (err, res) {
				should.not.exist(err);
				done();
			});
		});

		it('should associate the pending updates with the profile', function (done) {
			profile.getPendingUpdates(function (err, res) {
				profile.updates.pending.should.not.be.empty;
				done();
			});
		});
	});

	describe('Method: getSentUpdates', function () {
		it('should not throw an error', function (done) {
			profile.getSentUpdates(function (err, res) {
				should.not.exist(err);
				done();
			});
		});

		it('should associate the sent updates with the profile', function (done) {
			profile.getSentUpdates(function (err, res) {
				profile.updates.sent.should.not.be.empty;
				done();
			});
		});
	});

	describe('Method: reorderUpdates', function () {
		beforeEach(function (done) {
			this.timeout(10000);

			updates = [];

			async.times(5, function (n, next) {
				var update = new Update({
					profile_ids: [app.profile_id],
					text: faker.lorem.sentences()
				});
				update.save(function () {
					updates.push(update);
					next();
				});
			}, done);
		});

		afterEach(function (done) {
			async.each(updates, function (update, next) {
				update.destroy(next);
			}, done);
		});

		it('should not throw an error', function (done) {
			var shuffled_update_ids = [];

			utils.shuffleArray(updates).forEach(function (update) {
				shuffled_update_ids.push(update.id);
			});

			profile.reorderUpdates({
				order: shuffled_update_ids
			}, function (err, res) {
				should.not.exist(err);
				done();
			});
		});
	});

	describe('Method: shuffleUpdates', function () {
		beforeEach(function (done) {
			this.timeout(10000);

			updates = [];

			async.times(5, function (n, next) {
				var update = new Update({
					profile_ids: [app.profile_id],
					text: faker.lorem.sentences()
				});
				update.save(function () {
					updates.push(update);
					next();
				});
			}, done);
		});

		afterEach(function (done) {
			async.each(updates, function (update, next) {
				update.destroy(next);
			}, done);
		});

		it('should not throw an error', function (done) {
			profile.shuffleUpdates(function (err, res) {
				should.not.exist(err);
				done();
			});
		});

		it('should return successful', function (done) {
			profile.shuffleUpdates(function (err, res) {
				res.success.should.be.true;
				done();
			});
		});
	});
});