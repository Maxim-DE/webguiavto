const { src, dest, parallel, series, watch } = require('gulp');
const gzip = require('gulp-gzip');
const clean = require('gulp-clean');
const replace = require('gulp-replace');
const gulpClean = require('gulp-clean');
const svgo = require('gulp-svgmin')
const stripDebug = require('gulp-strip-debug')
var exec = require('child_process').exec


let gzip_file_array = [
  'build/static/js/*.js',
  'build/static/css/*.css',
  // 'build/static/media/*.svg',
  // 'build/static/media/*.png',
  'build/static/js/*.js.map',    // Добавить
  'build/static/css/*.css.map',  // Добавить  
  'build/static/js/*.js.map.gz',    // Добавить
  'build/static/css/*.css.map.gz',  // Добавить    
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
  return src(['src/logic/request_logic.js'])
  .pipe(replace(/(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/gi, ''))
  .pipe(replace(/((http([s]){0,1}:\/\/){0,1}(localhost|127.0.0.1){1}(([:]){0,1}[\0-9]{4}){0,1}\/{0,1}){1}/g, ''))
  .pipe(replace('http://', ''))
  .pipe(replace('const server = GRAPH_MODE_TEST ? "" : ""', ''))
  .pipe(replace('${server}', ''))
  .pipe(dest('src/logic'))
}

function disable_graph_test() {
  return src(['src/index.js'])
    .pipe(replace('GRAPH_MODE_TEST = true', 'GRAPH_MODE_TEST = false'))
    .pipe(dest('src'))
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
    .pipe(replace(/<link href="\/static\/css\/main\..{1,}\.css" rel="stylesheet">/g, (match) => {
      const regex = /\/static\/css\/main\..{1,}\.css/g
      const regex_match = match.match(regex)[0]
      const match_gz = regex_match + '.gz'
      filenames_gz.push(match_gz)
      return ''
    }))
    .pipe(replace(/<script defer="defer" src="\/static\/js\/main\..{1,}\.js"><\/script>/g, (match) => {
      const regex = /\/static\/js\/main\..{1,}\.js/g
      const regex_match = match.match(regex)[0]
      const match_gz = regex_match + '.gz'
      filenames_gz.push(match_gz)
      return ''
    }))
    .pipe(replace('react_css_build', (match) => {
      console.log(filenames_gz);
      return filenames_gz[0]
    }))
    .pipe(replace('react_js_build', (match) => {
      console.log(filenames_gz);
      return filenames_gz[1]
    }))
    .pipe(dest('build/')) 

}

function copy_mib_file() {
  return src(['src/mib/okb_alpha.mib'])
  .pipe(dest('build/mib/'))
}

function delete_logs() {
  return src(['build/static/js/*.js'])
  .pipe(stripDebug())
  .pipe(dest('build/static/js/'))
}

// function revert_git(cb) {
//   exec('git checkout src/logic/request_logic.js', function (err, stdout, stderr) {
//     console.log(stdout);
//     console.log(stderr);
//     cb(err);
//   });
//    exec('git checkout public/index.html', function (err, stdout, stderr) {
//     console.log(stdout);
//     console.log(stderr);
//     cb(err);
//   });
// }


exports.build_gzip = build_gzip;
exports.delete_raw_files = delete_raw_files;
exports.delete_http = delete_http;
exports.disable_graph_test = disable_graph_test;
exports.delete_defer_load_comment = delete_defer_load_comment;
exports.add_gz_to_filename = add_gz_to_filename;
exports.copy_mib_file = copy_mib_file;
exports.graph_svg_min = graph_svg_min;
exports.delete_logs = delete_logs
// exports.revert_git = revert_git;

exports.pre_build_preparation = series(delete_http,disable_graph_test, delete_defer_load_comment)
exports.full_gzip_build = series(delete_http, copy_mib_file, build_gzip, delete_raw_files, add_gz_to_filename)
