const fs = require('fs-extra');
const diff = require('diff');

module.exports = {
  exists(path) {
    return fs.pathExists(path);
  },

  copy(content, dest) {
    return fs.outputFile(dest, content);
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
