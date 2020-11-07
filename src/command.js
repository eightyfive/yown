#!/usr/bin/env node
const Api = require('./api');
const importGists = require('./import');

module.exports = async function command(ids, options) {
  return Promise.all(
    ids.map((id) => {
      const isName = id.indexOf('@') === 0 && id.split('/').length === 2;

      if (isName) {
        return Api.find(id.substring(1));
      }

      return Promise.resolve(id);
    }),
  )
    .then((gistIds) => gistIds.flat())
    .then((gistIds) => importGists(gistIds, options));
};
