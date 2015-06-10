var gulp      = require('gulp');
var config    = require('../config').production;
var size      = require('gulp-filesize');
var replace   = require('gulp-html-replace');

gulp.task('removedep', ['replace-post'], function() {
    return gulp.src(config.htmlSrc)
        .pipe(replace({bootstrap: ''}))
        .pipe(gulp.dest(config.dest))
        .pipe(size());
});
