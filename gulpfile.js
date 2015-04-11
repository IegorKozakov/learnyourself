var gulp = require('gulp'),
	concatCss = require('gulp-concat-css'),
    connect = require('gulp-connect');


/** Web-server */
gulp.task('connect', function() {
  connect.server({
    port: 8004
  });
});


gulp.task('developCSS', function() {
    return gulp.src([
    		'src/css/base/reset.css',
    		'src/css/base/grid.css',
    		'src/css/common.css',
    		'src/css/features/*.css'
    	])
    	.pipe(concatCss('styles.css'))
    	.pipe(gulp.dest('dest/css/'));
});

gulp.task('watchCSS', function() {
    gulp.watch('src/css/**/*', ['developCSS']);
});


/* DEFAULT task for development */
gulp.task('dev', ['developCSS', 'watchCSS', 'connect']);
