describe('API: Links', function () {
	let client, error, response;

	this.timeout(3000);

	before(function () {
		client = new BufferClient(app.access_key);
	});

	describe('Method: getLinkShares', function () {
		before(function (done) {
			client.getLinkShares('http://www.bufferapp.com/', function (err, res) {
				error    = err;
				response = res;

				done();
			});
		});

		it('should not throw an error', function (done) {
			should.not.exist(error);
			done();
		});

		it('should return an object', function (done) {
			response.should.be.a('object');
			done();
		});
	});
});