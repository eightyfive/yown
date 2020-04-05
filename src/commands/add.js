#!/usr/bin/env node
const { prompt } = require("enquirer");

const Log = require("../logger");
const importGists = require("../import");

module.exports = async function add(id, cmd) {
  // Get gist
  Log.info("Fetching Gist archive...");

  await importGists([id], cmd);
};
