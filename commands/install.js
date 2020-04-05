#!/usr/bin/env node

const File = require("../file");
const Log = require("../logger");

module.exports = async function install(id, cmd) {
  const exists = await File.exists("./yown.json");

  if (!exists) {
    Log.die("No yown.json file");
  }

  const ids = await File.json("./yown.json");

  console.log(ids);
};
