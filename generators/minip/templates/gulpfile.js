var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function() {
  return gulp.src('scss/**/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: './'
    },
    open: true,
    notify: false,
    ghostMode: false
  });
});

gulp.task('default', ['browserSync', 'sass'], function() {
  gulp.watch('scss/**/*.scss', ['sass']);
  gulp.watch(['*.html', 'js/**/*.js'], browserSync.reload);
});
