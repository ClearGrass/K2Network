module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            html: {
                files: ['public/src/**/*.html'],
                options: {livereload: true},
                tasks: ['htmlmin', 'copy']
            },
            js: {
                files: ['public/src/**/*.js'],
                options: {livereload: true},
                tasks: ['copy']
            },
            less: {
                files: ['public/src/less/*.less'],
                options: {livereload: false},
                tasks: ['less']
            }
        },

        uglify: {
            options: {
                stripBanner: true,
                banner: '/*! <%= pkg.name %>-<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            buildall:{
                files: [{
                    expand:true,
                    cwd:'public/src/scripts',
                    src:'**/*.js',
                    dest: 'public/dist/scripts'
                }]
            }
        },

        less: {
            development: {
                files: [{
                    expand: true,
                    cwd: './public/src/less',
                    src: ['**/*.less'],
                    dest: './public/dist/styles',
                    ext: '.css'
                }]
            }
        },

        copy: {
            main: {
                expand: true,
                cwd: 'public/src/scripts',
                src: ['**/*.js'],
                dest: 'public/dist/scripts',
                //flatten: true,
                //filter: 'isFile',
            },
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    cwd: 'public/src/templates',
                    src: ['**/*.html'],
                    dest: 'public/dist/templates',
                    ext: '.html'
                }]
            },
            dev: {
                files: {
                    //'dist/index.html': 'src/index.html',
                    //'dist/contact.html': 'src/contact.html'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-livereload');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['less', 'htmlmin', 'uglify']);
    grunt.registerTask('dev', ['watch', 'less', 'htmlmin', 'copy']);

};