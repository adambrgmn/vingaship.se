/* eslint-disable import/no-extraneous-dependencies */
const gulp = require('gulp');
const gutil = require('gulp-util');
const del = require('del');
const hash = require('gulp-hash');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const postcssImport = require('postcss-import');
const postcssUrl = require('postcss-url');
const postcssCssnext = require('postcss-cssnext');
const postcssBrowserReporter = require('postcss-browser-reporter');
const postcssReporter = require('postcss-reporter');
const cssnano = require('cssnano');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const named = require('vinyl-named');
const favicons = require('gulp-favicons');

const server = require('./gulp/server');
const hugo = require('./gulp/hugo');

const webpackConfig = require('./webpack.config');

/**
 * PATHS
 */
const PATHS = {
  site: {
    src: 'site',
    dest: { DEV: '.temp', PROD: 'dist' },
    watch: 'site/**/*',
  },
  css: {
    src: 'src/css/*.css',
    dest: { DEV: '.temp/assets/css', PROD: 'site/static/assets/css' },
    watch: 'src/css/**/*.css',
  },
  js: {
    src: 'src/js/*.js',
    dest: { DEV: '.temp/assets/js', PROD: 'site/static/assets/js' },
    watch: 'src/js/**/*.js',
  },
  favicon: {
    src: 'src/img/favicon.png',
    dest: 'site/static',
  },
  hash: 'site/data/hash',
};


/**
 * CLEAN
 */
const clean = () => del([
  PATHS.site.dest.DEV,
  PATHS.site.dest.PROD,
  PATHS.css.dest.PROD,
  PATHS.js.dest.PROD,
  PATHS.hash,
  'site/static/favicon*.*',
]);

const postProdClean = () => del([
  PATHS.css.dest.PROD,
  PATHS.js.dest.PROD,
  PATHS.hash,
  'site/static/favicon*.*',
]);


/**
 * HUGO
 */
const hugoDev = () => hugo({
  dest: PATHS.site.dest.DEV,
  src: PATHS.site.src,
  buildDrafts: true,
  warningsOnly: true,
  noThrow: true,
});

const hugoProd = () => hugo({
  dest: PATHS.site.dest.PROD,
  src: PATHS.site.src,
  verbose: true,
});


/**
 * CSS
 */
const postcssPluginsCommon = [
  postcssImport(),
  postcssUrl(),
  postcssCssnext(),
];

const postcssPluginsDev = postcssPluginsCommon.concat([
  postcssBrowserReporter(),
  postcssReporter(),
]);

const postcssPluginsProd = postcssPluginsCommon.concat([
  cssnano({ autoprefixer: false }),
]);

const cssDev = () => gulp.src(PATHS.css.src)
  .pipe(sourcemaps.init())
  .pipe(postcss(postcssPluginsDev))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(PATHS.css.dest.DEV))
  .pipe(server.stream());

const cssProd = () => gulp.src(PATHS.css.src)
  .pipe(postcss(postcssPluginsProd))
  .pipe(hash())
  .pipe(gulp.dest(PATHS.css.dest.PROD))
  .pipe(hash.manifest('css.json'))
  .pipe(gulp.dest(PATHS.hash));


/**
 * JS
 */
const jsDev = () => gulp.src(PATHS.js.src)
  .pipe(named())
  .pipe(webpackStream(webpackConfig('development'), webpack))
  .pipe(gulp.dest(PATHS.js.dest.DEV));

const jsProd = () => gulp.src(PATHS.js.src)
  .pipe(named())
  .pipe(webpackStream(webpackConfig('production'), webpack))
  .pipe(hash())
  .pipe(gulp.dest(PATHS.js.dest.PROD))
  .pipe(hash.manifest('js.json'))
  .pipe(gulp.dest(PATHS.hash));


/**
 * FAVICONS
 */
const faviconsProd = () => gulp.src(PATHS.favicon.src)
  .pipe(favicons({
    icons: {
      favicons: true,
      android: false,
      appleIcon: false,
      appleStartup: false,
      coast: false,
      firefox: false,
      windows: false,
      yandex: false,
    },
    logging: false,
    online: false,
  }))
  .on('error', err => gutil.log('favicons', err))
  .pipe(gulp.dest(PATHS.favicon.dest));


/**
 * WATCH
 */
const watch = () => {
  gulp.watch(PATHS.site.watch, gulp.series(hugoDev, server.reload));
  gulp.watch(PATHS.css.watch, cssDev);
  gulp.watch(PATHS.js.watch, jsDev);
};

/**
 * BUILDS
 */
const buildDev = gulp.series(
  hugoDev,
  gulp.parallel(cssDev, jsDev) // eslint-disable-line comma-dangle
);

const buildProd = gulp.series(
  gulp.parallel(cssProd, jsProd, faviconsProd),
  hugoProd,
  postProdClean // eslint-disable-line comma-dangle
);

/**
 * MAIN TASKS
 */
exports.start = gulp.series(clean, buildDev, server.serve, watch);
exports.build = gulp.series(clean, buildProd);


/**
 * OTHER TASKS
 */
exports.clean = clean;
exports.hugoDev = hugoDev;
exports.hugoProd = hugoProd;
exports.cssDev = cssDev;
exports.cssProd = cssProd;