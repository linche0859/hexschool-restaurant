// plugins
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import nodeSass from 'node-sass';
import autoprefixer from 'autoprefixer';
import del from 'del';
import browserSync from 'browser-sync';
import minimist from 'minimist';
import { envOptions } from './envOptions';

const $ = gulpLoadPlugins();

const options = minimist(process.argv.slice(2), envOptions);
//現在開發狀態
console.log(`Current mode：${options.env}`);

$.sass.compiler = nodeSass;

export const clean = () => del([envOptions.deploySrc]);

export function layoutHTML() {
  return gulp
    .src(envOptions.html.src)
    .pipe($.plumber())
    .pipe($.frontMatter())
    .pipe(
      $.layout((file) => {
        return file.frontMatter;
      })
    )
    .pipe(
      $.if(
        options.env === 'production',
        $.htmlmin({ collapseWhitespace: true, removeComments: true })
      )
    )
    .pipe(gulp.dest(envOptions.html.path))
    .pipe(browserSync.stream());
}

export function styles() {
  return (
    gulp
      .src(envOptions.style.src)
      .pipe($.plumber())
      .pipe($.sourcemaps.init())
      .pipe(
        $.sass({
          outputStyle: envOptions.style.outputStyle,
          includePaths: envOptions.style.includePaths
        }).on('error', $.sass.logError)
      )
      // 這時已經編譯好 css
      .pipe($.postcss([autoprefixer()]))
      .pipe($.if(options.env === 'production', $.cleanCss()))
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest(envOptions.style.path))
      .pipe(browserSync.stream())
  );
}

export function vendorsJs() {
  return gulp
    .src(envOptions.vendors.src)
    .pipe($.concat(envOptions.vendors.concat))
    .pipe(gulp.dest(envOptions.vendors.path));
}

export function scripts() {
  return gulp
    .src(envOptions.javascript.src, { sourcemaps: true })
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe(
      $.babel({
        presets: ['@babel/env']
      })
    )
    .pipe(
      $.if(
        options.env === 'production',
        $.uglify({
          compress: {
            drop_console: true
          }
        })
      )
    )
    .pipe($.concat('all.js'))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(envOptions.javascript.path))
    .pipe(browserSync.stream());
}

export function images() {
  return gulp
    .src(envOptions.image.src)
    .pipe($.if(options.env === 'production', $.imagemin()))
    .pipe(gulp.dest(envOptions.image.path));
}

export function icons() {
  return gulp
    .src(envOptions.icon.src)
    .pipe(gulp.dest(envOptions.icon.path))
    .pipe(browserSync.stream());
}

export function browser() {
  browserSync.init({
    server: {
      baseDir: envOptions.browserSetting.dir
    },
    port: envOptions.browserSetting.port
    // reloadDebounce: 2000
  });
}

export function watchFiles() {
  gulp.watch(envOptions.html.src, layoutHTML);
  gulp.watch(envOptions.html.ejsSrc, layoutHTML);
  gulp.watch(envOptions.javascript.src, scripts);
  gulp.watch(envOptions.style.src, styles);
  gulp.watch(envOptions.image.src, images);
}

export function deploy() {
  return gulp.src(envOptions.deploySrc).pipe($.ghPages());
}

exports.build = gulp.series(
  clean,
  images,
  icons,
  layoutHTML,
  styles,
  vendorsJs,
  scripts
);

exports.default = gulp.series(
  clean,
  images,
  icons,
  layoutHTML,
  styles,
  vendorsJs,
  scripts,
  gulp.parallel(browser, watchFiles)
);
