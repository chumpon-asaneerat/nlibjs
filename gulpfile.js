var gulp = require('gulp');
var debug = require('gulp-debug');
var concat = require('gulp-concat');
var sort = require('gulp-sort');
var insert = require('gulp-insert');

var uglify = require('gulp-uglify-es').default;

var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');

//var watch = require('gulp-watch');
var connect = require('gulp-connect');

var riot = require('gulp-riot');

var src =  {
    sass: {
        path: 'src/client/sass/**/*.scss'
    },
    js: {
        server: 'src/server/js/**/*.js',
        client: 'src/client/js/**/*.js'
    }
};
var dst =  {
    css: {
        path: 'dist/client/css/',
        map: 'maps/',
        bundle: 'nlib.min.css'
    },
    js: {
        server: {
            path: 'dist/server/js/'
        },
        client: {
            path: 'dist/client/js/',
            bundle: 'nlib.min.js'
        }
    },
    watch: {
        css: 'dist/client/css/*.css',
        js: 'dist/client/js/*.js'
    }
};

gulp.task('server', function() {
    connect.server({
        livereload: true
    });
});

gulp.task('sass', function() {
    return gulp.src(src.sass.path)
        .pipe(debug())
        .pipe(sort())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(concat(dst.css.bundle))
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(sourcemaps.write(dst.css.map))
        .pipe(gulp.dest(dst.css.path))
        .pipe(connect.reload());
});

gulp.task('server-js', function() {
    return gulp.src(src.js.server)
        .pipe(debug())
        .pipe(gulp.dest(dst.js.server.path));
});

gulp.task('client-js', function() {
    let sDate = new Date().toDateString();
    return gulp.src(src.js.client)
        .pipe(debug())
        .pipe(sort())
        .pipe(insert.prepend(`/*********** Script Update Date: ` + sDate + `  ***********/\n`))
        .pipe(insert.append(`\n`))
        .pipe(concat(dst.js.client.bundle))
        //.pipe(uglify())
        .pipe(gulp.dest(dst.js.client.path))
        .pipe(connect.reload());
});
/*
gulp.task('watch', function() {
    gulp.watch(src.sass.path, ['sass']);
    gulp.watch(src.js.server.path, ['server-js']);
    gulp.watch(src.js.client.path, ['client-js']);
    //gulp.watch(src.html, ['html']);
    //gulp.watch(src.riotTags, ['riot-tags']);
});
*/
gulp.task('livereload', function() {    
    gulp.src([dst.watch.css, dst.watch.js])
        .pipe(connect.reload());
});

//gulp.task('default', ['sass', 'server', 'watch', 'livereload', 'js', 'riot-tags']);
//gulp.task('default', ['server', 'watch', 'livereload', 'server-js', 'client-js', 'sass']);
