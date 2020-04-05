#!/usr/bin/env node
const { prompt } = require("enquirer");

const File = require("../file");
const Github = require("../github");
const Log = require("../logger");
const Utils = require("../utils");
const Zip = require("../zip");

module.exports = async function add(id, cmd) {
  // Get gist
  Log.info("Fetching Gist archive...");

  let archive;

  try {
    [archive] = await Github.getGists([id]);
  } catch (err) {
    Log.die("Error", err);
  }

  // Unzip
  Log.info("Unzipping archive...");

  const files = await Zip.unzip(archive);

  // Config
  const config = await Utils.getConfig(files);

  // Import files
  for (let filepath in files) {
    // Filter
    if (filepath === "yown.json") {
      continue;
    }

    // Build full filepath (with `dir`)
    const fullpath = Utils.getFullpath(filepath, config.dir);

    // File already exists ?
    const exists = await File.exists(fullpath);

    if (cmd.dryRun) {
      if (exists) {
        Log.skip(fullpath);
      } else {
        Log.copy(fullpath);
      }

      continue;
    }

    // Overwrite file ?
    let overwrite = !exists || cmd.force;

    if (!overwrite) {
      const { confirmed } = await prompt({
        type: "confirm",
        name: "confirmed",
        message: `overwrite ${fullpath.grey}?`,
      });

      overwrite = confirmed;
    }

    if (!overwrite) {
      Log.skip(fullpath);
      continue;
    }

    // Copy file
    await File.copy(files[filepath], fullpath);

    if (exists) {
      Log.force(fullpath);
    } else {
      Log.copy(fullpath);
    }
  }

  // Log results
  Log.session(cmd.dryRun);
};
