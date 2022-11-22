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

function delete_defer_load_comment() {
  return src(['public/index.html'])
  .pipe(replace('<!-- defer_load_script', ''))
  .pipe(replace('defer_load_script -->', ''))
  .pipe(dest('public/'))
}

function add_gz_to_filename() {

  let filenames_gz = []

  return src(['build/index.html'])
    .pipe(replace('<script defer="defer" src="/static/js/main.481026e7.js"></script><link href="/static/css/main.5ce765c0.css" rel="stylesheet">', ''))
    .pipe(replace('react_css_build', '/static/css/main.5ce765c0.css.gz'))
    .pipe(replace('react_js_build', '/static/js/main.481026e7.js.gz'))
    .pipe(dest('build/')) 

}

function copy_mib_file() {
  return src(['src/mib/okb_alpha.mib'])
  .pipe(dest('build/mib/'))
}


exports.build_gzip = build_gzip;
exports.delete_raw_files = delete_raw_files;
exports.delete_http = delete_http;
exports.delete_defer_load_comment = delete_defer_load_comment;
exports.add_gz_to_filename = add_gz_to_filename;
exports.copy_mib_file = copy_mib_file;
exports.graph_svg_min = graph_svg_min;

exports.pre_build_preparation = series(delete_http, delete_defer_load_comment)
exports.full_gzip_build = series(copy_mib_file, build_gzip, delete_raw_files, add_gz_to_filename)
