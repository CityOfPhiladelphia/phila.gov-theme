module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      css: {
          files: ['css/scss/*.scss'],
          tasks: ['sass'],
          options: {
              spawn: false,
          }
        },
      scripts: {
          files: ['js/dev/*.js'],
          tasks: ['uglify']
        }
    },
    sass: {
        dist: {
            options: {
                style: 'compressed'
            },
            files: {
                'css/styles.css': 'css/scss/base.scss'
            }
        }
    },
    uglify: {
        dist: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> phila-theme.min.js <%= grunt.template.today("yyyy-mm-dd h:MM:ss TT") %> */\n'
            },
            files: {
                'js/phila-scripts.min.js' : [
                    'js/dev/scripts.js',
                    'js/dev/navigation.js',
                    'js/dev/skip-link-focus.js',
                ]
            }
        },
        dev: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> phila-theme.js <%= grunt.template.today("yyyy-mm-dd h:MM:ss TT") %> */\n',
                beautify: true,
                compress: false,
                mangle: false
            },
            files: {
                'js/phila-scripts.js' : [
                  'js/dev/scripts.js',
                  'js/dev/navigation.js',
                  'js/dev/skip-link-focus.js',
                ]
            }
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');


  grunt.registerTask('default', ['sass', 'uglify']);

};
