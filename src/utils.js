const trim = require('lodash.trim');
const Log = require('./logger');

const o = Object;
const rePatch = /^([\w-\\]+\.[a-z]{2,4})\.patch$/;

function getFilepath(dir, raw) {
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
}

module.exports = {
  isName(arg) {
    return arg.indexOf('@') === 0 && arg.split('/').length === 2;
  },

  isPatch(filename) {
    return rePatch.test(filename.split('\\').pop());
  },

  getFilepath,
};
