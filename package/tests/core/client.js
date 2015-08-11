import test from 'selenium-webdriver/testing';
import express from 'express';

let client,
    driver,
    server = express();

before(function (done) {
	server.listen(3000, done);
});

after(function (done) {
	// Deauthorize the user AFTER all tests have been ran,
	// or else authentication will fail...
	client.deauthorizeUser(function (err, res) {
		should.not.exist(err);
		done();
	});
});

describe('Core Suite', function () {
	describe('Authentication', function () {
		it('should authenticate the user when returning from the OAuth gateway', function (done) {
			server.get('/authorize', function (req, res) {
				res.send(`<a id="authorize_link" href="${BufferClient.getAuthorizationUrl(app.client_id, app.redirect_url)}">Authorize</a>`);
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
					client._access_token.should.not.equal(req.query.code);

					// Clear out any previously queued updates before running tests
					client.getProfiles(function (err, res) {
						var profile = client.getProfile(app.profile_id);
						profile.getPendingUpdates(function (err, res) {
							async.forEachOf(profile.pending_updates, function (update, key, next) {
								update.destroy(next);
							}, function () {
								done();
							});
						});
					});
				});
			});

			this.timeout(100000);

			driver = new seleniumWebdriver
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
			driver.quit();
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

	describe('Instantiation', function () {
		it('should assign the authenticated flag', function (done) {
			client.should.have.property('_authenticated');
			done();
		});
		it('should assign the client ID', function (done) {
			client.should.have.property('_client_id');
			done();
		});
		it('should assign the client secret', function (done) {
			client.should.have.property('_client_secret');
			done();
		});
		it('should assign the access token', function (done) {
			client.should.have.property('_access_token');
			done();
		});
		it('should assign the redirect_url', function (done) {
			client.should.have.property('_access_token');
			done();
		});
		it('should assign the API version', function (done) {
			client.should.have.property('_api_version');
			done();
		});
		it('should assign the API protocol as HTTPS', function (done) {
			client.should.have.property('_protocol', 'https');
			done();
		});
		it('should assign the hostname as "api.bufferapp.com"', function (done) {
			client.should.have.property('_hostname', 'api.bufferapp.com');
			done();
		});
		it('should assign the host in the format "#{protocol}://#{hostname}"', function (done) {
			client.should.have.property('_host', `${client._protocol}://${client._hostname}`);
			done();
		});
		it('should set the options to be passed to querystring.stringify()', function (done) {
			client.should.have.property('_stringify_options');
			client._stringify_options.should.eql({
				arrayFormat: 'index'
			});
			done();
		});
		it('should generate the OAuth client', function(done) {
			client.should.have.property('client');
			done();
		});
		it('should retrieve the Buffer configuration', function (done) {
			client.should.have.property('config');
			done();
		});
	});

	describe('API Interaction', function () {
		describe('Method: get', function () {
			it('should respond', function (done) {
				expect(client).to.respondTo('get');
				done();
			});
			it('should not throw an error', function (done) {
				client.get('info/configuration.json', function (err, res) {
					should.not.exist(err);
					done();
				});
			});
			it('should use HTTPS', function (done) {
				client.get('info/configuration.json', function (err, res, response) {
					should.exist(response.req.agent.sockets[`${client._hostname}:443`]);
					done();
				});
			});
			it('should use the GET method', function (done) {
				client.get('info/configuration.json', function (err, res, response) {
					response.req.method.should.equal('GET');
					done();
				});
			});
		});
		describe('Method: post', function () {
			it('should respond', function (done) {
				expect(client).to.respondTo('post');
				done();
			});
			it('should not throw an error', function (done) {
				client.post(`profiles/${app.profile_id}/updates/shuffle.json`, function (err, res, response) {
					should.not.exist(err);
					done();
				});
			});
			it('should use HTTPS', function (done) {
				client.post(`profiles/${app.profile_id}/updates/shuffle.json`, function (err, res, response) {
					should.exist(response.req.agent.sockets[`${client._hostname}:443`]);
					done();
				});
			});
			it('should use the POST method', function (done) {
				client.post(`profiles/${app.profile_id}/updates/shuffle.json`, function (err, res, response) {
					response.req.method.should.equal('POST');
					done();
				});
			});
		});
	});

	describe('Profiles', function () {
		describe('Method: getProfiles', function () {
			it('should respond', function (done) {
				expect(client).to.respondTo('getProfiles');
				done();
			});
			it('should not throw an error', function (done) {
				client.getProfiles(function (err, res) {
					should.not.exist(err);
					done();
				});
			});
			it('should associate the profiles with the client', function (done) {
				client.getProfiles(function (err, res) {
					client._profiles.should.exist;
					done();
				});
			});
			it('should instantiate each profile with the Profile object', function (done) {
				client._profiles[app.profile_id].should.be.an.instanceOf(Profile);
				done();
			});
		});

		describe('Method: getProfile', function () {
			it('should respond', function (done) {
				expect(client).to.respondTo('getProfile');
				done();
			});
			it('should retrieve the list of profiles', function (done) {
				client.getProfile(app.profile_id).should.be.instanceOf(Profile);
				done();
			});
		});
	});
});