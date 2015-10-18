'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path2 = require('path');

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var makePLIST = function makePLIST(vars) {
  return '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n<dict>\n    <key>CFBundleExecutable</key>\n    <string>bin</string>\n    <key>CFBundleInfoDictionaryVersion</key>\n    <string>1.0</string>\n    <key>CFBundleIconFile</key>\n    <string>' + vars.icon + '</string>\n    <key>CFBundlePackageType</key>\n    <string>APPL</string>\n    <key>CFBundleSignature</key>\n    <string>????</string>\n    <key>CFBundleVersion</key>\n    <string>' + vars.version + '</string>\n</dict>\n</plist>';
};

function mkdirIFNE(basePath, _path) {
  var dirPath = '' + basePath + DS + _path;
  if (!_fs2['default'].existsSync(dirPath)) _fs2['default'].mkdirSync(dirPath);
  return dirPath;
}

function createPath(basePath, pathString) {
  var paths = pathString.split(DS);
  paths.reduce(mkdirIFNE, basePath);
}

function die(error) {
  console.error('\n' + error);
  process.exit(1);
}

var args = process.argv.slice(2);
var CWD = process.env.PWD;

if (!args[0]) die('\nNOTE: A path to a file or a directory containing an application package.json must be provided');
var DS = '/';
var src = args[0].replace('.sh', '');
var srcPath = (0, _path2.join)(CWD, src);
var optsPath = (0, _path2.join)(srcPath, 'package.json');

if (src === '.' && !_fs2['default'].existsSync(optsPath)) {
  die('\nNOTE: You must specify a source for your app if a package.json file is not present');
}

// defaults
var opts = {
  name: src,
  version: "1.0.0",
  icon: 'main.icns',
  main: src
};

if (_fs2['default'].existsSync(optsPath)) opts = (0, _objectAssign2['default'])(opts, require(optsPath));
if (opts.name.indexOf('.app') < 0) opts.name += '.app';

var dest = opts.name;
var srcContent = _fs2['default'].readFileSync((0, _path2.join)(CWD, opts.main));

// creating structure
createPath(CWD, (0, _path2.join)(dest, 'Contents', 'MacOS'));
createPath(CWD, (0, _path2.join)(dest, 'Contents', 'Resources'));

// adding files

// icon
if (_fs2['default'].existsSync(opts.icon)) {
  var icoContent = _fs2['default'].readFileSync((0, _path2.join)(CWD, opts.icon));
  _fs2['default'].writeFileSync((0, _path2.join)(dest, 'Contents', 'Resources', 'main.icns'), icoContent);
}

_fs2['default'].writeFileSync((0, _path2.join)(dest, 'Contents', 'Info.plist'), makePLIST(opts));
_fs2['default'].writeFileSync((0, _path2.join)(dest, 'Contents', 'MacOS', 'bin'), srcContent, { mode: '755' });
console.log('\nSUCESS: successfully built ' + dest);
