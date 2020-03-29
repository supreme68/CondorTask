//Imports
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
const flatten = require('gulp-flatten')


function minifyJsFile(jsInput){
    src(jsInput)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets:["env"]
        }))
        .pipe(rename(jsInput.replace(".js", ".min.js")))
        .pipe(uglify())
        .pipe(sourcemaps.write("."))
        .pipe(flatten())
        .pipe(dest("./bin"))
}

function createBin(sb){
    if(!fs.existsSync("./bin")){
        fs.mkdirSync("./bin");
        console.log("📁 🗑️ bin folder created")    }
    sb();
}

function sassBuild(){
    return src('src/scss/style.scss')
            .pipe(sourcemaps.init())
            .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
            .pipe(autoprefixer())
            .pipe(sourcemaps.write())
            .pipe(dest("bin/"))
            .pipe(browserSync.reload({
                stream:true
            }))
}

function minifyJS(sb){
    minifyJsFile("src/scripts/scripts.js")
    sb()
}

exports.build = series(createBin ,sassBuild, minifyJS);