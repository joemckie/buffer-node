describe('API: Updates', function () {
	let client, error, response;

	this.timeout(3000);

	before(function () {
		client = new BufferClient(app.access_key);
	});

	describe('Method: getUpdate', function () {
		before(function (done) {
			client.getUpdate('55be1d820a77bf335f978897', function (err, res) {
				error    = err;
				response = res;

				done();
			});
		});

		it('should not throw an error', function (done) {
			should.not.exist(error);
			done();
		})

		it('should return an object', function (done) {
			response.should.be.a('object');
			done();
		});
	});

	describe('Method: getPendingUpdates', function () {
		before(function (done) {
			client.getPendingUpdates('55bb89f1a3bedb612b10e50a', {
				page: 2
			}, function (err, res) {
				error    = err;
				response = res;

				done();
			});
		});

		it('should not throw an error', function (done) {
			should.not.exist(error);
			done();
		})

		it('should return an object', function (done) {
			response.should.be.a('object');
			done();
		});
	});

	describe('Method: getSentUpdates', function () {
		before(function (done) {
			client.getSentUpdates('55bb89f1a3bedb612b10e50a', {
				page: 2
			}, function (err, res) {
				error    = err;
				response = res;

				done();
			});
		});

		it('should not throw an error', function (done) {
			should.not.exist(error);
			done();
		})

		it('should return an object', function (done) {
			response.should.be.a('object');
			done();
		});
	});

	describe('Method: createUpdate', function () {
		before(function (done) {
			var data = {
				profile_ids: ['55bb89f1a3bedb612b10e50a', '55bb89f1a3bedb612b10e50a'],
				text: faker.lorem.sentences()
			};

			client.createUpdate(data, function (err, res) {
				error    = err;
				response = res;

				done();
			});
		});

		it('should not throw an error', function (done) {
			should.not.exist(error);
			done();
		})

		it('should return an object', function (done) {
			response.should.be.a('object');
			done();
		});

		it('should be successful', function (done) {
			response.success.should.be.true;
			done();
		});

		after(function (done) {
			done();
		});
	});
});