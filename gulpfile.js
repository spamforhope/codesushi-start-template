/*
    Gulp configuration file
    ----------------------------
    run 'gulp watch' - to compile all assets and run local server with live reload;
    run 'gulp build' - to compile styles and bower dependencies;
*/

'use strict';

var
    useSASS = false,
    useLESS = false,
    gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css'),
    mainBowerFiles = require('main-bower-files'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync').create();

/*
    Task for get all installed bower dependencies.
    Concat them into single minified file.
*/
gulp.task('bower', function () {
    gulp.src(mainBowerFiles({ filter: new RegExp('.*js$', 'i') }))
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/lib'))
})

/*
    Compile task for styles SASS or LESS
    Uncomment LESS or SASS method (depends on your choice)
*/
gulp.task('build-styles', function () {
    // Check what preprocessor is using

    if (useSASS) {
        // SASS Method
        gulp.src('styles/sass/main.scss') //change file name here if you're using other than main.scss
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest('styles/css'));
    } else if (useLESS) {
        // LESS Method
        gulp.src('styles/less/main.less') //change file name here if you're using other than main.less
            .pipe(less())
            .pipe(gulp.dest('styles/css'));
    }

    // Autoprefixer save compiled file into /dist/css/ folder
    // Include *.css to your html only from that folder.
    gulp.src('styles/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 5 versions']
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

/*
    Run live reload local web server.
    Do not touch this, please. Only if you know what you do :)
*/
gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    gulp.watch('bower_components/**', ['bower']); // Watch changes in bower assets and compile new common file.
    gulp.watch('styles/sass/**/*.scss', ['build-styles']);
    gulp.watch('styles/less/**/*.less', ['build-styles']);
    gulp.watch('*.html').on('change', browserSync.reload);
});

/*
    Watch task. Running web server and watching for changes in local files.
    Compile changes and reload your browser with updates.
*/
gulp.task('watch', ['bower', 'build-styles', 'serve']);

/*
    Build task.
    Compile styles and bower libraries.
*/
gulp.task('build', ['bower','build-styles']);
