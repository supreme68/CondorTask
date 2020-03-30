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
const htmlmin = require('gulp-htmlmin')

//TODO: Remove flatten and rename
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
        .pipe(browserSync.reload({
            stream:true
        }))
}

function createBin(sb){
    const folders = [
        'bin/img',
        'bin/scripts'
    ];
    if(!fs.existsSync("./bin")){
        fs.mkdirSync("./bin");
        console.log("📁 🗑️ bin folder created")
        }
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
            }));
}

//TODO:Create a function that reads seperate files
function minifyHTML(){
    return src("src/pages/index.html")
            .pipe(sourcemaps.init())
            .pipe(htmlmin({ collapseWhitespace: true }))
            .pipe(sourcemaps.write())
            .pipe(dest('bin/'))
            .pipe(browserSync.reload({
                stream:true
            }));
}

//TODO:Create a for loop for reading all .js(and html files) files instead of calling the function manualy
function minifyJS(sb){
    minifyJsFile("src/scripts/scripts.js")
    sb()
}

function addImgs(){
    return src("src/img/*.png")
            .pipe(dest("bin/"))
}

function startBrowserSync(sb){
    browserSync.init({
        server: {
            baseDir: 'bin'
        },
    });
    sb();
}

//NOTE: Always browser sync task is last
exports.build = series(createBin ,sassBuild, minifyJS, minifyHTML,addImgs, startBrowserSync);