/**
 * Created by akhilesh.kumar on 8/11/2016.
 */
// gulp
var gulp = require('gulp');

// plugins
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify'),
    minify = require('gulp-minify');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var runSequence = require('run-sequence'),
    path=require("path"),
    fs=require("fs"),
    ngAnnotate = require('gulp-ng-annotate'),
    mkdirp = require('mkdirp');


module.exports={
    jsProjStruct:function(ent,out,mangl,cln){
        let outIsDir,
            outDir=out.substring(0,out.lastIndexOf("\\"));
        if(out.substring(out.lastIndexOf("\\")+1).indexOf(".")==-1){
            outIsDir=true
        }
        console.log("outIsDir",outIsDir,outDir);
        if(outIsDir && !fs.existsSync(out)){
            mkdirp(out);
        }else if(!fs.existsSync(out.substring(0,out.lastIndexOf("\\")))){
            mkdirp(out.substring(0,out.lastIndexOf("\\")));
        }
        let srcH=outIsDir?path.join(out,"./")+"**/*.js":out;
        let entIsDir=fs.lstatSync(ent).isDirectory();
        let entH=outIsDir?path.join(ent,"./")+"**/*.js":ent;
        gulp.task('clean', function() {
            if(cln && cln.toLowerCase()=='true'){
                gulp.src(srcH).pipe(clean({force: true}));
            }
        });
        gulp.task('lint', function() {
            gulp.src([srcH, '!./bower_components/**', '!./node_modules/**'])
                .pipe(jshint())
                .pipe(jshint.reporter('default'));
        });
        gulp.task('browserifyDist', function() {
            gulp.src([entH])
                .pipe(browserify({
                    insertGlobals: true,
                    mangle: false,
                    debug: true
                }))
                .pipe(concat(outIsDir?'main.js':out.substring(out.lastIndexOf("\\")+1)))
                .pipe(ngAnnotate()).on('error', function(e){console.log(chalk.red("pipeeee",e))})
                .pipe(uglify({mangle: (mangl && mangl.toLowerCase()=='false')?false:true})).on('error', function(e){console.log(chalk.red("pipeeee"))})
                .pipe(gulp.dest(outIsDir?out:outDir));
        });
        gulp.task('normal', function() {
            runSequence(
                ['clean'],
                ['lint', 'browserifyDist']
            );
        });
        gulp.start('normal');
    }
};
