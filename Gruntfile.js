module.exports = function(grunt) {

  grunt.registerTask('server', 'Start a custom web server', function() {
    grunt.log.writeln('Started web server on port 3000');
    require('./app.js');
  });

  var pkg = grunt.file.readJSON('package.json');
  var styles = ['app.css'];
  var scripts = [
      'bower_components/bootstrap/dist/js/bootstrap.min.js',
//      'js/utils.js',
//      'js/models/buffer.js',
//      'js/models/message.js',
//      'js/models/server.js',
//      'js/models/user.js',
//      'js/collections.js',
//      'js/views/buffer.js',
//      'js/views/buffermenu.js',
//      'js/views/dropdownbuffer.js',
//      'js/views/input.js',
//      'js/views/message.js',
//      'js/views/server.js',
//      'js/views/userlist.js',
      'js/app.js',
      'js/connect.js'
  ];

  grunt.initConfig({
    less: {
      dev: {
        options: {
          paths: ['bower_components/bootstrap/less']
        },
        files: {
          'dist/app.css': 'less/source.less'
        }
      },
      prod: {
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
      dev: {
        files: {
          'dist/index.html': ['views/index.jade']
        },
        options: {
          pretty: true,
          data: {
            dev: true,
            version: pkg.version,
            scripts: scripts,
            styles: styles
          }
        }
      },
      prod: {
        files: {
          'dist/index.html': ['views/index.jade']
        },
        options: {
          data: {
            version: pkg.version,
            scripts: ['app.min.js'],
            styles: ['app.min.css']
          }
        }
      }
    },
    watch: {
      css: {
        files: '**/*.less',
        tasks: ['less:dev'],
      },
      jade: {
        files: '**/*.jade',
        tasks: ['jade:dev'],
      },
      js: {
        files: 'js/**',
        tasks: ['copy']
      }
    },
    copy: {
      main: {
        src: scripts,
        dest: 'dist/'
      },
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: scripts,
        dest: 'dist/app.js'
      }
    },
    uglify: {
      app: {
        files: {
          'dist/app.min.js': ['dist/app.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['less', 'jade', 'copy', 'concat', 'uglify']);
  grunt.registerTask('dev', ['less:dev', 'jade:dev', 'copy', 'server', 'watch']);
  grunt.registerTask('prod', ['less:prod', 'jade:prod', 'concat', 'uglify', 'copy']);
};
