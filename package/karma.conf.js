module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],

    plugins: [
      'karma-coverage',
      'karma-babel-preprocessor',
      'karma-phantomjs-launcher',
      'karma-mocha'
    ],

    frameworks: ['mocha'],

    files: [
      'src/**/*.js',
    ],

    reporters: ['coverage'],

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'src/**/*.js': ['babel', 'coverage'],
    },

    // optionally, configure the reporter
    coverageReporter: {
    	instrumenters: { isparta: require('isparta') },
    	instrumenter: {
    		'**/*.js': 'isparta'
    	},
    	reporters: [
        {
          type: 'cobertura'
        },
	    	{
	    		type: 'html',
	    		dir: 'coverage/'
	    	}
    	]
    }
  });
};