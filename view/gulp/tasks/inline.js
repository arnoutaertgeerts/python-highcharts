var gulp      = require('gulp');
var config    = require('../config').production;
var inline = require('gulp-inline-source');
var size      = require('gulp-filesize');

gulp.task('inline', [], function() {
    return gulp.src(config.htmlSrc)
        .pipe(inline())
        .pipe(gulp.dest(config.dest))
        .pipe(size());
});