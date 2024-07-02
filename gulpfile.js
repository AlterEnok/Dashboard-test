const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const ghPages = require('gulp-gh-pages');

gulp.task('pug', function () {
    return gulp.src(['views/*.pug', '!views/partials/*.pug'])
        .pipe(pug())
        .on('error', function (err) { console.log(err.message); this.emit('end'); })
        .pipe(gulp.dest('Compiled-HTML'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('sass', function () {
    return gulp.src('css/styles.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('Compiled-HTML/css'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('images', function () {
    return gulp.src('images/*')
        .pipe(gulp.dest('Compiled-HTML/images'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('move-index', function () {
    return gulp.src('Compiled-HTML/index.html')
        .pipe(gulp.dest('./'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: './Compiled-HTML'
        }
    });

    gulp.watch('views/**/*.pug', gulp.series('pug', 'move-index'));
    gulp.watch('css/*.scss', gulp.series('sass'));
    gulp.watch('images/*', gulp.series('images'));
    gulp.watch('Compiled-HTML/*.html').on('change', browserSync.reload);
});

gulp.task('deploy', function () {
    return gulp.src('./Compiled-HTML/**/*')
        .pipe(ghPages());
});

gulp.task('default', gulp.series('pug', 'sass', 'images', 'move-index', 'serve'));
