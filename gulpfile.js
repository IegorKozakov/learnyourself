/**
 * For livereload read
 * [https://scotch.io/tutorials/a-quick-guide-to-using-livereload-with-gulp]
 */
var gulp         = require('gulp');

var sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCss    = require('gulp-minify-css');

var uglify       = require('gulp-uglify'),
    concat       = require('gulp-concat');

var rename       = require("gulp-rename"),
    livereload   = require('gulp-livereload');

var path = {
    sass: 'src/scss/',
    css: 'dest/css/',
    bower: 'bower_components/',
    js : {
        app: 'src/js/app/',
        features: 'src/js/features/',
        src: 'src/js/',
        dest: 'dest/js'
    }
}

/**
 * STYLES
 */
gulp.task('sass', function () {
    return gulp.src( path.sass + '*.scss' )
        .pipe( sass().on('error', sass.logError) )
        .pipe( gulp.dest( 'dest/css/' ) )
});

gulp.task('build-css', ['sass'], function() {
    return gulp.src(path.css + 'main.css')
        .pipe(autoprefixer({
            browsers: [
                'last 5 version',
                'IE > 9'
            ],
            cascade: false
        }))
        .pipe( rename({ suffix: '.min' }) )
        .pipe( minifyCss() )
        .pipe(gulp.dest( path.css ))
        .pipe( livereload() );
});

/**
 * JS
 */
gulp.task('build-js-libs', function() {
    return gulp.src([
        path.bower + 'jquery/dist/jquery.js',
        path.bower + 'underscore/underscore.js',
        path.bower + 'backbone/backbone.js',
        path.bower + 'handlebars/handlebars.js',
        path.bower + 'parsemejs/parseMe.js'
    ])
    .pipe(concat('libs.js'))
    .pipe(uglify())
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest(path.js.dest));
});

gulp.task('build-js-app', function() {
    return gulp.src([
        path.js.src + 'helpers.js',
        path.js.src + 'handlebars_helpers.js',
        path.js.src + 'youtubeAPI.js',
        path.js.app + 'models.js',
        path.js.app + 'collections.js',
        path.js.app + 'views.js',
        path.js.app + 'router.js',
        path.js.features + '*.js'
    ])
    .pipe(concat('app.js'))
    .pipe(gulp.dest(path.js.dest))

    .pipe(livereload());
});

/**
 * HTML
 */
gulp.task('html', function() {
    return gulp.src([
        'index.html',
        'static_page/**/*.html'
    ])
    .pipe(livereload());
});

/**
 * TPL
 */
gulp.task('tpl', function() {
    return gulp.src(['src/tpl/**/*.html']).pipe(livereload());
});

/**
 * WATCH */
gulp.task('watch', function() {
    livereload.listen({ start: true });

    gulp.watch(path.sass + '**/*.scss', ['build-css']);
    gulp.watch([path.js.app + '*.js', path.js.src + '*.js', path.js.features + '*.js'] , ['build-js-app']);
    gulp.watch(['index.html', 'static_page/**/*.html'], ['html']);
    gulp.watch(['src/tpl/**/*.html'], ['tpl']);
});

gulp.task('default', ['watch', 'build-css', 'build-js-libs', 'build-js-app', 'html', 'tpl']);
