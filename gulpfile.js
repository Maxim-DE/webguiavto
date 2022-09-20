const { src, dest, parallel, series, watch } = require('gulp');
const gzip = require('gulp-gzip');
const clean = require('gulp-clean');

let gzip_file_array = [
  'build/static/js/*.js',
  'build/static/css/*.css',
  'build/static/media/*.svg',
  'build/static/media/*.png'
];

function build_gzip() {

  return src(gzip_file_array)
  .pipe(gzip())
  .pipe(dest(function (file) {
        return file.base;
    }))
}

function delete_raw_files() {
  return src(gzip_file_array)
  .pipe(clean())
}


exports.build_gzip = build_gzip;

exports.delete_raw_files = delete_raw_files;

exports.full_gzip_build = series(build_gzip, delete_raw_files)
