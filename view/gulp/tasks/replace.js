var gulp      = require('gulp');
var config    = require('../config').production;
var size      = require('gulp-filesize');
var replace   = require('gulp-replace');

gulp.task('replace', ['browserify'], function() {
    return gulp.src(config.jsSrc)
        .pipe(replace('//replace-series', "var series = '$#series'"))
        .pipe(replace('//replace-options', "var options = '$#options'"))
        .pipe(replace('//replace-highstock', "var useHighStock = '$#highstock'"))
        .pipe(gulp.dest(config.dest))
        .pipe(size());
});