module.exports = function(grunt) {

  grunt.registerTask('server', 'Start a custom web server', function() {
    grunt.log.writeln('Started web server on port 3000');
    require('./app.js');
  });

  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({
    less: {
      development: {
        options: {
          paths: ['bower_components/bootstrap/less'],
        },
        files: {
          'dist/app.css': 'less/source.less'
        }
      },
      production: {
        options: {
          paths: ['bower_components/bootstrap/less'],
          yuicompress: true
        },
        files: {
          'dist/app.min.css': 'less/source.less'
        }
      }
    },
    jade: {
      compile: {
        files: {
          'dist/index.html': ['views/index.jade']
        },
        options: {
          data: pkg
        }
      }
    },
    watch: {
      css: {
        files: '**/*.less',
        tasks: ['less'],
      },
      jade: {
        files: '**/*.jade',
        tasks: ['jade'],
      },
      js: {
        files: 'js/*.js',
        tasks: ['copy']
      }
    },
    copy: {
      main: {
        expand: true,
        cwd: 'js/',
        src: '*',
        dest: 'dist/js/'
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['less', 'jade', 'copy']);
  grunt.registerTask('dev', ['default', 'server', 'watch']);
};
