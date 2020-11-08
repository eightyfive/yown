const request = require('request-promise-native');
const Computer = require('node-machine-id');
const Log = require('./logger');

const API_URL = 'https://api.yown.val';
const computerId = Computer.machineIdSync();

const options = {
  json: true,
  rejectUnauthorized: false,
  headers: {
    'X-UDID': computerId,
  },
};

module.exports = {
  find(id) {
    return request
      .get({
        ...options,
        url: `${API_URL}/${id}`,
      })
      .catch((err) => Log.die(`Boilerplate '${id}' not found`, err));
  },
};
