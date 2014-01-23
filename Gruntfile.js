module.exports = function(grunt) {
	"use strict";

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		banner: '/**\n' +
				'* <%= pkg.name %> v<%= pkg.version %>\n' +
				'* Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
				'*/\n',

		/*	HTML Hint
		==============================================================*/
		htmlhint: {
			build: {
				options: {
					'tag-pair': true,
					'tagname-lowercase': true,
					'attr-lowercase': true,
					'attr-value-double-quotes': true,
					'doctype-first': true,
					'spec-char-escape': true,
					'id-unique': true,
					'style-disabled': true
				},
				src: ['*.html']
			}
		},

		/*	JS Hint
		==============================================================*/
		jshint: {
			options: {
				jshintrc: 'assets/js/.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'assets/js/*.js',
				'assets/js/plugins/*.js',
				'!assets/js/script.min.js'
			]
		},

		/*	Uglify
		==============================================================*/
		uglify: {
			options: {
				banner: '<%= banner %>',
				mangle: false

			},
			dist: {
				files: {
					'assets/js/script.min.js': [
						'assets/js/plugins/bootstrap/transition.js',
						// 'assets/js/plugins/bootstrap/alert.js',
						// 'assets/js/plugins/bootstrap/button.js',
						// 'assets/js/plugins/bootstrap/carousel.js',
						'assets/js/plugins/bootstrap/collapse.js',
						'assets/js/plugins/bootstrap/dropdown.js',
						// 'assets/js/plugins/bootstrap/modal.js',
						// 'assets/js/plugins/bootstrap/tooltip.js',
						// 'assets/js/plugins/bootstrap/popover.js',
						// 'assets/js/plugins/bootstrap/scrollspy.js',
						// 'assets/js/plugins/bootstrap/tab.js',
						// 'assets/js/plugins/bootstrap/affix.js',
						'assets/js/plugins/*.js',
						'assets/js/_*.js'
					]
				}
			}
		},

		/*	Recess
		==============================================================*/
		recess: {
			dist: {
				options: {
					compile: true,
					compress: true
				},
				files: {
					'assets/css/main.min.css' : [
						'assets/less/main.less'
					]
				}
			}
		},

		/*	Watch
		==============================================================*/
		watch: {
			html: {
				files: [
					'*.html'
				],
				tasks: ['htmlhint'],
				options: {
					livereload: true,
				}
			},
			less: {
				files: [
					'assets/less/*.less',
					'assets/less/bootstrap/*.less'
				],
				tasks: ['recess'],
				options: {
					livereload: true,
				}
			},
			js: {
				files: [
					'<%= jshint.all %>'
				],
				tasks: [
					// 'jshint', 
					'uglify'
				],
				options: {
					livereload: true,
				}
			},
		},

	});

	grunt.registerTask('default', [
		'recess',
		'jshint',
		'htmlhint',
		'uglify'
	]);
};