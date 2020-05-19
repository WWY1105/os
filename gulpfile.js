var gulp = require('gulp');

var mini_css = require('gulp-minify-css');
var mini_js = require('gulp-uglify');
var error = require('gulp-plumber');

gulp.task('default',['mini-assets-js',"mini-common-css","mini-assets-css"], function () {
    // 将你的默认的任务代码放在这

});
gulp.task('mini-common-css', function () {
    // 将你的默认的任务代码放在这
    gulp.src(["../common/css/*.css"])
        .pipe(mini_css())
        .pipe(gulp.dest("../common/css"));


});
gulp.task('mini-assets-css', function () {
    // 将你的默认的任务代码放在这
    gulp.src([, "./mweb/assets/css/*.css"])
        .pipe(mini_css())
        .pipe(gulp.dest("./mweb/assets/css"));


});

gulp.task('mini-assets-js', function () {
    // 将你的默认的任务代码放在这
    gulp.src(["./web/mweb/assets/js/position.js"])
        .pipe(error())
        .pipe(mini_js())
        .pipe(gulp.dest("./web/mweb/assets/js")).on('task_start',function(){
            console.log('start');
        })


});
