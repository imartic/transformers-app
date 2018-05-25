'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const stylus = require('gulp-stylus');

gulp.task(
	'webpack:build',
	(callback) => {
		const webPackServerConfig = Object.assign(
			{},
			webpackConfig,
			{
				watch: true,
				watchOptions: {
					aggregateTimeout: 300,
					poll: 1000
				}
			}
		);

		const compiler = webpack(webPackServerConfig);
		compiler.run((error, stats) => {
			if (error) {
				throw new gutil.PluginError('Error while compiling code', error);
			}
			gutil.log('[webpack:build]', stats.toString({ colors: true }));
			callback();
		});
	}
);

gulp.task(
	'copy:img',
	() => gulp.src(['./src/client/assets/img/**']).pipe(gulp.dest('./public/img'))
);

gulp.task(
	'build:css',
	() => gulp.src(['./src/client/assets/css/*.styl']).pipe(stylus({compress: true})).pipe(gulp.dest('./public/css'))
);

gulp.task(
	'copy:fonts',
	() => gulp.src(['./src/client/assets/fonts/**']).pipe(gulp.dest('./public/fonts'))
);

gulp.task(
	'build',
	['webpack:build', 'copy:img', 'build:css', 'copy:fonts']
);

gulp.task('default', ['build']);