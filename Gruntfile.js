module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        typescript: {
            base: {
                src: ['*.ts'],
                dest: 'angular2-most.js',
                options: {
                    module: 'amd',
                    target: 'es5',
                    noImplicitAny:false,
                    noResolve:false,
                    sourceMap: true,
                    declaration:true,
                    experimentalDecorators:true,
                    references: [
                        "angular2/core"
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-typescript');

};