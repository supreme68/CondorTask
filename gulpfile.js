//TODO: Add comments to file
//TODO: Format the file
//Imports
const {series, src, dest, watch, gulp} = require("gulp");
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const fs   = require('fs');
const flatten = require('gulp-flatten')
const htmlmin = require('gulp-htmlmin')
const clean = require('gulp-clean');
const debug = require('gulp-debug');
// var cssPathDest = "bin/";


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
        .pipe(dest("./bin/scripts"))
        .pipe(browserSync.reload({
            stream:true
        }))
}

function createBin(sb){
    const folders = [
        'bin/img',
        'bin/scripts'
    ];
    folders.forEach(dir => {
        if(!fs.existsSync("./bin")){
            fs.mkdirSync("./bin");
            console.log("📁 🗑️ bin folder created")
        }
        if(!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
            console.log('📁  folder created:', dir);    
        }   
    });
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
    return src("src/index.html")
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
            .pipe(dest("bin/img"))
}

function Clear(sb){
    if(fs.existsSync("bin")){
        return src("bin")
                .pipe(clean())
    }
    console.log("✅ bin has already been cleaned ✅");
    sb()    
}

function startBrowserSync(){
    browserSync.init({
        server: {
            baseDir: './bin',
            index: "/index.html"
        },
    });
        watch(["./src/scss/*.scss", "./src/scss/template/*.scss*", "./src/scripts/*.js*", "./src/*.html*", "./src/components/*.html"])
        .on("change",
            function(path, stats){
                // cssPathDest = "./src";
                if(path.includes(".html"))
                    minifyHTML();
                if(path.includes(".scss"))
                    sassBuild();
                if(path.includes(".js"))
                    minifyJS();
                  
                browserSync.reload();
            }
        );

        watch(["./src/img"])
        .on("add",
            function(path, stats){
                addImgs();
                browserSync.reload();
            }
        );
}

//NOTE: Always browser sync task is last
exports.start = series(createBin ,sassBuild, minifyJS, minifyHTML, addImgs, startBrowserSync);
exports.build = series(createBin ,sassBuild, minifyJS, minifyHTML, addImgs);
exports.clear = series(Clear);