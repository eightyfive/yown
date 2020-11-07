const request = require('request-promise-native');
const Log = require('./logger');

const API_URL = 'https://api.github.com';
const GIST_URL = 'https://gist.github.com';

function getGist(id) {
  return request
    .get({
      url: `${API_URL}/gists/${id}`,
      headers: { 'User-Agent': 'yown' },
      json: true,
    })
    .catch((err) => Log.die(`Gist '${id}' not found`, err));
}

function getGistArchive({ id, history, owner }) {
  return request
    .get({
      url: `${GIST_URL}/${owner.login}/${id}/archive/${history[0].version}.zip`,
      encoding: null,
    })
    .catch((err) => Log.die(`Error downloading gist '${id}' archive`, err));
}

module.exports = {
  getGistArchives(ids) {
    const archives = ids.map((id) =>
      getGist(id).then((gist) => getGistArchive(gist)),
    );

    return Promise.all(archives);
  },
};
