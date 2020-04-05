const fs = require('fs-extra');

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

  async append(file, dest) {
    const [exists, content] = await Promise.all([
      this.exists(dest),
      file.async('nodebuffer'),
    ]);

    if (exists) {
      const original = await fs.readFile(dest);

      if (original.includes(content)) {
        // Ignore
        return Promise.resolve();
      }

      return fs.appendFile(dest, content);
    }

    return this.copy(file, dest);
  },
};
