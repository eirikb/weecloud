module.exports = function(grunt) {

  grunt.initConfig({
    less: {
      development: {
        options: {
          paths: ['bower_components/bootstrap/less'],
        },
        files: {
          'dist/app.css': 'assets/less/source.less'
        }
      },
      production: {
        options: {
          paths: ['bower_components/bootstrap/less'],
          yuicompress: true
        },
        files: {
          'dist/app.min.css': 'assets/less/source.less'
        }
      }
    },
    jade: {
      compile: {
        files: {
          'dist/index.html': ['views/index.jade']
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
    },
    connect: {
      server: {
        options: {
          port: 8080,
          base: 'dist'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('default', ['less', 'jade']);
  grunt.registerTask('dev', ['default', 'connect', 'watch']);
};
