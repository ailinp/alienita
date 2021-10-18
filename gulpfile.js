// DEPENDENCIES ================================================================
var browserSync  = require('browser-sync'),
    del          = require('del'),
    fs           = require('fs'),
    gulp         = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    changed      = require('gulp-changed'),
    concat       = require('gulp-concat'),
    csso         = require('gulp-csso'),
    imagemin     = require('gulp-imagemin'),
    minify       = require('gulp-minify-css'),
    pixrem       = require('gulp-pixrem'),
    plumber      = require('gulp-plumber'),
    rename       = require('gulp-rename'),
    replace      = require('gulp-replace'),
    sass         = require('gulp-sass'),
    sourcemaps   = require('gulp-sourcemaps'),
    twig         = require('gulp-twig'),
    uglify       = require('gulp-uglify'),
    gutil        = require('gulp-util'),
    yaml         = require('gulp-yaml'),
    zip          = require('gulp-zip'),
    runSequence  = require('run-sequence'),
    //handleErrors = require('handlers/handleErrors'),
    timestamp    = new Date().getTime(),
    isPublish    = false,
    isRelease    = false,
    emailList    = {},
    pageName     = '';


// MESSAGE =====================================================================
function notify(message, emoticon) {
    switch (emoticon) {
        case 'common':
            emoticon = '(｀◕‸◕´+)';
            break;
        case 'start':
            emoticon = '໒( ᓀ ‸ ᓂ )७';
            break;
        case 'yeah':
            emoticon = '＼（＠￣∇￣＠）／';
            break;
        case 'crazy':
            emoticon = '╭(๑¯д¯๑)╮';
            break;
        case 'fuck':
            emoticon = '凸(⊙▂⊙✖ )';
            break;
        case 'writing':
        case undefined:
            emoticon = '(๑ò︵ò๑)';
            break;
    }
    gutil.log(emoticon +' '+ message);
};

var throwError = function (err) {
    var fileName     = gutil.colors.gray('\'') + gutil.colors.cyan('Error') +gutil.colors.gray('\''),
        errorMessage = gutil.colors.red('Error compiling. '+ err +' (╯°□°）╯︵ ┻━┻');

    gutil.log(fileName, errorMessage);
};


// PATHS =======================================================================
var path = {
        tmp: '.tmp',
        src: {
            base: 'src',
            data: 'src/data',
            scss: 'src/assets/scss',
            fonts: 'src/assets/fonts',
            image: 'src/assets/images',
            javascript: 'src/assets/javascripts',
        },
        dest: {
            base: 'dist',
            release: 'release',
            scss: 'dist/assets/stylesheets',
            javascript: 'dist/assets/javascripts',
            fonts: 'dist/assets/fonts',
            image: 'dist/assets/images'
        }
    };
    /*
    ,
    sync = {
        proxy: 'boilerplate.dev',
        startPath: null,
        port: 3000
    };
    */


// CSS =========================================================================
gulp.task('scss', function () {
    notify('Compiling Scss');
    return gulp.src(path.src.scss +'/**/*.scss')
        .pipe(plumber(function(error) {
            notify(error.message, 'fuck');
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(sass({
            sourceComments: 'map',
            imagePath: path.src.image
        }))
        //.on('error', handleErrors)
        .pipe(replace(/\{\*timestamp\*\}/g, timestamp))
        .pipe(pixrem())
        .pipe(autoprefixer({
            browsers: [
                'last 2 versions',
                'safari 5',
                'ie 8',
                'ie 9',
                'opera 12.1',
                'ios 6',
                'android 4'
            ],
            cascade: true
        }))
        .pipe(sourcemaps.write('.', { includeContent: false }))
        .pipe(gulp.dest(path.dest.scss))
        .pipe(minify({ keepSpecialComments:0 }))
        .pipe(rename({ suffix:'.min' }))
        .pipe(gulp.dest(path.dest.scss))
        .pipe(browserSync.reload({stream:true}));
});


// DATA FOR TWIG ===============================================================
gulp.task('concat:json', function() {
    return gulp.src([
            path.src.data + '/*.yml',
            path.src.data +'/*.yml',
            '!' + path.src.data +'/data.yml'
        ])
        .pipe(plumber({ errorHandler: throwError }))
        .pipe(concat('data.yml'))
        .pipe(gulp.dest(path.src.data))
        .pipe(yaml())
        .pipe(gulp.dest(path.src.data));
});


// TWIG ========================================================================
gulp.task('markup', ['concat:json'], function () {
    if (!fs.existsSync(path.src.data +'/data.json')) {
        throwError();
        return true;
    }
    var json_data   = fs.readFileSync(path.src.data +'/data.json', 'utf-8');
    json_data       = JSON.parse(json_data.toString());
    pageName        = json_data.page.name;

    return gulp.src([
            path.src.base +'/web/**/*.twig',
            '!'+ path.src.base +'/web/**/_*.twig'
        ])
        .pipe(twig({
            data: json_data,
            cache: false,
            functions: [
                {
                    name: 'getUrlPrefix',
                    func: function (page) {
                        var url = '/';
                        if ( isPublish ) url = '/'+ page.publishUrl +'/';
                        return url;
                    }
                }
            ]
        }))
        .pipe(replace(/\{\*timestamp\*\}/g, timestamp))
        .pipe(gulp.dest(path.dest.base))
        .pipe(browserSync.reload({stream:true}));
});


// JS ==========================================================================
gulp.task('javascripts', [
    'concat:components',
    'concat:polyfills',
    'copy:javascripts'
    ]);

gulp.task('concat:components', function() {
    return gulp.src([
        path.src.javascript +'/components/**/*',
        path.src.javascript +'/*'
    ])
    .pipe(uglify())
    .pipe(concat('scripts.js', { newLine: ';' }))
    .pipe(gulp.dest(path.dest.javascript));
});

gulp.task('concat:polyfills', function() {
    return gulp.src([
        path.src.javascript +'/polyfills/selectivizr.js',
        path.src.javascript +'/polyfills/respond.js'
    ])
    .pipe(uglify())
    .pipe(concat('polyfills.js', { newLine: ';' }))
    .pipe(gulp.dest(path.dest.javascript));
});

gulp.task('copy:javascripts', function () {
    return gulp.src(path.src.javascript +'/libs/**/*')
        .pipe(gulp.dest(path.dest.javascript +'/libs'));
});


// IMAGES ======================================================================
gulp.task('imagemin', function() {

    return gulp.src([
        path.src.image +'/**/*',
        !path.srcImages + '/svg-icons/**/*',
        !path.src.image +'/_*'
        ])
        .pipe(imagemin())
        .pipe(gulp.dest(path.dest.image));
});

gulp.task('images', [
    'imagemin'
]);


// COPY ========================================================================
gulp.task('copy:fonts', function () {
    return gulp.src(path.src.fonts +'/**/*')
        .pipe(gulp.dest(path.dest.fonts));
});


// RELEASE =====================================================================
gulp.task('release:zip', function () {
    return gulp.src(path.dest.base + '/**/*')
        .pipe(zip(pageName + '.zip'))
        .pipe(gulp.dest(path.dest.release));
});


// CLEAN =======================================================================
gulp.task('clean:dist', function () {
    return del(path.dest.base +'/**/*', function (err, deletedFiles) {
        notify('Delete destination folder', 'crazy');
    });
});
gulp.task('clean:release', function () {
    return del(path.dest.release +'/**/*', function (err, deletedFiles) {
        notify('Delete destination folder', 'crazy');
    });
});


// WATCH =======================================================================
gulp.task('watch', ['browserSync'], function() {
    gulp.watch(path.src.scss +'/**/*.scss',     ['scss']);
    gulp.watch(path.src.data +'/*.yml',         ['markup']);
    gulp.watch(path.src.image +'/**/*',         ['images']);
    gulp.watch(path.src.base +'/**/*.twig',     ['markup']);
    gulp.watch(path.src.javascript +'/**/*',    ['javascripts']);
});


// BROWSER SYNC ================================================================
gulp.task('browserSync', ['build'], function() {
    browserSync({
        server: {
            baseDir: 'dist/'
        },
        options: {
            reloadDelay: 250
        },
        notify: false
    });
});


// BUILD =======================================================================
gulp.task('build', function(callback) {
    runSequence(
        'clean:dist',
        'images',
        'scss',
        'markup',
        'javascripts',
        'copy:fonts',
        callback
    );
});

// PUBLISH TASK ================================================================
gulp.task('setPublish', function() {
    isPublish = true;
});

gulp.task('publish', function(callback) {
    runSequence(
        'setPublish',
        'build',
        callback
    );
});


// RELEASE TASK ================================================================
gulp.task('setRelease', function() {
    isRelease = true;
});

gulp.task('release', function(callback) {
    runSequence(
        'setRelease',
        'clean:release',
        'build',
        'release:zip',
        callback
    );
});


// DEFAULT TASK ================================================================
gulp.task('default', ['watch']);
