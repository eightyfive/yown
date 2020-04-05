const trim = require('lodash.trim');

const reAppend = /^([\w-]+)_\.([a-z]{2,4})$/;

module.exports = {
  getConfig(files) {
    const config = { dir: '' };
    const configFile = files['yown.json'];

    if (configFile) {
      return configFile
        .async('string')
        .then((str) => Object.assign(config, JSON.parse(str)));
    }

    return Promise.resolve(config);
  },

  isAppend(filename) {
    return reAppend.test(filename);
  },

  getFilepath(dir, raw) {
    let filepath = raw.split('\\');
    let filename = filepath.pop();

    const [, name, ext] = reAppend.exec(filename) || [];

    if (name && ext) {
      filename = `${name}.${ext}`;
    }

    filepath.push(filename);

    const dirName = trim(dir, './');

    if (dirName) {
      filepath.unshift(dirName);
    }

    return `./${filepath.join('/')}`;
  },
};
