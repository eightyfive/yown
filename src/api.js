const request = require('request-promise-native');
const Log = require('./logger');

const API_URL = 'https://api.yown.val';

module.exports = {
  find(id) {
    return request
      .get({
        url: `${API_URL}/${id}`,
        json: true,
        rejectUnauthorized: false,
      })
      .catch((err) => Log.die(`Boilerplate '${id}' not found`, err));
  },
};
