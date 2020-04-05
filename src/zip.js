const zip = require('jszip');

function buildFilesMap(folder) {
  const files = {};

  Object.values(folder.files).forEach((file) => {
    if (!file.dir) {
      files[getFilename(file)] = file;
    }
  });

  return files;
}

function getFilename(file) {
  return file.name.split('/').pop();
}

module.exports = {
  unzip(archives) {
    const folders = archives.map((archive) =>
      zip.loadAsync(archive).then((folder) => buildFilesMap(folder)),
    );

    return Promise.all(folders);
  },
};
