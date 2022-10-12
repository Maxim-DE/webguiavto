const { src, dest, parallel, series, watch } = require('gulp');
const gzip = require('gulp-gzip');
const clean = require('gulp-clean');
const replace = require('gulp-replace');

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

function delete_http() {
  return src(['build/static/js/*.js'])
  .pipe(replace('192.168.1.114', ''))
  .pipe(replace('http://', ''))
  .pipe(dest('build/static/js/'))
}

function add_gz_to_filename() {
  let filenames_gz = [
    'build/static/js/*.js',
    'build/static/css/*.css',
  ]

  function handleReplace(match) {
    console.log(match + '.gz');
    return match + '.gz'
  }

  return src(['build/index.html'])
    .pipe(replace(/\/static\/css\/main\..{1,}\.css/g, function handleReplace(match) {
      console.log(match + '.gz');
      return match + '.gz'
    }))
    .pipe(replace(/\/static\/js\/main\..{1,}\.js/g, function handleReplace(match) {
      console.log(match + '.gz');
      return match + '.gz'
    }))
    .pipe(dest('build/'))

}


exports.build_gzip = build_gzip;
exports.delete_raw_files = delete_raw_files;
exports.delete_http = delete_http;
exports.add_gz_to_filename = add_gz_to_filename;

exports.full_gzip_build = series(delete_http, build_gzip, delete_raw_files, add_gz_to_filename)
