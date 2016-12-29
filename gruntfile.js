"use strict";
module.exports = function(grunt) {
    grunt.initConfig({
        /**
         The concurrent task will let us spin up all of required tasks. It is very
         important to list the 'watch' task last because it is blocking and nothing
         after it will be run.
         **/
        concurrent: {
            dev: ["nodemon", "watch"],
            //"node-inspector", Commented as not able to install due to some error
            options: {
                logConcurrentOutput: true
            }
        },

        /**
         The nodemon task will start your node server. The watch parameter will tell
         nodemon what files to look at that will trigger a restart. Full grunt-nodemon
         documentation
         **/
        nodemon: {
            dev: {
                script: 'app.js',
                options: {
                    nodeArgs: ['--debug=5859'],
                    env: {
                        PORT: '5859'
                    },
                    // omit this property if you aren't serving HTML files and
                    // don't want to open a browser tab on start
                    callback: function (nodemon) {
                        nodemon.on('log', function (event) {
                            console.log(event.colour);
                        });
                        // opens browser on initial server start
                        nodemon.on('config:update', function () {
                            // Delay before server listens on port
                            setTimeout(function() {
                                require('open')('http://localhost:5858');
                            }, 1000);
                        });
                        // refreshes browser when server reboots
                        nodemon.on('restart', function () {
                            // Delay before server listens on port
                            setTimeout(function() {
                                require('fs').writeFileSync('.rebooted', 'rebooted');
                            }, 1000);
                        });
                    }
                }
            }
        },

        /**
         Watches the rebooted file being created on the dev machine and chanegs the content accordingly
         **/
        watch: {
            server: {
                files: ['.rebooted'],
                options: {
                    livereload: 1337
                }
            }
        },

        /**
         This copy tasks has two parts. The libraries will be rarely updated and are
         only copied on startup. The custom sub-task will copy over application specific
         JS since it doesn't need a preprocessor in dev
         **/
        copy: {
            dev: {
                custom: {
                    files: [
                        {
                            src: ["client/public/js/*.js"],
                            dest: "client/public/js",
                            expand: true,
                            flatten: true
                        }
                    ]
                },
                libs: {
                    files: [
                    /**
                     Array of file objects that reference bower libs }}
                     **/
                    ]
                }
            }
        },


        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true
                },
                jshintrc: '.jshintrc',
                jshintignore: '.jshintignore',
            },
            uses_defaults: ['**/*.js'],
        },
    });

    /**
     Load all the GRUNT tasks
     **/
    grunt.loadNpmTasks("grunt-nodemon");
    grunt.loadNpmTasks("grunt-concurrent");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-contrib-jshint');
    /**
     Register tasks allowing you to run:
     grunt
     grunt run
     grunt dev
     grunt prod
     **/
    grunt.registerTask("run", ["concurrent:dev"]);
    grunt.registerTask("default", ["jshint", "concurrent:dev"]);
    grunt.registerTask("dev", ["copy:dev"]);
    //grunt.registerTask("prod", ["uglify:prod", "less:prod"]);
};