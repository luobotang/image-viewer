module.exports = function (grunt) {

	grunt.initConfig({
		browserify: {
			test: {
				src: 'test/test.js',
				dest: 'test/test.bundle.js'
			}
		},
		less: {
			test: {
				src: 'test/test.less',
				dest: 'test/test.css'
			}
		}
	})

	grunt.loadNpmTasks('grunt-browserify')
	grunt.loadNpmTasks('grunt-contrib-less')

	grunt.registerTask('default', ['browserify', 'less'])
}