const trim = require('lodash.trim');
const Log = require('./logger');

const o = Object;
const rePatch = /^([\w-\\]+\.[a-z]{2,4})\.patch$/;

module.exports = {
  getConfig(files) {
    const config = { dir: '' };
    const configFile = files['yown.json'];

    if (configFile) {
      return configFile
        .async('string')
        .then((str) => o.assign(config, JSON.parse(str)))
        .catch((err) => Log.die('Error parsing yown.json file', err));
    }

    return Promise.resolve(config);
  },

  isPatch(filename) {
    return rePatch.test(filename);
  },

  getFilepath(dir, raw) {
    let filepath = raw.split('\\');
    let filename = filepath.pop();

    let isPatch = rePatch.exec(filename);

    if (isPatch) {
      filename = isPatch[1];
    }

    filepath.push(filename);

    const dirName = trim(dir, './');

    if (dirName) {
      filepath.unshift(dirName);
    }

    return `./${filepath.join('/')}`;
  },
};
