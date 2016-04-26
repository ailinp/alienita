// *************************************
//
//   Gulpfile
//
// *************************************
//
// Available tasks:
//   `browserSync`
//   `build`
//   `clean:dist`
//   `css`
//   `concat:json`
//   `concat:scripts`
//   `concat:polyfills`
//   `copy:javascripts`
//   `copy:fonts`
//   `default`
//   `imagemin`
//   `images`
//   `javascripts`
//   `markup`
//   `publish`
//   `publish:set`
//   `publish:build`
//   `svg-sprite`
//   `watch`
//
// *************************************

// -------------------------------------
//   Plugins
// -------------------------------------
//
// gulp                 : The streaming build system
// gulp-autoprefixer    : Prefix CSS
// gulp-changed         : Check if files have changed
// gulp-check-filesize  : Check the size of files
// gulp-combine-mq      : Combine media queries
// gulp-concat          : Concatenate files
// gulp-csso            : Minify CSS with CSSO
// gulp-email           : Send email
// gulp-grunt           : Run grunt tasks from gulp (grunticon)
// gulp-imagemin        : Minify images
// gulp-load-plugins    : Automatically load Gulp plugins
// gulp-minify-css      : Minify CSS
// gulp-pixrem          : Create fallback of rems to pixel
// gulp-plumber         : Prevent pipe breaking from errors
// gulp-rename          : Rename files
// gulp-replace         : String replace
// gulp-sass            : Compile Sass
// gulp-sourcemaps      : Create sourcemaps of CSS
// gulp-twig            : Compile Twig
// gulp-uglify          : Minify JavaScript with UglifyJS
// gulp-util            : Utility functions
// gulp-yaml            : Convert YAML file into JSON
// gulp-zip             : Create a zip
// browser-sync         : Live CSS Reload & Browser Syncing
// child_process        : Util functions of npm
// del                  : Delete files/folders using globs
// fs                   : File parser
// glob                 : Match files using the patterns the shell uses
// imagemin-svgo        : Support of imagemin for SVGO
// run-sequence         : Run a series of dependent Gulp tasks in order
// vinyl-ftp            : Vinyl adapter for FTP
//
// -------------------------------------

var gulp        = require( 'gulp' ),
    browserSync = require( 'browser-sync' ),
    exec        = require( 'child_process' ).exec,
    del         = require( 'del' ),
    fs          = require( 'fs' ),
    glob        = require( 'glob' ),
    svgo        = require( 'imagemin-svgo' ),
    runSequence = require( 'run-sequence' ),
    plugins     = require( 'gulp-load-plugins' )({
        camelize: true,
        rename : {
            'gulp-util' : 'gutil'
        }
    });

require( 'gulp-grunt' )( gulp );

// -------------------------------------
//   Funtions
// -------------------------------------
function notify( message, kaomoji )
{
    kaomoji = kaomoji || 'writing';
    plugins.gutil.log( opts.kaomoji[kaomoji] +' '+ message );
}

function throwError( err )
{
    var quotes       = plugins.gutil.colors.gray('\''),
        message      = 'Error compiling. '+ err +' ',
        fileName     = quotes + plugins.gutil.colors.cyan('Error') + quotes,
        errorMessage = plugins.gutil.colors.red(message + opts.kaomoji.fuck);

    plugins.gutil.log( fileName, errorMessage );
}

function parseJsonFiles()
{
    var data = fs.readFileSync(routes.src.data +'/data.json', 'utf-8');
    data = JSON.parse( data.toString() );
    opts.json_data = data;
}

function getUrlPrefix( page )
{
    var url = '/';

    if (opts.isRelease) {
        url = '/'+ page.releaseUrl +'/';

    } else if (opts.isPublish) {
        url = '/'+ page.publishUrl +'/'+ opts.pageSlug +'/';
    }

    return url;
}

// -------------------------------------
//   Routes
// -------------------------------------
var routes = {
        tmp : '.tmp',
        src : {
            base : 'src',
            data : 'src/data',
            markup : 'src/markup',
            web : 'src/markup/web',
            scss : 'src/assets/scss',
            fonts : 'src/assets/fonts',
            image : 'src/assets/images',
            svg : 'src/assets/images/svg-icons',
            javascript : 'src/assets/javascripts'
        },
        dest : {
            base : 'dist',
            scss : 'dist/assets/stylesheets',
            javascript : 'dist/assets/javascripts',
            fonts : 'dist/assets/fonts',
            image : 'dist/assets/images',
            svg : 'dist/assets/images/svg-icons'
        }
    };

// -------------------------------------
//   Variables
// -------------------------------------
var opts = {
    timestamp : new Date().getTime(),
    isPublish : false,
    json_data : {},
    kaomoji : {
        common :  '(」゜ロ゜)」',
        crazy :   '(⊙_◎)',
        fuck :    '(╯°□°）╯︵ ┻━┻',
        start :   '(ﾉ･ｪ･)ﾉ',
        yeah :    '＼（＠￣∇￣＠）／',
        writing : '＿〆(。。)'
    }
};


var twig_options = {
    functions : [
        {
            name: 'getUrlPrefix',
            func: getUrlPrefix
        }
    ]
};

// -------------------------------------
//   Options
// -------------------------------------

var options = {
    // ----- Default ----- //
    default : {
        tasks : [ 'watch' ]
    },

    // ----- Browser Sync ----- //
    browsersync : {
        tasks : [ 'build' ],
        args : {
            server: { baseDir: routes.dest.base +'/' },
            options: { reloadDelay: 250 },
            notify: false
        }
    },

    // ----- Build ----- //
    build : {
        tasks : [ 'clean:dist', 'images', 'css', 'markup', 'javascripts', 'copy:fonts' ]
    },

    // ----- CSS ----- //
    css : {
        message : 'Compiling Scss',
        files : [
            routes.src.scss +'/**/*.scss',
            routes.src.markup +'/**/*.scss'
        ],
        destination: routes.dest.scss,
        scss_args : {
            sourceComments : 'map',
            imagePath : routes.src.image
        },
        combineMq_args : { beautify: true },
        autoprefixer_args : {
            browsers : [ 'last 2 versions', 'ie 9' ],
            cascade : true
        },
        sourcemaps_args : { includeContent : false },
        minifyCss_args : { keepSpecialComments : 0 }
    },

    // ----- Clean ----- //
    clean : {
        dist : {
            files : routes.dest.base +'/**/*',
            message : 'Delete destination folder'
        }
    },

    // ----- Concat ----- //
    concat : {
        json : {
            files : [
                routes.src.data +'/*.yml',
                routes.src.markup +'/**/*.yml',
                '!'+ routes.src.data +'/data.yml'
            ],
            file : 'data.yml',
            destination : routes.src.data
        },
        polyfills : {
            files : [
                routes.src.javascript +'/polyfills/selectivizr.js',
                routes.src.javascript +'/polyfills/respond.js'
            ],
            file : 'polyfills.js',
            destination : routes.dest.javascript
        },
        scripts : {
            files : [
                routes.src.javascript +'/components/**/*',
                routes.src.markup +'/**/*.js',
                routes.src.javascript +'/*'
            ],
            file : 'scripts.js',
            destination : routes.dest.javascript
        }
    },

    // ----- Copy ----- //
    copy : {
        javascripts : {
            files : routes.src.javascript +'/libs/**/*',
            destination : routes.dest.javascript +'/libs'
        },
        fonts : {
            files : routes.src.fonts +'/**/*',
            destination : routes.dest.fonts
        }
    },

    // ----- Imagemin ----- //
    imagemin : {
        files: [
            routes.src.image + '/**/*',
            routes.src.svg + '/**/*',
            '!'+ routes.srcImages + '/_old/**/*'
        ],
        destination : routes.dest.image
    },

    // ----- Images ----- //
    images : {
        tasks : [ 'imagemin', 'svg-sprite' ]
    },

    // ----- Javascripts ----- //
    javascripts : {
        tasks : [ 'concat:scripts', 'concat:polyfills', 'copy:javascripts' ]
    },

    // ----- Markup ----- //
    markup : {
        tasks : [ 'concat:json' ],
        files : [
            routes.src.web +'/**/*.twig',
            '!'+ routes.src.web +'/**/_*.twig'
        ],
        all : {
            files : [
                routes.src.markup +'/**/*.twig'
            ],
        },
        destination : routes.dest.base,
        data : routes.src.data +'/data.json',
        minify : {
            conditionals : true,
            empty : true
        }
    },

    // ----- Publish ----- //
    publish : {
        tasks : [ 'publish:build' ],
        build : {
            tasks : [ 'publish:set', 'build' ]
        }
    },

    // ----- SVG ----- //
    svg : {
        tasks : [ 'grunt-grunticon' ],
        files : routes.tmp + '/*.css',
        destination : routes.dest.scss
    },

    // ----- Watch ----- //
    watch : {
        tasks : [ 'browserSync' ],
        files : function() {
            return [
                options.css.files,
                options.markup.all.files,
                options.imagemin.files,
                options.concat.json.files,
                options.concat.scripts.files
            ]
        },
        run : function() {
            return [
                [ 'css' ],
                [ 'markup' ],
                [ 'images' ],
                [ 'markup' ],
                [ 'javascripts' ]
            ]
        }
    }
};

// -------------------------------------
//   Task: Browser Sync
// -------------------------------------

gulp.task( 'browserSync', options.browsersync.tasks, function() {
    browserSync( options.browsersync.args );
});

// -------------------------------------
//   Task: Build
// -------------------------------------

gulp.task( 'build', function( callback ) {
    var tasks = options.build.tasks;
    tasks.push(callback);
    runSequence.apply(null, tasks);
});

// -------------------------------------
//   Task: Clean: Destination
// -------------------------------------

gulp.task( 'clean:dist', function () {
    return del( options.clean.dist.files, function ( err, deletedFiles ) {
        notify( options.clean.dist.message, 'crazy' );
    });
});

// -------------------------------------
//   Task: CSS
// -------------------------------------

gulp.task( 'css', function () {
    notify( options.css.message, 'writing' );
    return gulp.src( options.css.files )
        .pipe( plugins.plumber( function(error) {
            notify( error.message, 'fuck' );
            this.emit( 'end' );
        }))
        .pipe( plugins.sourcemaps.init() )
        .pipe( plugins.sass( options.css.scss_args ))
        .pipe( plugins.combineMq( options.css.combineMq_args ))
        .pipe( plugins.replace(/\{\*timestamp\*\}/g, opts.timestamp) )
        .pipe( plugins.pixrem() )
        .pipe( plugins.autoprefixer( options.css.autoprefixer_args ))
        .pipe( plugins.sourcemaps.write( '.', options.css.sourcemaps_args ))
        .pipe( gulp.dest( options.css.destination ))
        .pipe( plugins.minifyCss( options.css.minifyCss_args ))
        .pipe( plugins.rename({ suffix : '.min' }) )
        .pipe( plugins.csso() )
        .pipe( plugins.checkFilesize({ fileSizeLimit : 50000 }) )
        .pipe( gulp.dest( options.css.destination ) )
        .pipe( browserSync.reload({ stream:true }) );
});

// -------------------------------------
//   Task: Concat: Json
// -------------------------------------

gulp.task( 'concat:json', function() {
    return gulp.src( options.concat.json.files )
        .pipe( plugins.plumber({ errorHandler: throwError }) )
        .pipe( plugins.concat( options.concat.json.file ))
        .pipe( gulp.dest(  options.concat.json.destination  ))
        .pipe( plugins.yaml() )
        .pipe( gulp.dest(  options.concat.json.destination  ));
});

// -------------------------------------
//   Task: Concat: Scripts
// -------------------------------------

gulp.task( 'concat:scripts', function() {
    return gulp.src( options.concat.scripts.files )
    .pipe( plugins.uglify() )
    .pipe( plugins.plumber(function(error) {
        notify(error.message, 'fuck');
        this.emit('end');
    }))
    .pipe( plugins.concat( options.concat.scripts.file, { newLine: ';' } ))
    .pipe( plugins.checkFilesize({ fileSizeLimit : 50000 }))
    .pipe( gulp.dest( options.concat.scripts.destination ));
});

// -------------------------------------
//   Task: Concat: Polyfills
// -------------------------------------

gulp.task( 'concat:polyfills', function() {
    return gulp.src( options.concat.polyfills.files )
    .pipe( plugins.uglify() )
    .pipe( plugins.concat(options.concat.polyfills.file, { newLine: ';' }) )
    .pipe( plugins.checkFilesize({ fileSizeLimit : 50000 }) )
    .pipe( gulp.dest( options.concat.polyfills.destination ) );
});

// -------------------------------------
//   Task: Copy: Javascripts
// -------------------------------------

gulp.task( 'copy:javascripts', function () {
    return gulp.src( options.copy.javascripts.files )
        .pipe( gulp.dest( options.copy.javascripts.destination ));
});

// -------------------------------------
//   Task: Copy: Fonts
// -------------------------------------

gulp.task( 'copy:fonts', function () {
    return gulp.src( options.copy.fonts.files )
        .pipe( gulp.dest( options.copy.fonts.destination ));
});

// -------------------------------------
//   Task: Default
// -------------------------------------

gulp.task( 'default', options.default.tasks );

// -------------------------------------
//   Task: Imagemin
// -------------------------------------

gulp.task('imagemin', function() {
    return gulp.src( options.imagemin.files )
        .pipe( plugins.imagemin() )
        .pipe( svgo({
            plugins: [
                { removeViewBox : false },
                { removeEmptyAttrs : false },
                { removeComments : true },
                { removeTitle : true }
            ]
        })())
        .pipe( gulp.dest( options.imagemin.destination ));
});

// -------------------------------------
//   Task: Images
// -------------------------------------

gulp.task( 'images', options.images.tasks );

// -------------------------------------
//   Task: Javascripts
// -------------------------------------

gulp.task( 'javascripts', options.javascripts.tasks );

// -------------------------------------
//   Task: Markup
// -------------------------------------

gulp.task('markup', options.markup.tasks, function () {
    if (!fs.existsSync( options.markup.data )) {
        throwError();
        return true;
    }
    parseJsonFiles();

    var args = {
        data: opts.json_data,
        cache: false,
        functions: twig_options.functions
    };

    return gulp.src( options.markup.files )
        .pipe( plugins.twig( args ))
        .pipe( plugins.replace( /\{\*timestamp\*\}/g, opts.timestamp ))
        .pipe( plugins.checkFilesize({ fileSizeLimit : 50000 }))
        .pipe( gulp.dest( options.markup.destination ))
        .pipe( browserSync.reload({ stream:true }) );
});

// -------------------------------------
//   Task: Publish
// -------------------------------------

gulp.task( 'publish', options.publish.tasks );

// -------------------------------------
//   Task: Publish: Set
// -------------------------------------

gulp.task( 'publish:set', function() {
    isPublish = true;
});

// -------------------------------------
//   Task: Publish: Build
// -------------------------------------

gulp.task( 'publish:build', function( callback ) {
    var tasks = options.publish.build.tasks;
    tasks.push(callback);
    runSequence.apply( null, tasks );
});

// -------------------------------------
//   Task: SVG Sprites
// -------------------------------------

gulp.task( 'svg-sprite', options.svg.tasks, function() {
    gulp.src( options.svg.files )
        .pipe( plugins.csso() )
        .pipe( plugins.rename({ suffix:'.min' }))
        .pipe( plugins.checkFilesize({ fileSizeLimit : 50000 }))
        .pipe( gulp.dest( options.svg.destination ))
});

// -------------------------------------
//   Task: Watch
// -------------------------------------

gulp.task( 'watch', options.watch.tasks, function() {
    var watchFiles = options.watch.files();
    watchFiles.forEach( function( files, index ) {
        gulp.watch( files, options.watch.run()[ index ] );
    });
});
