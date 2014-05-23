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
      scripts: {
        files: ['<%= jshint.files %>'],
        tasks: ['jshint', 'buster::test']
      },
      css: {
        files: 'sass/**/*.scss',
        tasks: ['sass'],
        options: {
          livereload: false, // for now
        },
      },
    },
    bower: {
      install: {
      }
    },
    buster: {
      app: {}
    },
    useminPrepare: {
      html: ['index.html', 'stats.html', 'app.html'],
      options: {
        dest: 'dist'
      }
    },
    cssmin: {
      // no css yet
      combine: {
        files: {
          'dist/main.css': 'dist/main.css'
        },
        report: 'min'
      }
    },
    rev: {
      files: {
        src: ['dist/overtime.min.js', 'dist/main.css']
      }
    },
    usemin: {
      html: ['dist/index.html', 'dist/stats.html', 'dist/app.html'],
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: false,
          collapseWhitespace: false
        },
        files: {
          'dist/index.html': 'index.html',
          'dist/stats.html': 'stats.html',
          'dist/app.html': 'app.html'
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
    },
    sass: {
      dist: {
        files: {
          'dist/main.css': 'sass/main.scss'
        }
      }
    },
    copy: {
      main: {
        src: 'fonts/*',
        dest: 'dist/',
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-buster');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-rev');

  grunt.registerTask('test', ['jshint', 'buster']);

  grunt.registerTask('default', ['jshint', 'buster::test', 'concat', 'uglify', 'sass', 'copy']);

  grunt.registerTask('build', ['clean', 'copy', 'htmlmin:dist', 'useminPrepare', 'concat', 'uglify', 'sass', 'cssmin', 'rev', 'usemin', 'clean:unused_files']);
};
