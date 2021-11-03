const _uniq = require('lodash.uniq');
const { forkJoin, from, of } = require('rxjs');
const { concatMap, switchMap, tap } = require('rxjs/operators');
const path = require('path');
const git = require('isomorphic-git');
const fs = require('fs-extra');
const inquirer = require('inquirer');

const Api = require('./api');
const File = require('./file');
const Github = require('./github');
const Log = require('./logger');
const Utils = require('./utils');

const YOWNFILE = 'yown.json';
const READMEFILE = 'README.md';

const reHolder = /<(\w+)>/g;
const prompts = {};

module.exports = async function command(args, options) {
  const cwd = process.cwd();

  const [dirtyFiles, useYarn] = await Promise.all([getDirty(cwd), isYarn(cwd)]);

  const configs = [];

  const tasks$ = of(args).pipe(
    // Normalize gist IDs
    switchMap((args) => forkJoin(args.map((arg) => ofGistId(arg)))),

    // Fetch all gists
    switchMap((ids) => forkJoin(ids.map((id) => ofGist(id)))),

    // Stream gists
    switchMap((gists) => from(gists)),

    // Stream gist files
    concatMap((gist) => fromFiles(gist, options, configs)),

    // Prompt replace placeholder in file names
    concatMap((file) => promptPlaceholder(file)),

    // Copy, patch or ignore (task)
    concatMap((file) => ofTask(file, dirtyFiles.includes(file._filepath))),
  );

  tasks$.subscribe(
    (value) => {},
    (err) => {},
    () => {
      Log.help();
      console.log('\nDone !');

      // Log dependencies
      const cmd = useYarn ? 'yarn add' : 'npm install';

      let deps;

      // Dependencies
      deps = configs.reduce(
        (acc, { dependencies = [] }) => acc.concat(dependencies),
        [],
      );

      if (deps.length) {
        Log.info('\nInstall dependencies:');
        console.log(`${cmd} ${_uniq(deps).join(' ')}`);
      }

      // Dev dependencies
      deps = configs.reduce(
        (acc, { devDependencies = [] }) => acc.concat(devDependencies),
        [],
      );

      if (deps.length) {
        Log.info('\nInstall DEV dependencies:');
        console.log(
          `${cmd} ${useYarn ? '--dev' : '--save-dev'} ${_uniq(deps).join(' ')}`,
        );
      }

      process.exit(0);
    },
  );
};

function ofGistId(arg) {
  const isName = Utils.isName(arg);

  if (isName) {
    // Fetch gist ID
    return from(Api.find(arg)).pipe(tap((id) => Log.gist(id, arg)));
  }

  return of(arg);
}

function ofGist(id) {
  Log.gist(id, 'Fetching Gist');

  return from(Github.getGist(id));
}

function fromFiles(gist, options, configs) {
  let config = {};

  const yownFile = gist.files[YOWNFILE];

  if (yownFile) {
    try {
      config = JSON.parse(yownFile.content);
      configs.push(config);
    } catch (err) {
      Log.die('Error parsing yown.json', gist.id);
    }
  }

  const files = Object.values(gist.files)
    .map((file) => {
      file._filepath = Utils.getFilepath(
        options.dir || config.dir,
        file.filename,
      );

      return file;
    })
    .filter(({ filename }) => filename !== YOWNFILE && filename !== READMEFILE);

  return from(files);
}

function promptPlaceholder(file) {
  const [, holder] = reHolder.exec(file._filepath) || [];

  if (!holder) {
    return from(Promise.resolve(file));
  }

  let input;

  if (prompts[holder]) {
    input = Promise.resolve(prompts[holder]);
  } else {
    Log.info('\n' + file._filepath);

    input = inquirer
      .prompt({
        type: 'input',
        name: holder,
        message: `Replace <${holder}> by:`,
      })
      .then((answer) => {
        const value = answer[holder];

        // Cache
        prompts[holder] = value;

        return value;
      });
  }

  // Replace placeholder
  const re = new RegExp(`<${holder}>`, 'g');

  const replaced = input.then((value) => {
    file._filepath = file._filepath.replace(re, value);
    file.content = file.content.replace(re, value);

    return file;
  });

  return from(replaced);
}

function ofTask(file, ignore) {
  const filePath = file._filepath;

  // Ignore file
  if (ignore) {
    return of(filePath).pipe(tap(() => Log.ignore(filePath)));
  }

  // Patch file
  const isPatch = Utils.isPatch(file.filename);

  if (isPatch) {
    return from(File.patch(file.content, filePath)).pipe(
      tap(() => Log.patch(filePath)),
    );
  }

  // Copy file
  return from(File.copy(file.content, filePath)).pipe(
    tap(() => Log.copy(filePath)),
  );
}

async function getDirty(cwd) {
  // Git repo ?
  const gitPath = path.resolve(cwd, './.git');
  const gitExists = await File.exists(gitPath);

  if (!gitExists) {
    Log.die('No git repository detected', cwd);
  }

  const files = await git.statusMatrix({ dir: cwd, fs });

  // https://isomorphic-git.org/docs/en/statusMatrix
  return files
    .filter(([, ...status]) => status.join(',') !== '1,1,1')
    .map(([filename]) => `./${filename}`);
}

async function isYarn(cwd) {
  const yarnPath = path.resolve(cwd, './yarn.lock');

  return File.exists(yarnPath);
}
