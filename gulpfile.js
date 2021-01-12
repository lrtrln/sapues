'use strict'
/**
 * A simple Gulp 4 Starter Kit.
 *
 * @package @lrtrln/sapues
 * @author lrtrln <contact@lrtrln.fr>
 * @version v2.0.0
 * @link https://github.com/lrtrln/sapues GitHub Repository
 *
 * ________________________________________________________________________________
 *
 * gulpfile.js
 *
 * Configuration file.
 *
 */

const gulp                      = require('gulp'),
      del                       = require('del'),
      sourcemaps                = require('gulp-sourcemaps'),
      plumber                   = require('gulp-plumber'),
      sass                      = require('gulp-sass'),
      autoprefixer              = require('gulp-autoprefixer'),
      minifyCss                 = require('gulp-clean-css'),
      babel                     = require('gulp-babel'),
      webpack                   = require('webpack-stream'),
      uglify                    = require('gulp-uglify'),
      concat                    = require('gulp-concat'),
      imagemin                  = require('gulp-imagemin'),
      browserSync               = require('browser-sync').create(),
      pug                       = require('gulp-pug'),
      dependents                = require('gulp-dependents');

// PATHS
const folders = {
  src: 'src',
  dist: 'dist'
}
const paths = {
  css: {
    source:     `${folders.src}/sass/**/*.{sass,scss}`,
    dist  :     `${folders.dist}/assets/css/`,
  },
  js: {
    source:     `${folders.src}/js/**/*.js`,
    dist  :     `${folders.dist}/assets/js/`,
    //vendor:     `${folders.src}/assets/js/vendor/*.js`,
    //js    :     [`${folders.src}/assets/js/vendor.min.js`, `${folders.src}/assets/js/main.min.js`]
  },
  pug: {
    dir:        `${folders.src}/pug`,
    source:     `${folders.src}/pug/**/!(_)*.pug`,
    dist  :     `${folders.dist}/`,
  },
  images: {
    source:     `${folders.src}/images/**/*.+(png|jpg|jpeg|gif|svg|ico)`,
    dist  :     `${folders.dist}/assets/images/`
  }
}

const node = {
  folder:'./node_modules/',
  folderDist: `${folders.dist}/node_modules/`,
  dependencies: Object.keys(require('./package.json').dependencies || {})
}

// CLEAR dist folders
gulp.task('clear', () => del([folders.dist]))

// HTML
gulp.task('html', () => {
  return gulp.src([folders.src + '**/*.html' ], {
    base: folders.src,
    since: gulp.lastRun('html')
  })
    .pipe(gulp.dest(folders.dist))
    .pipe(browserSync.stream());
})

// PUG
gulp.task('pug', () => {
  return gulp.src([
    paths.pug.source
  ], {
    base: paths.pug.dir,
    since: gulp.lastRun('pug')
  })
    .pipe(plumber())
    .pipe(pug())
    .pipe(gulp.dest(paths.pug.dist))
    .pipe(browserSync.stream());
})

// SASS
gulp.task('sass', () => {
  return gulp.src([
    paths.css.source
  ], { since: gulp.lastRun('sass') })
    .pipe(sourcemaps.init())
      .pipe(plumber())
      .pipe(dependents())
      .pipe(sass())
      .pipe(autoprefixer())
      .pipe(minifyCss())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.css.dist))
    .pipe(browserSync.stream());
})

// JS ES6
gulp.task('js', () => {
  return gulp.src([
    paths.js.source
  ], { since: gulp.lastRun('js') })
    .pipe(plumber())
    .pipe(webpack({
      mode: 'production'
    }))
    .pipe(sourcemaps.init())
      .pipe(babel({
        presets: [ '@babel/env' ]
      }))
      .pipe(concat('all.js'))
      .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.js.dist))
    .pipe(browserSync.stream());
})

// IMAGES
gulp.task('images', () => {
  return gulp.src([
    paths.images.source
    ], { since: gulp.lastRun('images') })
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest(paths.images.dist))
    .pipe(browserSync.stream());
})

// VENDOR
gulp.task('vendor', () => {
  if (node.dependencies.length === 0) {
    return new Promise((resolve) => {
      console.log("No dependencies specified");
      resolve();
    })
  }

  return gulp.src(node.dependencies.map(dependency => node.folder + dependency + '/**/*.*'), {
    base: node.folder,
    since: gulp.lastRun('vendor')
  })
    .pipe(gulp.dest(node.folderDist))
    .pipe(browserSync.stream())
})

// BUILD
gulp.task('build',
  gulp.series('clear', 'html', 'pug', 'sass', 'js', 'images', 'vendor')
)

// DEV
gulp.task('dev',
  gulp.series('html', 'pug', 'sass', 'js')
)

// SERVE
gulp.task('serve', () => {
  return browserSync.init({
    server: {
      baseDir: [ 'dist' ]
    },
    port: 3000,
    open: false
  });
});

// WATCH
gulp.task('watch', () => {
  const watchImages = [
    paths.images.source
  ];

  const watchVendor = [];

  node.dependencies.forEach(dependency => {
    watchVendor.push(node.folder + dependency + '/**/*.*')
  })

  const watch = [
    folders.src + '**/*.html',
    paths.pug.dir + '/**/*.pug',
    paths.css.source,
    paths.js.source
  ];

  gulp.watch(watch, gulp.series('dev')).on('change', browserSync.reload);
  gulp.watch(watchImages, gulp.series('images')).on('change', browserSync.reload);
  gulp.watch(watchVendor, gulp.series('vendor')).on('change', browserSync.reload);
});

// DEFAULT
gulp.task('default',
  gulp.series('build', gulp.parallel('serve', 'watch'))
)

