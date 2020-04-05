#!/usr/bin/env node
const { prompt } = require("enquirer");

const File = require("./file");
const Github = require("./github");
const Log = require("./logger");
const Utils = require("./utils");
const Zip = require("./zip");

module.exports = async function copy(ids, cmd) {
  const archives = await Github.getGists(ids).catch((err) =>
    Log.die("Error downloading archive", err)
  );

  // Unzip
  const folders = await Zip.unzip(archives);

  for (let files of folders) {
    await copyFiles(files, cmd);
  }

  // Log results
  Log.session(cmd.dryRun);
};

async function copyFiles(files, cmd) {
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
}
