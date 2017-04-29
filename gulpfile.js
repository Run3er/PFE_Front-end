var gulp = require('gulp');
var util = require('gulp-util');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var spawn = require('child_process').spawn;


// get production -argument
var inDev = !util.env.p && !util.env.prod && !util.env.production;
var inProd = !inDev;

//** CSS preprocessing task
// sassSourcesPathPattern
var sassSrcPthPtrn = 'private/sass/**/*.scss';
var sassDstPth = 'public/css/';
var autoprefixerOptions = {
    // apprently not used for just one generated line
    cascade: true,
    // boolean OR array
    browsers: ['last 2 versions', '> 1%', 'Firefox ESR']
};

gulp.task('styles', function() {
    gulp.src(sassSrcPthPtrn/*, { base: 'private/sass' }*/)
        .pipe(inDev ? sourcemaps.init() : util.noop())
        .pipe(sass({outputStyle: inProd ? 'compressed' : 'nested'/*, includePaths: ['assets/sass']*/})
                .on('error', sass.logError))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(inDev ? sourcemaps.write('.') : util.noop())
        .pipe(gulp.dest(sassDstPth))
});


//** JS preprocessing tasks
// jsSourcesPathPattern
var jsSrcPthPtrnRoot = 'private/js/**/';
var jsSrcPthPtrnSuffix = '*.js';
var jsSrcPthPtrn = jsSrcPthPtrnRoot + jsSrcPthPtrnSuffix;
var jsSrcPthPtrnAppsSuffix = 'app-*.js';
var jsSrcAppsPthPtrn = jsSrcPthPtrnRoot + jsSrcPthPtrnAppsSuffix;
var jsDestinationPath = 'public/js/';

gulp.task('js', function () {
    gulp.src([jsSrcAppsPthPtrn, jsSrcPthPtrn])
        .pipe(inDev ? sourcemaps.init() : util.noop())
        .pipe(concat('app.js'))
        .pipe(inProd ? ngAnnotate() : util.noop())
        .pipe(inProd ? uglify() : util.noop())
        .pipe(inDev ? sourcemaps.write('.') : util.noop())
        .pipe(gulp.dest(jsDestinationPath))
});


//** live-server launching
var lsrvCmd = "npm run lsrv";

gulp.task('lsrv', function () {
    console.log(lsrvCmd);
    var lsrv = spawn(lsrvCmd, { shell: true });

    lsrv.on('error', function (err) {
        console.log(err + "\nlive-server: Failed to start npm package. " +
            "Be sure to have it installed and available in your path.");
    });

    lsrv.stdout.on( 'data', function (data) {
        console.log( 'live-server: ' + data );
    });
    lsrv.stderr.on( 'data', function (data) {
        console.log( 'live-server: ' + data );
    });
    lsrv.on( 'close', function (code) {
        console.log( 'live-server: EXIT' + code );
    });
});


// Default watch task
gulp.task('default', ['styles', 'js', 'lsrv'], function() {
    if (inDev) {
        gulp.watch(sassSrcPthPtrn, ['styles']);
        gulp.watch(jsSrcPthPtrn, ['js']);
    }
});