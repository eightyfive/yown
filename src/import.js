#!/usr/bin/env node
const { prompt } = require('enquirer');

const File = require('./file');
const Github = require('./github');
const Log = require('./logger');
const Utils = require('./utils');
const Zip = require('./zip');

module.exports = async function importGists(ids, options) {
  const archives = await Github.getGistArchives(ids).catch((err) =>
    Log.die('Error downloading gist archive', err),
  );

  // Unzip
  const folders = await Zip.unzip(archives);

  for (let files of folders) {
    await importFiles(files, options);
  }

  // Log results
  Log.session(options.dryRun);
};

async function importFiles(files, options) {
  // Config
  const config = await Utils.getConfig(files);

  // Import files
  for (let filename in files) {
    // Filter
    if (filename === 'yown.json') {
      continue;
    }

    const filepath = Utils.getFilepath(config.dir, filename);
    const append = Utils.isAppend(filename);

    // File already exists ?
    const exists = await File.exists(filepath);

    if (options.dryRun) {
      if (append) {
        Log.append(filepath);
      } else if (exists) {
        Log.skip(filepath);
      } else {
        Log.copy(filepath);
      }

      continue;
    }

    // Overwrite file ?
    let overwrite = !exists || append || options.force;

    if (!overwrite) {
      const { confirmed } = await prompt({
        type: 'confirm',
        name: 'confirmed',
        message: `overwrite ${filepath.grey}?`,
      });

      overwrite = confirmed;
    }

    if (!overwrite) {
      Log.skip(filepath);
      continue;
    }

    const file = files[filename];

    if (append) {
      // Append to file
      await File.append(file, filepath);
    } else {
      // Copy file
      await File.copy(file, filepath);
    }

    if (append) {
      Log.append(filepath);
    } else if (exists) {
      Log.force(filepath);
    } else {
      Log.copy(filepath);
    }
  }
}
