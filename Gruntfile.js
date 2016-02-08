module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        ts: {
            default: {
                src: ["**/*.ts", "!node_modules/**/*.ts"],
                outDir: "dist",
                options: {
                    experimentalDecorators:true,
                    module: "amd",
                    moduleResolution: "node",
                    declaration:true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-ts');

};