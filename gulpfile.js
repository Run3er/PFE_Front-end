var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

var sourcesPathPattern = 'private/sass/**/*.scss';
var destinationPath = 'public/css/';
var autoprefixerOptions = {
	// apprently not used even in uncompressed sass generated css
	cascade: true, 
	// boolean OR array
	browsers: ['last 2 versions', '> 1%', 'Firefox ESR']
};

gulp.task('styles', function() {
    gulp.src(sourcesPathPattern)
        .pipe(sass(/*{includePaths: ['assets/sass']}*/).on('error', sass.logError))
    	.pipe(autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest(destinationPath))
});

//Watch task
gulp.task('default', ['styles'], function() {
    gulp.watch(sourcesPathPattern, ['styles']);
});