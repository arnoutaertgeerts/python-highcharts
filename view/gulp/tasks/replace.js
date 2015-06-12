var gulp      = require('gulp');
var config    = require('../config').production;
var size      = require('gulp-filesize');
var replace   = require('gulp-replace');

gulp.task('replace-pre', ['browserify'], function() {
    return gulp.src(config.jsSrc)
        .pipe(replace('//replace-series', "var series = '$#series'"))
        .pipe(replace('//replace-options', "var options = '$#options'"))
        .pipe(replace('//replace-save', "var save = '$#save'"))
        .pipe(replace('//replace-url', "var url = '$#url'"))
        .pipe(replace('//replace-highstock', "var useHighStock = '$#highstock'"))
        .pipe(replace('//replace-path', "var path = '$#path'"))
        .pipe(replace('//replace-settings', "var settingsFile = '$#settingsFile'"))
        .pipe(gulp.dest(config.dest))
        .pipe(size());
});

gulp.task('replace-post', ['inline'], function() {
    return gulp.src(config.htmlSrc)
        .pipe(replace("'$#series'", "$#series"))
        .pipe(replace("'$#options'", "$#options"))
        .pipe(replace("'$#highstock'", "$#highstock"))
        .pipe(replace("'$#save'", "$#save"))
        .pipe(replace("'$#url'", "$#url"))
        .pipe(replace("'$#path'", "$#path"))
        .pipe(replace("'$#settingsFile'", "$#settingsFile"))
        .pipe(gulp.dest(config.dest))
        .pipe(size());
});
