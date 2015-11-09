/*
    Gulp configuration file
    ----------------------------
    run 'gulp watch' - to run local server with live reload;
    run 'gulp build' - to compile styles without running web server;
*/

'use strict';

var
    gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css'),
    browserSync = require('browser-sync').create();


/*
    Compile task for styles SASS or LESS
    Uncomment LESS or SASS method (depends on your choice)
*/
gulp.task('build-styles', function () {
    // SASS Method (uncomment lines below for using)
    /*
    gulp.src('styles/sass/main.scss') //change file name here if you're using other than main.scss
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('styles/css'));
    */

    // LESS Method (uncomment lines below for using)
    /*
    gulp.src('styles/less/main.less') //change file name here if you're using other than main.less
        .pipe(less())
        .pipe(gulp.dest('styles/css'));
    */

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
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    gulp.watch('styles/sass/**/*.scss', ['build-styles']);
    gulp.watch('styles/less/**/*.less', ['build-styles']);
    gulp.watch('*.html').on('change', browserSync.reload);
});

/*
    Watch task. Running web server and watching for changes in local files.
    Compile changes and reload your browser with updates.
*/
gulp.task('watch', ['build-styles' 'serve']);

/*
    Build task. Only compiles styles.
*/
gulp.task('build', ['build-styles']);
