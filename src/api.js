const request = require('request-promise-native');

const API_URL = 'https://api.yown.val';

module.exports = {
  find(id) {
    return request.get({
      url: `${API_URL}/${id.substring(1)}`,
      json: true,
      rejectUnauthorized: false,
    });
  },
};
