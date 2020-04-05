#!/usr/bin/env node

const File = require("../file");
const Log = require("../logger");

const add = require("./add");

module.exports = async function install(cmd) {
  const exists = await File.exists("./yown.json");

  if (!exists) {
    Log.die("No yown.json file");
  }

  const ids = await File.json("./yown.json");

  for (let id of ids) {
    await add(id, cmd);
  }
};
