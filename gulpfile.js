const { src, dest, parallel, series, watch } = require('gulp');
const gzip = require('gulp-gzip');
const clean = require('gulp-clean');
const replace = require('gulp-replace');
const gulpClean = require('gulp-clean');
const svgo = require('gulp-svgmin')

let gzip_file_array = [
  'build/static/js/*.js',
  'build/static/css/*.css',
  'build/static/media/*.svg',
  'build/static/media/*.png',
  'build/static/media/status_graph/*.svg'
];

function build_gzip() {
  return src(gzip_file_array)
  .pipe(gzip())
  .pipe(dest(function (file) {
        return file.base;
    }))
}

function graph_svg_min() {
  return src(['public/static/media/status_graph/*.svg'])
  .pipe(svgo())
  .pipe(dest('build/static/media/status_graph'))
}

function delete_raw_files() {
  return src(gzip_file_array)
  .pipe(clean())
}

function delete_http() {
  return src(['src/App.js'])
  .pipe(replace('192.168.1.114', ''))
  .pipe(replace('http://', ''))
  .pipe(dest('src/'))
}

function add_gz_to_filename() {

  let filenames_gz = [
    'build/static/js/*.js',
    'build/static/css/*.css',
  ]

  return src(['build/index.html'])
    .pipe(replace(/\/static\/css\/main\..{1,}\.css/g, function handleReplace(match) {
      return match + '.gz'
    }))
    .pipe(replace(/\/static\/js\/main\..{1,}\.js/g, function handleReplace(match) {
      return match + '.gz'
    }))
    .pipe(dest('build/'))

}

function copy_mib_file() {
  return src(['src/mib/okb_alpha.mib'])
  .pipe(dest('build/mib/'))
}


exports.build_gzip = build_gzip;
exports.delete_raw_files = delete_raw_files;
exports.delete_http = delete_http;
exports.add_gz_to_filename = add_gz_to_filename;
exports.copy_mib_file = copy_mib_file;
exports.graph_svg_min = graph_svg_min;

exports.full_gzip_build = series(copy_mib_file, build_gzip, delete_raw_files, add_gz_to_filename)
