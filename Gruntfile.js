// Generated on 2014-06-22 using generator-nodejs 2.0.0
module.exports = function (grunt) {
  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      complexity: {
          generic: {
              src: ['src/**/*.js'],
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
              'src/**/*.js',
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
              ui: 'bdd'
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
                  out: './docs',
                  name: 'ValidationEngine',
                  target: 'es5'
              },
              src: ['src/validation/**/*','src/customValidators/**/*']
          }
      },
      typescript: {
          base: {
              src: ['src/validation/rules.ts'],
              dest: 'dist/<%= pkg.name %>.js',
              options: {
                  //module: 'amd',
                  target: 'es5',
                  declaration: false,
                  comments:false
              }
          }
      },
//      typescript: {
//          base: {
//              src: ['src/customValidators/*.ts','src/localization/*.ts'],
//              dest: 'distNode/lib',
//              options: {
//                  module: 'commonjs',
//                  target: 'es5',
//                  declaration: false,
//                  after:['uglify'],
//                  comments:false,
//                  basePath:'src'
//              }
//          }
//      },
      uglify: {
          options: {
              // the banner is inserted at the top of the output
              banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
          },
          dist: {
              files: {
                  'dist/<%= pkg.name %>.min.js': ['<%= typescript.base.dest %>'],
                  'dist/node-<%= pkg.name %>.min.js': ['dist/node-<%= pkg.name %>.js']
              }
          }
      },
      // this task
      command : {
//          run_shell: {
//              type : 'shell',
//              cmd  : './test.sh'
//          },
//          run_bat: {
//              type : 'bat',
//              cmd  : 'test.bat'
//          },
          run_cmd: {
              cmd: ['tsc src/validation/rules.ts -t ES5 -out typings/node-form/node-form.js -d']
              //cmd: ['mkdir jjj']
          }
      },
      copy: {
          main: {
              files: [
                  // includes files within path
                  {expand: true, src: ['src/localization/*.js'], dest: 'dist/i18n', filter: 'isFile',flatten:true},
                  {expand: true, src: ['src/customValidators/*.js'], dest: 'dist/customValidators', filter: 'isFile',flatten:true}

                  // includes files within path and its sub-directories
                  //{expand: true, src: ['src/models/vacationApproval/locales/**'], dest: 'dest/'},

                  // makes all src relative to cwd
                  //{expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'},

                  // flattens results to a single level
                  //{expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'}
              ]
          }
      },
      concat: {
          dist: {
              files: {
                  //'dist/basic.js': ['src/main.js'],
                  'dist/node-form.js': ['<%= typescript.base.dest %>', 'src/validation/commonjs.js']

              }
          },
          typings:{
              files: {
                  'typings/node-form/node-form.d.ts': ['typings/node-form/header.d.js', 'typings/node-form/node-form.d.ts', 'typings/node-form/footer.d.js']
              }
          }
      }
  });

  grunt.loadNpmTasks('grunt-complexity');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.loadNpmTasks('grunt-ngdocs');
  grunt.loadNpmTasks('grunt-typedoc');
  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-contrib-commands');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('test', [ 'mochacli', 'watch']);
  grunt.registerTask('ci', ['complexity', 'jshint', 'mochacli']);
  grunt.registerTask('default', ['test']);
  grunt.registerTask('dist', ['typescript','concat:dist','uglify','copy']);
  grunt.registerTask('typings',['command']);
  grunt.registerTask('typings-concat',['concat:typings']);
  grunt.registerTask('document', ['typedoc']);
};
