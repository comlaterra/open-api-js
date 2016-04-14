module.exports = function(grunt) {
  grunt.initConfig({
    uglify: {
      my_target: {
        files: {
          'dist/open-api-js.min.js': ['lib/utils.js', 'lib/http-utils.js', 'lib/swagger-js-api.js']
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['uglify']);
}
