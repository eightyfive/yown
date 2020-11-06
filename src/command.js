#!/usr/bin/env node
const Api = require('./api');
const importGists = require('./import');

module.exports = async function command(ids, options) {
  return Promise.all(
    ids.map((id) => {
      if (id.indexOf('@') === 0) {
        return Api.find(id).then((yowns) => yowns.map((yown) => yown.gist_id));
      }

      return Promise.resolve(id);
    }),
  )
    .then((gistIds) => gistIds.flat())
    .then((gistIds) => {
      console.log(gistIds);

      return importGists(gistIds, options);
    });
};
