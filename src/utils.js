const trim = require('lodash.trim');
const Log = require('./logger');

const o = Object;
const rePatch = /^([\w-\\]+\.[a-z]{2,4})\.patch$/;

function getFilePath(dir, raw) {
  let filePath = raw.split('\\');
  let fileName = filePath.pop();

  let isPatch = rePatch.exec(fileName);

  if (isPatch) {
    fileName = isPatch[1];
  }

  filePath.push(fileName);

  const dirName = trim(dir, './');

  if (dirName) {
    filePath.unshift(dirName);
  }

  return `./${filePath.join('/')}`;
}

module.exports = {
  isName(arg) {
    return arg.indexOf('@') === 0 && arg.split('/').length === 2;
  },

  isPatch(fileName) {
    return rePatch.test(fileName.split('\\').pop());
  },

  isAppend(fileName) {
    return rePatch.test(fileName.split('\\').pop());
  },

  isPrepend(fileName) {
    return rePatch.test(fileName.split('\\').pop());
  },

  getFilePath,
};
