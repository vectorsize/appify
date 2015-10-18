"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var fs = _interopRequire(require("fs"));

var join = require("path").join;

var assign = _interopRequire(require("object-assign"));

var makePLIST = function (vars) {
  return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">\n<plist version=\"1.0\">\n<dict>\n    <key>CFBundleExecutable</key>\n    <string>bin</string>\n    <key>CFBundleInfoDictionaryVersion</key>\n    <string>1.0</string>\n    <key>CFBundleIconFile</key>\n    <string>" + vars.icon + "</string>\n    <key>CFBundlePackageType</key>\n    <string>APPL</string>\n    <key>CFBundleSignature</key>\n    <string>????</string>\n    <key>CFBundleVersion</key>\n    <string>" + vars.version + "</string>\n</dict>\n</plist>";
};

function mkdirIFNE(basePath, _path) {
  var dirPath = "" + basePath + "" + DS + "" + _path;
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
  return dirPath;
}

function createPath(basePath, pathString) {
  var paths = pathString.split(DS);
  paths.reduce(mkdirIFNE, basePath);
}

function die(error) {
  console.error("\n" + error);
  process.exit(1);
}

var args = process.argv.slice(2);
var CWD = process.env.PWD;

if (!args[0]) die("\nNOTE: A path to a file or a directory containing an application package.json must be provided");
var DS = "/";
var src = args[0].replace(".sh", "");
var srcPath = join(CWD, src);
var optsPath = join(srcPath, "package.json");

if (src === "." && !fs.existsSync(optsPath)) {
  die("\nNOTE: You must specify a source for your app if a package.json file is not present");
}

// defaults
var opts = {
  name: src,
  version: "1.0.0",
  icon: "main.icns",
  main: src
};

if (fs.existsSync(optsPath)) opts = assign(opts, require(optsPath));
if (opts.name.indexOf(".app") < 0) opts.name += ".app";

var dest = opts.name;
var srcContent = fs.readFileSync(join(CWD, opts.main));

// creating structure
createPath(CWD, join(dest, "Contents", "MacOS"));
createPath(CWD, join(dest, "Contents", "Resources"));

// adding files

// icon
if (fs.existsSync(opts.icon)) {
  var icoContent = fs.readFileSync(join(CWD, opts.icon));
  fs.writeFileSync(join(dest, "Contents", "Resources", "main.icns"), icoContent);
}

fs.writeFileSync(join(dest, "Contents", "Info.plist"), makePLIST(opts));
fs.writeFileSync(join(dest, "Contents", "MacOS", "bin"), srcContent, { mode: "755" });
console.log("\nSUCESS: successfully built " + dest);
