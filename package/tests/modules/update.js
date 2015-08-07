import Update from '../../src/modules/update';

describe('Module: Update', function () {
	let client, update;

	this.timeout(3000);

	describe('Instantiation', function () {
		afterEach(function (done) {
			update = undefined;
			done();
		});

		it('should be able to be instantiated with an update ID', function (done) {
			update = new Update({
				id: '1',
				profile_ids: [app.profile_id],
				text: faker.lorem.sentences()
			});

			update.save(function (err, res) {
				var queried_update = new Update(res.updates[0].id);
				queried_update.promise.then(() => {
					queried_update.id.should.equal(res.updates[0].id);

					update.destroy();
					queried_update.destroy();

					done();
				});
			});
		});

		it('should be able to be instantiated with an update object', function (done) {
			update = new Update({
				id: '1',
				profile_ids: [app.profile_id],
				text: faker.lorem.sentences()
			});
			update.promise.then(function () {
				should.exist(update.id);
				done();
			});
		})
	});

	describe('Method: save', function () {
		beforeEach(function (done) {
			update = new Update({
				profile_ids: [app.profile_id],
				text: faker.lorem.sentences()
			});

			done();
		});

		afterEach(function (done) {
			update.destroy(done);
		});

		it('should not throw an error', function (done ) {
			update.save(function (err, res) {
				should.not.exist(err);
				res.success.should.be.true;
				done();
			});
		});

		it('should assign the saved ID to the Update object', function (done) {
			update.save(function (err, res) {
				should.exist(update.id);
				done();
			});
		});
	});

	describe('Method: destroy', function () {
		beforeEach(function (done) {
			update = new Update({
				profile_ids: [app.profile_id],
				text: faker.lorem.sentences()
			});
			update.save(done);
		});

		it('should not throw an error', function (done) {
			update.destroy(function (err, res) {
				should.not.exist(err);
				done();
			});
		});

		it('should add an attribute to flag the update as destroyed', function (done) {
			update.destroy(function (err, res) {
				should.exist(update.destroyed);
				done();
			});
		});
	});

	describe('Method: edit', function () {
		var new_params = {
			text: 'Edited text'
		};

		beforeEach(function (done) {
			update = new Update({
				profile_ids: [app.profile_id],
				text: faker.lorem.sentences()
			});

			update.save(done);
		});

		afterEach(function (done) {
			update.destroy(done);
		});

		it('should not throw an error', function (done) {
			update.edit(new_params, function (err, res) {
				should.not.exist(err);
				res.success.should.be.true;
				done();
			});
		});

		it('should change edit the update object to reflect the new values', function (done) {
			update.edit(new_params, function (err, res) {
				update.text.should.equal(new_params.text);
				done();
			});
		});
	});

	describe('Method: share', function () {
		beforeEach(function (done) {
			update = new Update({
				profile_ids: [app.profile_id],
				text: faker.lorem.sentences()
			});

			update.save(done);
		});

		it('should not throw an error', function (done) {
			update.share(function (err, res) {
				should.not.exist(err);
				done();
			});
		});

		it('should retrieve the shared update and map it to the current object', function (done) {
			update.share(function (err, res) {
				update.shared_now.should.be.true;
				update.status.should.equal('sent');
				update.service_link.should.not.be.empty;
				done();
			});
		});
	});

	describe('Method: getInteractions', function () {
		beforeEach(function (done) {
			update = new Update({
				profile_ids: [app.profile_id],
				text: faker.lorem.sentences()
			});

			update.save(done);
		});

		afterEach(function (done) {
			update.destroy(done);
		});

		it('should not throw an error', function (done) {
			update.getInteractions('retweet', {}, function (err, res) {
				should.not.exist(err);
				done();
			});
		});
	});

	describe('Method: moveToTop', function () {
		beforeEach(function (done) {
			update = new Update({
				profile_ids: [app.profile_id],
				text: faker.lorem.sentences()
			});

			update.save(done);
		});

		afterEach(function (done) {
			update.destroy(done);
		});

		it('should not throw an error', function (done) {
			update.moveToTop(function (err, res) {
				should.not.exist(err);
				done();
			});
		});
	});
});