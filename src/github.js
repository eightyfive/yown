const base64 = require('base-64');
const request = require('request-promise-native');
const Log = require('./logger');

const API_URL = 'https://api.github.com';

module.exports = {
  getGist(id) {
    return request
      .get({
        url: `${API_URL}/gists/${id}`,
        headers: {
          'User-Agent': 'yown',
          Authorization: `Basic ${base64.encode(
            'eightyfive:abb0b657b43e7fdf4a6acc2dc6a9f13bb0675e59',
          )}`,
        },
        json: true,
      })
      .catch((err) => Log.die(`Gist '${id}' not found`, err));
  },
};
