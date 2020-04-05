const request = require("request-promise-native");

const API_URL = "https://api.github.com";
const GIST_URL = "https://gist.github.com";

module.exports = {
  getGists(ids) {
    const archives = ids.map((id) =>
      request
        .get({
          url: `${API_URL}/gists/${id}`,
          headers: { "User-Agent": "yown" },
          json: true,
        })
        .then(({ id, history, owner }) =>
          request.get({
            url: `${GIST_URL}/${owner.login}/${id}/archive/${history[0].version}.zip`,
            encoding: null,
          })
        )
    );

    return Promise.all(archives);
  },
};
