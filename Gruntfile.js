module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/**/*.js', 'lib/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
        mangle: true,
        compress: true,
        report: 'min'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'buster']
    },
    bower: {
      install: {
      }
    },
    buster: {
      app: {}
    },
    useminPrepare: {
      html: 'index.html',
      options: {
        dest: 'dist'
      }
    },
    cssmin: {
      // no css yet
      combine: {
        files: {}
      }
    },
    rev: {
      files: {
        src: ['dist/overtime.min.js']
      }
    },
    usemin: {
      html: 'dist/index.html',
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: false,
          collapseWhitespace: false
        },
        files: {
          'dist/index.html': 'index.html'
        }
      },
    },
    clean: {
      dist: ['dist'],
      unused_files: ['dist/<%= pkg.name %>.js']
    },
    connect: {
      server: {
        options: {
          keepalive: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-buster');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-rev');

  grunt.registerTask('test', ['jshint', 'buster']);

  grunt.registerTask('default', ['jshint', 'buster', 'concat', 'uglify']);

  grunt.registerTask('build', ['clean', 'htmlmin:dist', 'useminPrepare', 'concat', 'cssmin', 'uglify', 'rev', 'usemin', 'clean:unused_files']);
};
