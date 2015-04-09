var gulp = require('gulp'),
    concatCss = require('gulp-concat-css'),
    minifyCss  = require('gulp-minify-css'),
    rename = require('gulp-minify-css')
    connect = require('gulp-connect');


/* for development */
gulp.task('devConcatCss', function() {
    return gulp.src('src/**/*.css')
        .pipe(concatCss('styles.min.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('dest/'));
});

gulp.task('connect', function() {
  connect.server({
    port: 8004
  });
});

/* for production */
gulp.task('buildConcatCss', function() {
    return gulp.src('src/**/*.css')
        .pipe(concatCss('styles.min.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('dest/'));
});


gulp.task('watch', function() {
    gulp.watch('src/**/*.css', ['devConcatCss'])
});

/* DEFAULT task only for development */
gulp.task('default', ['connect', 'devConcatCss']);