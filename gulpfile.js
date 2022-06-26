const { src, dest, watch, series, parallel } = require('gulp');
const plumber = require('gulp-plumber')

// CSS y SASS
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

const sourcemaps = require('gulp-sourcemaps');
// El sourcemap lo podemos dejar o quitar junto con el init y el write de function css
// sirve para ver en que linea modificamos un estilo del scss y si lo quitamos nos sale pero del app.css no del app.css.map que es cómo un mapa 
// nos dirá la linea en que hicimos ejemplo un padding o background etc...

// CSS nano está muy bueno 
const cssnano = require('cssnano');


// imagenes
const imagemin = require('gulp-imagemin');
const squoosh = require('gulp-libsquoosh');
const webp = require('gulp-webp')
const avif = require('gulp-avif')


function css(done) {
    // Compilar sass pasos
    // Identificar archivo que hoja vamos a compilar
    // 2 compilar 3 guardar el css 
    src('src/scss/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'expanded' }))
        .pipe(plumber())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        // Para que se guarde en el build esto sirve para encontrar archivos cuando nos hagan cambios
        // .pipe(sass({ outputStyle: 'compressed'}))
        .pipe(dest('build/css'))
    done();
}
function imagenes(done) {
    src('src/img/**/*')
        .pipe(imagemin({ optimizationLevel: 3 }))
        // Todos los archivos que estén ahí
        .pipe(dest('build/img'));
    done();
}
function versionWebp(done) {
    const opciones = {
        quality: 50
    }
    src('src/img/**/*.{png,jpg}')
        .pipe(webp(opciones))
        .pipe(dest('build/img'))
    done()
}
function versionAvif(done) {
    const opciones = {
        quality: 50
    }
    src('src/img/**/*.{png,jpg}')
        .pipe(avif(opciones))
        .pipe(dest('build/img'))
    done()
}
function dev() {
    watch('src/scss/**/*.scss', css)
    // Encuentra cualquier archivo scss
    watch('src/scss/app.scss', css)
    // El archivo que ve y la función que va a ejecutar
    watch('src/img/**/*', imagenes);
}


exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
// Tareas por default 
exports.default = series(imagenes, versionWebp, versionAvif, css, dev)
// Una vez que ejecuta la tarea css ejecuta la otra
// Con paralel al mismo tiempo inician todas