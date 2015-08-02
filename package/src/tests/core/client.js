describe('Core Suite', function () {
	let client;

	before(function (done) {
		client = new BufferClient(app.access_key);
		should.exist(client.client);
		done();
	});

	it('should allow access to the API', function (done) {
		client.get('user.json', function (err, res) {
			should.not.exist(err);
			done();
		});
	});
});