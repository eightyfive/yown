const zip = require("jszip");

function buildFilesMap(archive) {
  const files = {};

  Object.values(archive.files).forEach((file) => {
    if (!file.dir) {
      files[getFilepath(file)] = file;
    }
  });

  return files;
}

function getFilepath(file) {
  const filename = file.name.split("/").pop();

  return filename.replace(/\\/g, "/");
}

module.exports = {
  unzip(data) {
    return zip.loadAsync(data).then((archive) => buildFilesMap(archive));
  },
};
