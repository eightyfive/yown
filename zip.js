const zip = require("jszip");

function buildFilesMap(folder) {
  const files = {};

  Object.values(folder.files).forEach((file) => {
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
  unzip(archives) {
    const folders = archives.map((archive) =>
      zip.loadAsync(archive).then((folder) => buildFilesMap(folder))
    );

    return Promise.all(folders);
  },
};
