# Appify

Command line that compiles a script into an OSX application bundle.

_ported from http://git.abackstrom.com/appify.git_

# Installation

`$ npm install -g vectorsize/appify`

## Default usage

To compile using the defaults simply type

`appify ScriptName[.sh]`

This will create an `ScriptName.app` next to your `ScriptName`
If there is an icon file called `main.icns` the app will be bundled with that icon. _please note that the icon must be a valid OSX `icns` resource_

## Advanced usage

The script looks for a `package.json` file in the specified path and the default options are overwritten.

`$ appify .`

The default `package.json` looks like this:

```json
{
  "name": "#{ScriptName}",
  "version": "1.0.0",
  "icon": "main.icns",
  "main": "#{ScriptName}"
}
```

This means that you can specify a version for your Application bundle, a valid `icns` resource and a different name.
