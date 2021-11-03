const fs = require('fs-extra');
const diff = require('diff');
const prependFile = require('prepend-file');

module.exports = {
  exists(path) {
    return fs.pathExists(path);
  },

  copy(content, dest) {
    return fs.outputFile(dest, content);
  },

  append(content, dest) {
    return fs.appendFile(dest, content);
  },

  prepend(content, dest) {
    return prependFile(dest, content);
  },

  delete(path) {
    return fs.unlink(path);
  },

  patch(content, dest) {
    return fs
      .pathExists(dest)
      .then((exists) =>
        exists ? fs.readFile(dest, 'utf8') : Promise.resolve(''),
      )
      .then((original) =>
        fs.outputFile(dest, diff.applyPatch(original, content)),
      );
  },
};
