/**
 * For livereload read
 * [https://scotch.io/tutorials/a-quick-guide-to-using-livereload-with-gulp]
 */

var gulp         = require('gulp'),
    concatCss    = require('gulp-concat-css'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCss    = require('gulp-minify-css'),
    rename       = require("gulp-rename"),
    uglify       = require('gulp-uglify'),
    concat       = require('gulp-concat'),
    livereload   = require('gulp-livereload');

var path = {
    bower: 'bower_components/',
    css : {
        src: 'src/css/',
        dest: 'dest/css/'
    },
    js : {
        app: 'src/js/app/',
        src: 'src/js/',
        dest: 'dest/js'
    }
}

gulp.task('styles', function() {
    return gulp.src([
        path.css.src + 'common.css',
        path.css.src + 'features/*.css'
    ])
    .pipe(concatCss('styles.css'))
    .pipe(autoprefixer({
        browsers: [
            'last 4 version',
            'FireFox 28',
            'ie 9',
            'Safari 5'
        ],
        cascade: false
    }))
    .pipe(gulp.dest(path.css.dest))
    .pipe(livereload());
});

gulp.task('concat-js-libs', function() {
    return gulp.src([
        path.bower + 'jquery/dist/jquery.js',
        path.bower + 'underscore/underscore.js',
        path.bower + 'backbone/backbone.js',
        path.bower + 'handlebars/handlebars.js'
    ])
    .pipe(concat('libs.js'))
    .pipe(uglify())
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest(path.js.dest));
});

gulp.task('concat-js-app', function() {
    return gulp.src([
        path.js.src + 'helpers.js',
        path.js.app + 'models.js',
        path.js.app + 'collections.js',
        path.js.app + 'views.js',
        path.js.app + 'router.js'
    ])
    .pipe(concat('app.js'))
    .pipe(gulp.dest(path.js.dest))
    .pipe(livereload());
});

gulp.task('html', function() {
    return gulp.src([
        'index.html',
        'static_page/**/*.html'
    ])
    .pipe(livereload());
});

gulp.task('tpl', function() {
    return gulp.src(['src/tpl/**/*.html']).pipe(livereload());
});

gulp.task('watch', function() {
    livereload.listen({ start: true });
    gulp.watch(path.css.src + '**/*.css', ['styles']);
    gulp.watch([path.js.app + '*.js', path.js.src + 'helpers.js'] , ['concat-js-app']);
    gulp.watch(['index.html', 'static_page/**/*.html'], ['html']);
    gulp.watch(['src/tpl/**/*.html'], ['tpl']);
});

gulp.task('default', ['watch', 'styles', 'concat-js-libs', 'concat-js-app', 'html', 'tpl']);