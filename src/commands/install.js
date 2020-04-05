#!/usr/bin/env node

const File = require("../file");
const Log = require("../logger");
const importGists = require("../import");

module.exports = async function install(cmd) {
  const exists = await File.exists("./yown.json");

  if (!exists) {
    Log.die("No yown.json file");
  }

  const ids = await File.json("./yown.json");

  Log.info("Fetching Gists archive...");

  await importGists(ids, cmd);
};
