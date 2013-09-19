module.exports = function(grunt) {

  var pkg = grunt.file.readJSON('package.json');
  var config = require('./config');
  var styles = ['app.css'];
  var scripts = [
      'bower_components/bootstrap/dist/js/bootstrap.min.js',
      'bower_components/backbone.iobind/dist/backbone.iosync.min.js',
      'bower_components/backbone.iobind/dist/backbone.iobind.min.js',
      'js/models.js',
      'js/collections.js',
      'js/views.js',
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
          config: config,
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
            config: config,
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
        files: ['js/**'],
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
    },
    concurrent: {
      target: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    nodemon: {
      dev: {
        options: {
          file: 'app.js',
          watchedFolders: ['lib']
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
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('default', ['less', 'jade', 'copy', 'concat', 'uglify']);
  grunt.registerTask('dev', ['less:dev', 'jade:dev', 'copy', 'concurrent']);
  grunt.registerTask('prod', ['less:prod', 'jade:prod', 'concat', 'uglify', 'copy']);
};
