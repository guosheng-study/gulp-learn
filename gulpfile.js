var gulp = require('gulp');
var path = require('path');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');
var gulpSequence = require('gulp-sequence');
//js
var webpack = require('gulp-webpack');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');

//css
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    autoprefixPlugin = new LessPluginAutoPrefix({
        browsers: ["last 2 versions"]
    });

//发版
var rev = require('gulp-rev');


gulp.task('webpack', function() {
    gulp.src('js/src/**/main.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('./'))
        .pipe(livereload());
});

gulp.task('less', function() {
    gulp.src('./style/less/**/*.less')
        .pipe(less({
            plugins: [autoprefixPlugin]
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest('./style/css'))
        .pipe(livereload());
});

gulp.task('lint', function() {
    return gulp.src('js/src/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(livereload());
});

gulp.task('w', function() {
    livereload.listen();
    gulp.watch('js/src/**/*.js', ['webpack', 'lint']);
    gulp.watch('style/**/*.less', ['less']);
});

//生成js版本号文件
gulp.task('jsrev', function() {
    gulp.src(['./js/dist/**/*.js'], {
            base: './js/dist'
        })
        .pipe(uglify())
        .pipe(gulp.dest('./js/assets')) // copy original assets to build dir 
        .pipe(rev())
        .pipe(gulp.dest('./js/assets')) // write rev'd assets to build dir
        .pipe(rev.manifest())
        .pipe(gulp.dest('./js/assets')); // write manifest to build dir
});

//生成css版本号文件
gulp.task('cssrev', function() {
    gulp.src(['./style/css/**/*.css'], {
            base: './style/css'
        })
        .pipe(gulp.dest('./style/assets')) // copy original assets to build dir 
        .pipe(rev())
        .pipe(gulp.dest('./style/assets')) // write rev'd assets to build dir
        .pipe(rev.manifest())
        .pipe(gulp.dest('./style/assets')); // write manifest to build dir
});

gulp.task('p', gulpSequence('jsrev', 'cssrev'));