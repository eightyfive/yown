const fs = require("fs-extra");

module.exports = {
  exists(path) {
    return fs.pathExists(path);
  },

  json(path) {
    return fs.readJson(path);
  },

  copy(file, dest) {
    return file.async("nodebuffer").then((buff) => fs.outputFile(dest, buff));
  },
};
