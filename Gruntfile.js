module.exports = function(grunt) {

    // Tasks
    grunt.initConfig({
        concat: {
            options: {
                separator: ';'
            },
            bower: {
                src: [
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/underscore/underscore.js',
                    'bower_components/backbone/backbone.js'
                ],
                dest: 'build/js/libs.js'
            },
            main: {
                src: 'dev/js/app.js',
                dest: 'build/js/app.js'
            }
        },
        uglify: {
            main: {
                files: {
                    'build/js/libs.min.js': '<%= concat.bower.dest %>',
                    'build/js/app.min.js': '<%= concat.main.dest %>'
                }
            }
        },
        watch: {
            concat: {
                files: ['index.html','<%= concat.main.src %>'],
                tasks: ['concat', 'uglify']
            }
        },
        connect: {
            test: {
                options: {
                    port: 8001,
                    base: '.'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // By default
    grunt.registerTask('default', ['concat:bower','concat:main', 'uglify']);
};