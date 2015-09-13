module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bower: { install: { } },
    bower_concat: {
      all: {
        dest: 'lib/_bower.js'
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    "qunit-serverless": {
        all: {
            options: {
                includeFiles: ["lib/_bower.js", "src/**/*.js"],
                testFiles: "test/**/*.js",
            }
        }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          console: true,
          module: true,
          document: true
        }
      }
    },
    clean: ["lib/", "bower_components/", "dist/", "node_modules/"]
  });

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-qunit-serverless');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('prepare', ['bower', 'bower_concat', 'jshint']);
  grunt.registerTask('run-tests', ['qunit-serverless']);
  grunt.registerTask('build', ['concat', 'uglify']);

  grunt.registerTask('test', function() {
    grunt.task.run('prepare');
    grunt.task.run('run-tests');
  });
  grunt.registerTask('default', function() {
    grunt.task.run('prepare');
    grunt.task.run('run-tests');
    grunt.task.run('build');
  });

};
