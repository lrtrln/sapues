'use strict'

import gulp           from 'gulp'
import batch          from 'gulp-batch'
import watch          from 'gulp-watch'
import plumber        from 'gulp-plumber'
import notify         from 'gulp-notify'
import gutil          from 'gulp-util'
import source         from 'vinyl-source-stream'
import buffer         from 'vinyl-buffer'
import pugInheritance from 'gulp-pug-inheritance'
import pug            from 'gulp-pug'
import sass           from 'gulp-sass'
import postcss        from 'gulp-postcss'
import autoprefixer   from 'autoprefixer'
import minifyCSS      from 'gulp-csso'
import sourcemaps     from 'gulp-sourcemaps'
import babel          from 'gulp-babel'
import browserify     from 'browserify'
import babelify       from 'babelify'
import es2015         from 'babel-preset-es2015'
import uglify         from 'gulp-uglify'
import browserSync    from 'browser-sync'
import filter         from 'gulp-filter'
import changed        from 'gulp-changed'

browserSync.create()

// PATHS
const dirs = {
  src: 'src',
  dest: 'dist'
}
const paths = {
  css: {
    source:     `${dirs.src}/sass/**/*.{sass,scss}`,
    dest  :     `${dirs.dest}/assets/css/`,
  },
  js: {
    source:    `./${dirs.src}/js/main.js`,
    dest  :     `${dirs.dest}/assets/js/`,
    //vendor:     `${dirs.src}/assets/js/vendor/*.js`,
    //js    :     [`${dirs.src}/assets/js/vendor.min.js`, `${dirs.src}/assets/js/main.min.js`]
  },
  pug: {
    source:     [`${dirs.src}/templates/**/*.pug`],
    dest  :     `${dirs.dest}/`,
  },
    images: {
      source:     `${dirs.src}/assets/img/**/*.{png,jpg,jpeg,gif}`,
      dest  :     `${dirs.dest}/assets/img/`
  }
}

// SASS
gulp.task('sass', () => {
  return gulp.src(paths.css.source)
    .pipe(plumber({errorHandler: notify.onError({
        message: "<%= error.message %>",
        title: "CSS preprocessing"
      })}))
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(postcss([autoprefixer({browsers: ['last 3 version']})]))
    .pipe(minifyCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.css.dest))
    .pipe(browserSync.stream({match: '**/*.css'}))
})

// PUG
gulp.task('pug', () => {
  return gulp.src(paths.pug.source)
    .pipe(plumber({errorHandler: notify.onError({
        message: "<%= error.message %>",
        title: "Template compilation"
      })}))
    .pipe(changed(dirs.dest, {extension: '.html'}))
    .pipe(pugInheritance({basedir: 'src/templates', extension: '.pug', skip:'node_modules'}))
    .pipe(filter( (file) => {
      return !/\/_/.test(file.path) && !/^_/.test(file.relative);
    }))
    .pipe(pug())
    .pipe(gulp.dest(paths.pug.dest))
    .pipe(browserSync.stream())
})

// ES6
gulp.task('js', () => {
  browserify(paths.js.source)
    .transform(babelify.configure({ presets: [es2015] }))
    .on('error', notify.onError({
        message: "<%= error.message %>",
        title: "Babelify JS"
      }))
    .bundle()
    .on('error', notify.onError({
        message: "<%= error.message %>",
        title: "JS compilation"
      }))
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(browserSync.stream())
})

// SERVE
gulp.task('serve', () => {

    browserSync.init({
        server: {
          baseDir: "dist",
        },
        open: false,
    })

    gulp.watch(paths.css.source, ['sass'])
    gulp.watch(paths.js.source, ['js'])
    gulp.watch(paths.pug.source, ['pug'])
    //gulp.watch(paths.images.source, browserSync.reload)
})

// TASKS
gulp.task('default', [ 'build', 'serve' ])
gulp.task('build', [ 'pug', 'sass', 'js' ])
