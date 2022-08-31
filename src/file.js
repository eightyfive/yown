const fs = require('fs-extra');
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
};
