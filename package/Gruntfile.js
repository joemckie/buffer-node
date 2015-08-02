'use strict';

module.exports = function(grunt) {

  // show elapsed time at the end
  require('time-grunt')(grunt);

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

    grunt.initConfig({
      env: {
        test: {
          NODE_ENV: 'test'
        }
      },

      babel: {
        dist: {
          files: {
            'dist/client.js': 'src/client.js'
          }
        }
      },

      mochaTest: {
        options: {
          clearRequireCache: true,
          run: true,
          spawn: false,
          require: [
            'tests/globals'
          ],
        },
        all: {
          src: ['tests/**/*.js'],
        },
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
          files: ['**/*.js'],
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
      'mochaTest',
      'watch'
    ]);

    grunt.registerTask('compile', ['babel'])

    grunt.registerTask('test', ['env:test', 'mochaTest:all']);
}
