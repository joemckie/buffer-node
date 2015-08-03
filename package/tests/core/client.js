describe('Core Suite', function () {
	let client;

	before(function (done) {
		client = new BufferClient(app.access_key, done);
		should.exist(client.client);
	});

	it('should allow access to the API', function (done) {
		client.get('user.json', function (err, res) {
			should.not.exist(err);
			done();
		});
	});

	it('should retrieve the Buffer configuration', function (done) {
		should.exist(client.config);
		done();
	});
});