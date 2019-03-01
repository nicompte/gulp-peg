const PEG = require("pegjs");
const util = require("util");
const gutil = require("gulp-util");
const through = require("through2");

processFile = (file, opts) => {
  const grammar = file.contents.toString("utf8");
  const parser = PEG.generate(grammar, opts);
  const source = util.format("%s = %s;", opts.exportVar, parser);
  file.path = gutil.replaceExtension(file.path, ".js");
  file.contents = Buffer.from(source);
  return file;
};

module.exports = (opts) => {
  if (opts == null) {
    opts = {};
  }
  if (opts.exportVar == null) {
    opts.exportVar = "module.exports";
  }
  if (opts.output == null) {
    opts.output = "source";
  }
  return through.obj(function (file, _enc, cb) {
    let e;
    if (file.isStream()) {
      return this.emit("error", gutil.PluginError("gulp-peg", "Streams are not supported!"));
    } else if (file.isBuffer()) {
      try {
        this.push(processFile(file, opts));
        return cb();
      } catch (_error) {
        e = _error;
        this.emit("error", e);
        return cb();
      }
    } else if (file.isNull()) {
      this.push(file);
      return cb();
    }
  });
};