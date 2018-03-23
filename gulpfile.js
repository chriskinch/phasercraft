const gulp        = require('gulp');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const browserify = require('gulp-browserify');

// process JS files and return the stream.
gulp.task('js', function () {
    return gulp.src('*js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(browserify({
            insertGlobals : true,
            debug : !gulp.env.production
        }))
        .pipe(gulp.dest('dist/js'))
});

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['js'], function (done) {
    browserSync.reload();
    done();
});

// use default task to launch Browsersync and watch JS files
gulp.task('default', ['js'], function () {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch("*.js", ['js-watch']);
});