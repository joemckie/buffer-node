describe('API: Profile', function () {
	let client, error, response;

	this.timeout(3000);

	before(function () {
		client = new BufferClient(app.access_key);
	});

	describe('Route: /profiles', function () {
		before(function (done) {
			client.getProfiles(function (err, res) {
				error    = err;
				response = res;

				done();
			});
		});

		it('should not throw an error', function (done) {
			should.not.exist(error);
			done();
		})

		it('should return an array', function (done) {
			response.should.be.a('array');
			done();
		});
	});

	describe('Route: /profiles/:id', function () {
		before(function (done) {
			client.getProfileById('55b3d4a9474329e209b560ed', function (err, res) {
				error    = err;
				response = res;

				done();
			});
		});

		it('should not throw an error', function (done) {
			should.not.exist(error);
			done();
		});

		it('should throw an error if an invalid user is queried', function (done) {
			client.getProfileById('invalid-user', function (err, res) {
				should.exist(err);
				done();
			});
		});

		it('should return an object', function (done) {
			response.should.be.a('object');
			done();
		});
	});

	describe('Route: /profiles/:id/schedules', function () {
		before(function (done) {
			client.getProfileSchedules('55b3d4a9474329e209b560ed', function (err, res) {
				error    = err;
				response = res;

				done();
			});
		});

		it('should not throw an error', function (done) {
			should.not.exist(error);
			done();
		});

		it('should throw an error if an invalid user is queried', function (done) {
			client.getProfileSchedules('invalid-user', function (err, res) {
				should.exist(err);
				done();
			});
		});

		it('should return an array', function (done) {
			response.should.be.a('array');
			done();
		});
	});
});