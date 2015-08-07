var server = require('express')(),
    test = require('selenium-webdriver/testing');

test.describe('Core Suite', function () {
	let client;

	before(function (done) {
		this.timeout(10000);

		server.get('/deauthorize', function (req, res) {
			client.deauthorizeUser(function (err) {
				res.redirect('/');
			});
		});

		server.listen(3000, done);
	});

	test.describe('Authentication', function () {
		it('should authenticate the user when returning from the OAuth gateway', function (done) {
			server.get('/authorize', function (req, res) {
				res.send('<a id="authorize_link" href="' + BufferClient.getAuthorizationUrl(app.client_id, app.redirect_url) +'">Authorize</a>');
			})
			server.get('/verify', function (req, res) {
	 			client = new BufferClient({
					access_token: req.query.code,
					client_id: app.client_id,
					client_secret: app.client_secret,
					redirect_url: app.redirect_url,
					authenticated: false
				}, function (err, res) {
					client._authenticated.should.be.true;
					driver.quit();
					done();
				});
			});

			this.timeout(30000);

			var driver = new seleniumWebdriver
			  .Builder()
			  .forBrowser('phantomjs')
			  .build();

			// Click through to the authorization page
			driver.get('http://localhost:3000/authorize');
			driver.findElement(By.tagName('a')).click();

			// Log in to Buffer
			driver.findElement(By.id('email')).sendKeys('buffertest@joemck.ie');
			driver.findElement(By.id('password')).sendKeys('password');
			driver.findElement(By.name('signin')).click();

			driver.findElement(By.className('allow')).click();
		});
	});

	describe('Instantiation', function () {
		it('should allow access to the API', function (done) {
			client.get('info/configuration.json', function (err, res) {
				should.not.exist(err);
				done();
			});
		});

		it('should retrieve the Buffer configuration', function (done) {
			should.exist(client.config);
			done();
		});
	});

	describe('Method: getAuthorizationUrl', function () {
		it('should include the client ID', function (done) {
			BufferClient.getAuthorizationUrl(app.client_id, app.redirect_url).should.include(app.client_id);
			done();
		});
		it('should include the redirect URI', function (done) {
			BufferClient.getAuthorizationUrl(app.client_id, app.redirect_url).should.include(encodeURIComponent(app.redirect_url));
			done();
		});
	});
});