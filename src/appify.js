
import fs from 'fs'
import {join} from 'path'
import assign from 'object-assign'

const makePLIST = (vars) => `\
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>bin</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>1.0</string>
    <key>CFBundleIconFile</key>
    <string>${vars.icon}</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleSignature</key>
    <string>????</string>
    <key>CFBundleVersion</key>
    <string>${vars.version}</string>
</dict>
</plist>`

function mkdirIFNE (basePath, _path) {
  let dirPath = `${basePath}${DS}${_path}`
  if(!fs.existsSync(dirPath)) fs.mkdirSync(dirPath)
  return dirPath
}

function createPath (basePath, pathString) {
  let paths = pathString.split(DS)
  paths.reduce(mkdirIFNE, basePath)
}

function die(error) {
  console.error(`\n${error}`)
  process.exit(1)
}

const args = process.argv.slice(2)
const CWD = process.env.PWD

if(!args[0]) die('\nNOTE: A path to a file or a directory containing an application package.json must be provided')
const DS = '/'
const src = args[0].replace('.sh', '')
const srcPath = join(CWD, src)
const optsPath = join(srcPath, 'package.json')

// @TODO: make this test if it's a directory instead of .
if(src === '.' && !fs.existsSync(optsPath)) {
  die('\nNOTE: You must specify a source for your app if a package.json file is not present')
}

// defaults
let opts = {
  name: src,
  version: "1.0.0",
  icon: 'main.icns',
  main: src
}

if(fs.existsSync(optsPath)) opts = assign(opts, require(optsPath))
if(opts.name.indexOf('.app')<0) opts.name += '.app'

const dest = opts.name
const srcContent = fs.readFileSync(join(CWD, opts.main))


// creating structure
createPath(CWD, join(dest, 'Contents', 'MacOS'))
createPath(CWD, join(dest, 'Contents', 'Resources'))

// adding files

// icon
if(fs.existsSync(opts.icon)) {
  let icoContent = fs.readFileSync(join(CWD, opts.icon))
  fs.writeFileSync(join(dest, 'Contents', 'Resources', 'main.icns'), icoContent)
}

fs.writeFileSync(join(dest, 'Contents', 'Info.plist'), makePLIST(opts))
fs.writeFileSync(join(dest, 'Contents', 'MacOS', 'bin'), srcContent, {mode: '755'})
console.log(`\nSUCESS: successfully built ${dest}`)
