// Generated on 2014-06-22 using generator-nodejs 2.0.0
module.exports = function (grunt) {
  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      complexity: {
          generic: {
              src: ['app/**/*.js'],
              options: {
                  errorsOnly: false,
                  cyclometric: 6,       // default is 3
                  halstead: 16,         // default is 8
                  maintainability: 100  // default is 100
              }
          }
      },
      jshint: {
          all: [
              'Gruntfile.js',
              'app/**/*.js',
              'test/**/*.js'
          ],
          options: {
              jshintrc: '.jshintrc'
          }
      },
      mochacli: {
          all: ['test/**/*.js'],
          options: {
              reporter: 'spec',
              ui: 'tdd'
          }
      },
      watch: {
          js: {
              files: ['**/*.js', '!node_modules/**/*.js'],
              tasks: ['default'],
              options: {
                  nospawn: true
              }
          }
      },
      ngdocs: {
          options: {
              dest: 'docs',
              //scripts: ['../app.min.js'],
              html5Mode: true,
              startPage: '/api',
              title: "Validation engine",
              //image: "path/to/my/image.png",
              imageLink: "http://my-domain.com",
              titleLink: "/api",
              bestMatch: true,
              analytics: {
                  account: 'UA-08150815-0',
                  domainName: 'my-domain.com'
              },
              discussions: {
                  shortName: 'my',
                  url: 'http://my-domain.com',
                  dev: false
              }
          },
          tutorial: {
              src: ['content/tutorial/*.ngdoc'],
              title: 'Tutorial'
          },
          api: {
              src: ['validation/**/*.js'],
              title: 'API Documentation'
          }
      },
      typedoc: {
          build: {
              options: {
                  module: 'commonjs',
                  out: './typedDocs',
                  name: 'ValidationEngine',
                  target: 'es5'
              },
              src: ['./validation/**/*']
          }
      },
      docular: {
          groups: [],
          showAngularDocs: true,
          groupTitle: 'Validation engine', //Title used in the UI
          groupId: 'angular', //identifier and determines directory
          groupIcon: 'icon-book', //Icon to use for this group
          sections: [
              {
                  id: "api",
                  title: "Angular API",
                  scripts: ['./validation/**/*.js']
              },
              {
                  id: "guide",
                  title: "Developers Guide",
                  docs: ["./content/guide"]
              },
              {
                  id: "tutorial",
                  title: "Tutorial",
                  docs: ["./content/tutorial"]
              }
          ]
      },
      typescript: {
          base: {
              src: ['validation/rules.ts'],
              dest: '.dist/validation.js',
              options: {
                  //module: 'amd',
                  target: 'es5',
                  declaration: false

              }
          }
      }
  });

  grunt.loadNpmTasks('grunt-docular');
  grunt.loadNpmTasks('grunt-complexity');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.loadNpmTasks('grunt-ngdocs');
  grunt.loadNpmTasks('grunt-typedoc');
  grunt.loadNpmTasks('grunt-typescript');

  grunt.registerTask('test', ['complexity', 'jshint', 'mochacli', 'watch']);
  grunt.registerTask('ci', ['complexity', 'jshint', 'mochacli']);
  grunt.registerTask('default', ['test']);
  grunt.registerTask('docular', ['docular']);
  grunt.registerTask('tsc', ['typescript']);
  grunt.registerTask('document', ['ngdocs']);
  grunt.registerTask('documentTypescrip', ['typedoc']);
};
