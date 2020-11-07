#!/usr/bin/env node
const path = require('path');
const Git = require('nodegit');

const File = require('./file');
const Github = require('./github');
const Log = require('./logger');
const Utils = require('./utils');
const Zip = require('./zip');

module.exports = async function importGists(ids, options) {
  const archives = await Github.getGistArchives(ids);

  // Unzip
  const folders = await Zip.unzip(archives);

  for (let files of folders) {
    await importFiles(files, options);
  }

  // Log results
  Log.session(options.dryRun);
};

async function importFiles(files, options) {
  // Git repo ?
  const repoPath = path.resolve(process.cwd(), './.git');
  const isRepo = await File.exists(repoPath);
  const staged = {};

  if (isRepo) {
    const status = await Git.Repository.open(repoPath).then((repo) =>
      repo.getStatus(),
    );

    status.forEach((file) => {
      staged[`./${file.path()}`] = file.status();
    });
  } else {
    Log.warn('YOLO mode', '(No git repository detected)');
  }

  // Config
  const config = await Utils.getConfig(files);

  // Import files
  for (let filename in files) {
    // Filter
    if (filename === 'yown.json') {
      continue;
    }

    const filepath = Utils.getFilepath(options.dir || config.dir, filename);

    // File patch ?
    const isPatch = Utils.isPatch(filename);

    // File already exists ?
    const exists = await File.exists(filepath);

    if (options.dryRun) {
      if (isPatch) {
        Log.patch(filepath);
      } else if (exists) {
        Log.skip(filepath);
      } else {
        Log.copy(filepath);
      }

      continue;
    }

    // Skip if file is not clean
    if (staged[filepath]) {
      Log.skip(filepath);
      continue;
    }

    const file = files[filename];

    if (isPatch) {
      // Patch file
      await File.patch(file, filepath);
    } else {
      // Copy file
      await File.copy(file, filepath);
    }

    if (isPatch) {
      Log.patch(filepath);
    } else {
      Log.copy(filepath);
    }
  }
}
