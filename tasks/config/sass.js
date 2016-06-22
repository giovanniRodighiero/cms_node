/**
 * `less`
 *
 * ---------------------------------------------------------------
 *
 * Compile your LESS files into a CSS stylesheet.
 *
 * By default, only the `assets/styles/importer.less` is compiled.
 * This allows you to control the ordering yourself, i.e. import your
 * dependencies, mixins, variables, resets, etc. before other stylesheets)
 *
 * For usage docs see:
 *   https://github.com/gruntjs/grunt-contrib-less
 *
 */
module.exports = function(grunt) {

  grunt.config.set('sass', {
    dev: {
      //digest: grunt.util.digest([ "styles/**/*.css" ], { algorithm: "md5" }),

      options: {
        sourcemap: 'inline'
      },
      files: [{
        expand: true,
        cwd: 'assets/styles/',
        src: ['**/*.sass','**/*.scss'],
        dest: '.tmp/public/styles/',
        ext: '.css'
      }]
    }
  });
  //grunt.loadNpmTasks("grunt-util-digest");
  grunt.loadNpmTasks('grunt-contrib-sass');
};
