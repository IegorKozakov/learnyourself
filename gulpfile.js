var gulp = require('gulp'),
    concatCss = require('gulp-concat-css'),
    connect = require('gulp-connect');

gulp.task('developCSS', function() {
    return gulp.src([
            'src/css/base/reset.css',
            'src/css/base/helpers.css',
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
gulp.task('dev', ['developCSS', 'watchCSS']);
