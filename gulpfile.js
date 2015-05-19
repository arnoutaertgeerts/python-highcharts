/**
 * Created by arnout on 19.05.15.
 */
var gulp = require('gulp');

var concat = require('gulp-concat');
var bower = require('main-bower-files');
var print = require('gulp-print');
var replace = require('gulp-replace');

var fs = require('fs');

gulp.task('concat-bower', function() {
    return gulp.src(bower())
        .pipe(concat('script.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('insert-js', function() {
    return gulp.src(['index.html'])
        .pipe(replace('//inject:js', fs.readFileSync('./dist/script.js')))
        .pipe(gulp.dest('./dist/'))
});

gulp.task('insert-css', function() {
    return gulp.src(['./dist/index.html'])
        .pipe(replace('/*inject:css', fs.readFileSync('./dist/style.css')))
        .pipe(gulp.dest('./dist'))
});

gulp.task('concat-css', function() {
    return gulp.src([
        'style.css',
        'bower_components/angular-material/angular-material.css'
    ]).pipe(concat('style.css'))
        .pipe(gulp.dest('./dist/'))
});