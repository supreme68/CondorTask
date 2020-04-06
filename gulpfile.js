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

function minifyJsFile(jsInput){
    console.log(jsInput);
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

function minifyJS(sb){
    minifyJsFile("src/scripts/index.js");
    minifyJsFile("src/scripts/game.js");
    minifyJsFile("src/scripts/carousel.js");
    if(typeof(sb) == "function"){
        sb()
    }
}

function minifyHTML(){
    return src("src/**/*.html")
            .pipe(sourcemaps.init())
            .pipe(htmlmin({ collapseWhitespace: true }))
            .pipe(sourcemaps.write())
            .pipe(dest('bin/'))
            .pipe(browserSync.reload({
                stream:true
            }));
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

function addLibFiles(sb){
    src("./src/lib/bootstrap/css/bootstrap.min.css")
        .pipe(dest("bin/lib/bootstrap"))
    src("./src/lib/phaser/phaser.min.js")
        .pipe(dest("bin/lib/phaser/"))
    src("./src/lib/bootstrap/js/bootstrap.min.js")
        .pipe(dest("bin/lib/bootstrap"))
    src("./src/lib/jquery/jquery-3.4.1.min.js")
        .pipe(dest("bin/lib/jquery"))
    // minifyJsFile("./src/lib/phaser/phaser.js")
    sb()
}

function addImgs(){
    return src("src/img/*.*")
            .pipe(dest("bin/img"))
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

function startBrowserSync(){
    browserSync.init({
        server: {
            baseDir: './bin',
            index: "/index.html"
        },
    });
    watch(["./src/**/*.scss",  "./src/**/*.js*", "./src/**/*.html*"])
    .on("change",
        function(path, stats){
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

function Clear(sb){
    if(fs.existsSync("bin")){
        return src("bin")
                .pipe(clean())
    }
    console.log("✅ bin has already been cleaned ✅");
    sb()    
}

exports.run = series(createBin ,sassBuild, minifyJS, minifyHTML, addImgs, addLibFiles, startBrowserSync);
exports.build = series(createBin ,sassBuild, minifyJS, minifyHTML, addImgs, addLibFiles);
exports.clear = series(Clear);