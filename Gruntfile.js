module.exports = function(grunt) {
  grunt.initConfig({
    uglify: {
      my_target: {
        files: {
          'dist/open-api-js.min.js': ['lib/utils.js', 'lib/http-utils.js', 'lib/open-api-js.js']
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['uglify']);
}
