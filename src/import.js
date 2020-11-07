#!/usr/bin/env node
const path = require('path');
const Git = require('nodegit');

const File = require('./file');
const Github = require('./github');
const Log = require('./logger');
const Utils = require('./utils');
const Zip = require('./zip');

module.exports = async function download(ids, options) {
  const archives = await Github.getGistArchives(ids);

  // Unzip
  const folders = await Zip.unzip(archives);

  for (let files of folders) {
    await copyFiles(files, options);
  }

  // Log results
  Log.session(options.dryRun);
};

async function copyFiles(files, options) {
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

  // Copy files
  for (let filename in files) {
    // Ignore
    if (filename === 'yown.json') {
      continue;
    }

    const filepath = Utils.getFilepath(options.dir || config.dir, filename);

    // File patch ?
    const isPatch = Utils.isPatch(filename);
    const isStaged = staged[filepath];

    if (isPatch) {
      Log.patch(filepath);
    } else if (isStaged) {
      Log.skip(filepath);
    } else {
      Log.copy(filepath);
    }

    // Skip if file is not clean
    if (isStaged || options.dryRun) {
      continue;
    }

    const file = files[filename];

    if (isPatch) {
      await File.patch(file, filepath);
    } else {
      await File.copy(file, filepath);
    }
  }
}
