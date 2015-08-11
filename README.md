# Buffer for Node

[![Build Status](https://travis-ci.org/joemckie/buffer-node.svg?branch=master)](https://travis-ci.org/joemckie/buffer-node)
[![Coverage Status](https://coveralls.io/repos/joemckie/buffer-node/badge.svg?branch=master&service=github)](https://coveralls.io/github/joemckie/buffer-node?branch=master)
[![npm version](https://badge.fury.io/js/buffer-node-api.svg)](http://badge.fury.io/js/buffer-node-api)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/joemckie/buffer-node?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

[![NPM](https://nodei.co/npm/buffer-node-api.png)](https://nodei.co/npm/buffer-node-api/)

## Getting started:

### Installation

To get started with this package, install it with `npm i buffer-node-api --save`.

### Usage

For simplicity, examples will be shown using the ES5 syntax.

##### Express

*In a real world situation, you should save the client in the user's session, and not overwrite the client variable on the server.*

```javascript
var BufferClient = require('buffer-node-api'),
    app          = require('express')(),
    client       = null;
  
// Returning from the OAuth gateway
app.get('/verify', function (req, res) {
  client = new BufferClient({
    access_token: req.query.code,
    client_id: '<your_client_id>',
    client_secret: '<your_client_secret>',
    redirect_url: '<your_redirect_url>',
    authenticated: false
  }, function (err, result) {
    if (!err) {
      // Client instantiated correctly, you should redirect away from this page
    }
  });
});

app.get('/login', function (req, res) {
  var auth_url = BufferClient.getAuthorizationUrl('<your_client_id>', '<your_redirect_url>');
  
  // Use auth_url somewhere on your page to link to Buffer's authorisation gateway page
});

app.get('/deauthorize', function (req, res) {
  client.deauthorizeUser(function (err, result) {
    if (!err) {
      // User deauthorised. Redirect away
    }
  });
});
```

## Documentation

For full code documentation and examples, click [here](http://joemckie.github.io/buffer-node).

## Licence:

This package is released under the [**MIT Licence**](http://opensource.org/licenses/MIT). This means you're free to use it at no cost in any of your commercial or non-commercial projects. If you want to contribute to this project, great! Please read below for instructions on how to get involved.

## Contributing:

~~Getting started is easy with the [Vagrant](http://vagrantup.com)  VM. Simply run `vagrant up` and then `vagrant ssh`.~~ There is currently a bug in the Chef provisioning preventing the Vagrant instance from starting. Looking into it and will apply a fix ASAP. For now, please ignore this step.

Please follow the following guidelines when writing new code:

1. Nobody likes being wet. Stay [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).
1. Follow the [Boy Scout Rule](http://programmer.97things.oreilly.com/wiki/index.php/The_Boy_Scout_Rule). Litterers will be punished!
1. All source code is written in ES6 and transpiled with [Babel](https://babeljs.io/). No ES5 code, please!
1. Test your code with the `npm test` command and check for coverage using `npm run coverage`. If possible, aim for 100% coverage - the Travis/Coveralls build process will fail if the overall value falls below 80%.
1. Don't be [this guy](http://www.commitlogsfromlastnight.com/). Meaningless commit messages make me sad :(
