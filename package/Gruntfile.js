'use strict';

module.exports = function(grunt) {

  // show elapsed time at the end
  require('time-grunt')(grunt);

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

    grunt.initConfig({
      clean: {
        dist: ['lib']
      },

      env: {
        test: {
          SELENIUM_SERVER_JAR: require('selenium-server-standalone-jar').path,
          NODE_ENV: 'test'
        }
      },

      babel: {
        dist: {
          files: {
            'lib/client.js': 'src/client.js'
          }
        }
      },

      esdoc: {
        dist: {
          options: {
            coverage: false,
            source: './src',
            destination: './doc',
            test: {
              type: 'mocha',
              source: './tests'
            }
          }
        }
      },

      mochaTest: {
        options: {
          clearRequireCache: true,
          require: ['tests/globals'],
          run: true
        },
        src: ['tests/**/*.js']
      },

      // Watch files and compile them when they change
      watch: {
        options: {
          livereload: true,
          spawn: false
        },
        tests: {
          options: {
            debounceDelay: 0,
            livereload: false
          },
          files: ['tests/**/*.js'],
          tasks: ['mochaTest']
        }
      }
    });

    grunt.event.on('watch', function (action, filepath) {
      // When a file changes, we only want to process that one file
      // (or else the compilation time is 10-20s!). This will set
      // the files for MochaTest to only process the changed file.

      if (filepath.match('tests/')) {
        grunt.config.set('mochaTest.all.src', filepath);
      }
    });

    grunt.registerTask('develop', [
      'test',
      'watch'
    ]);

    grunt.registerTask('compile', ['clean:dist', 'babel'])
    grunt.registerTask('test', ['env:test', 'mochaTest']);
}
