const trim = require('lodash.trim');

const reAppend = /^>>([\w-]+\.[a-z]{2,4})$/;
const rePrepend = /^<<([\w-]+\.[a-z]{2,4})$/;

function getFilePath(yPath, dir) {
  const filePath = yPath.split('\\');

  const fileName = getFileName(filePath.pop());

  filePath.push(fileName);

  const dirName = trim(dir, './');

  if (dirName) {
    filePath.unshift(dirName);
  }

  return `./${filePath.join('/')}`;
}

function getFileName(fileName) {
  let res;

  // Is append ?
  res = reAppend.exec(fileName);

  if (res) {
    return res[1];
  }

  // Is prepend ?
  res = rePrepend.exec(fileName);

  if (res) {
    return res[1];
  }

  return fileName;
}

module.exports = {
  isName(arg) {
    return arg.indexOf('@') === 0 && arg.split('/').length === 2;
  },

  isAppend(fileName) {
    return reAppend.test(fileName.split('\\').pop());
  },

  isPrepend(fileName) {
    return rePrepend.test(fileName.split('\\').pop());
  },

  getFilePath,
};
