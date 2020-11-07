const fs = require('fs-extra');
const diff = require('diff');

module.exports = {
  exists(path) {
    return fs.pathExists(path);
  },

  json(path) {
    return fs.readJson(path);
  },

  copy(file, dest) {
    return file.async('nodebuffer').then((buff) => fs.outputFile(dest, buff));
  },

  patch(file, dest) {
    return fs
      .pathExists(dest)
      .then((exists) =>
        exists ? fs.readFile(dest, 'utf8') : Promise.resolve(''),
      )
      .then((original) =>
        file
          .async('text')
          .then((patch) =>
            fs.outputFile(dest, diff.applyPatch(original, patch)),
          ),
      );
  },
};
