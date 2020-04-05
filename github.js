const request = require("request-promise-native");

const API_URL = "https://api.github.com";
const GIST_URL = "https://gist.github.com";

module.exports = {
  getGist(id) {
    const url = `${API_URL}/gists/${id}`;

    return request.get({
      url,
      headers: { "User-Agent": "yown" },
      json: true,
    });
  },

  getGistArchive({ id, history, owner }) {
    const url = `${GIST_URL}/${owner.login}/${id}/archive/${history[0].version}.zip`;

    return request.get({ url, encoding: null });
  },
};

