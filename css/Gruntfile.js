module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      css: {
          files: ['scss/*.scss'],
          tasks: ['sass'],
          options: {
              spawn: false,
          },
        }
    },
    sass: {
        dist: {
            options: {
                style: 'compressed'
            },
            files: {
                'styles.css': 'scss/base.scss'
            }
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('default', ['sass']);

};
