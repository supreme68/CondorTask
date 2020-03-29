const {series, src, dest} = require("gulp");
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const fs   = require('fs');


const jsInput = 'app/scripts/*.js';


function sassBuild(){
        return src('scss/style.scss')
            .pipe(sourcemaps.init())
            .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
            .pipe(autoprefixer())
            .pipe(sourcemaps.write())
            .pipe(dest("bin/"))
            .pipe(browserSync.reload({
                stream:true
            }))
}

function minifyJS(){
    return src('app/scripts/scripts.js')
        .pipe(sourcemaps.init())
        ,pipe(babe({
            presets:["env"]
        }))
        .pipe(concat("scripts.js"))
        .pipe(dest('app/scripts'))
        .pipe(rename("scripts.min.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write("."))
        .pipe(dest())
}

exports.build = series(sassBuild);