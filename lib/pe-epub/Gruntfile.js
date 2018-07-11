module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    handlebars : {
      compile : {
        options : {
          node : true
        },
        files: {
              "templates/templates.js": ['templates/container.xml', 'templates/content.opf','templates/page.html', 'templates/toc.html', 'templates/toc.ncx', 'templates/com.apple.ibooks.display-options.xml']
        }
      }
    },
    jslint : {
      files : 'Peepub.js',
      directives : {
        indent : 2,
        nomen : true,
        sloppy : true,
        stupid : true,
        vars : true,
        white : true,
        node : true
      },
      options : {
        errorsOnly : true
      }
    },
    browserify : {
      'build/pe-epub.js' : './Peepub.js'
    }
  });

  grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-release');

  // Default task(s).
  grunt.registerTask('default', ['handlebars']);

  /*
  grunt.registerTask('default', 'default', function () {
    var tasks = ['handlebars', 'browserify'];

    // always use force when watching
    grunt.option('force', true);
    grunt.task.run(tasks);
  });
  */

};