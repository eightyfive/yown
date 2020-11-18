const base64 = require('base-64');
const request = require('request-promise-native');
const Log = require('./logger');

const API_URL = 'https://api.github.com';

const headers = {
  'User-Agent': 'yown',
};

const username = process.env.YOWN_GITHUB_USERNAME;

if (username) {
  const accessToken = process.env.YOWN_GITHUB_TOKEN;

  headers.Authorization = `Basic ${base64.encode(
    `${username}:${accessToken}`,
  )}`;
}

module.exports = {
  getGist(id) {
    return request
      .get({
        url: `${API_URL}/gists/${id}`,
        headers,
        json: true,
      })
      .catch((err) => Log.die(`Gist '${id}' not found`, err));
  },
};
