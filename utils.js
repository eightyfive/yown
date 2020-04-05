const trim = require("lodash.trim");

module.exports = {
  getConfig(files) {
    const config = { dir: "" };
    const configFile = files["yown.json"];

    if (configFile) {
      return configFile
        .async("string")
        .then((str) => Object.assign(config, JSON.parse(str)));
    }

    return Promise.resolve(config);
  },

  getFullpath(filepath, dir) {
    let fullpath = [trim(filepath, "/")];

    if (dir) {
      fullpath.unshift(trim(dir, "/"));
    }

    return `./${fullpath.join("/")}`;
  },
};
