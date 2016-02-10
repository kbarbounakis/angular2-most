module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        ts: {
            default: {
                src: ["**/*.ts", "!node_modules/**/*.ts"],
                outDir:"dist",
                options: {
                    "emitDecoratorMetadata": true,
                    "experimentalDecorators": true,
                    "declaration": true,
                    "module": "system",
                     "moduleResolution": "node",
                    "sourceMap": true,
                    "target": "ES5",
                    "removeComments": false
                }
            },
            umd: {
                src: ["**/*.ts", "!node_modules/**/*.ts"],
                outDir:"dist/umd",
                options: {
                    "emitDecoratorMetadata": true,
                    "experimentalDecorators": true,
                    "declaration": false,
                    "module": "umd",
                    "moduleResolution": "node",
                    "sourceMap": true,
                    "target": "ES5",
                    "removeComments": false
                }
            }
        },
        concat: {
            js: {
                src: [
                    'dist/core.js',
                    'dist/client.js'
                ],
                dest: 'dist/angular2-most.js'
            },
            umd: {
                src: [
                    'dist/umd/core.js',
                    'dist/umd/client.js'
                ],
                dest: 'dist/umd/angular2-most.js'
            }
        },
        uglify: {
            options: {
                compress: true,
                mangle: false,
                sourceMap: true
            },
            applib: {
                src: 'dist/angular2-most.js',
                dest: 'dist/angular2-most.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ts');

};