const { from, merge, of } = require('rxjs');
const { catchError, filter, map, mergeMap, tap } = require('rxjs/operators');
const path = require('path');
const git = require('isomorphic-git');
const fs = require('fs-extra');

const Api = require('./api');
const File = require('./file');
const Github = require('./github');
const Log = require('./logger');
const Utils = require('./utils');

const YOWNFILE = 'yown.json';

module.exports = async function command(args, options) {
  const staged = await getStagedFilenames();

  // Normalize Gist IDs
  const ids$ = of(...args).pipe(mergeMap((arg) => ofName(arg)));

  // Gists
  const gists$ = ids$
    .pipe(
      tap((id) => Log.gist(id, 'Fetching Gist')),
      mergeMap(fetchGist),
    )
    .pipe(
      // Merge bundled Gist IDs
      mergeMap((gist) => mergeBundled(gist)),
      catchError((err) => console.log(err)),
    )
    .pipe(
      // Map file paths
      map((gist) => mapFilepaths(gist, gist._config, options)),
      map((gist) => mapFilepaths(gist, gist._config, options)),
      catchError((err) => console.error(err)),
    );

  const results$ = gists$
    .pipe(mergeMap((gist) => ofFiles(gist)))
    .pipe(filter((file) => file.filename !== YOWNFILE))
    .pipe(mergeMap((file) => ofTask(file, staged.includes(file._filepath))));

  results$.subscribe(
    (value) => {},
    (err) => {},
    () => {
      Log.help();
      console.log('\nDone !');
      process.exit(1);
    },
  );
};

function mapConfig(files) {
  const yownFile = files[YOWNFILE];

  if (yownFile) {
    return JSON.parse(yownFile.content);
  }

  return {};
}

function fetchGist(id) {
  return from(Github.getGist(id)).pipe(
    // Map config
    map((gist) => {
      gist._config = mapConfig(gist.files);

      return gist;
    }),
  );
}

async function getStagedFilenames() {
  const workingDir = process.cwd();

  // Git repo ?
  const gitPath = path.resolve(workingDir, './.git');
  const gitExists = await File.exists(gitPath);

  if (!gitExists) {
    Log.warn('YOLO mode', '(No git repository detected)');

    return [];
  }

  const files = await git.statusMatrix({ dir: workingDir, fs });

  // https://isomorphic-git.org/docs/en/statusMatrix
  return files
    .filter((file) => file[2] !== file[3])
    .map((file) => `./${file[0]}`);
}

function mapFilepaths(gist, config, options) {
  gist._files = Object.values(gist.files).map((file) => {
    file._filepath = Utils.getFilepath(
      options.dir || config.dir,
      file.filename,
    );

    return file;
  });

  return gist;
}

function mergeBundled(gist) {
  const { bundled = [] } = gist._config;

  let bundled$;

  if (bundled.length) {
    bundled$ = of(...bundled).pipe(
      tap((id) => Log.gist(id, 'Fetching Gist')),
      mergeMap(fetchGist),
    );
  } else {
    bundled$ = from([]);
  }

  return merge(of(gist), bundled$);
}

function ofName(arg) {
  const isName = Utils.isName(arg);

  if (isName) {
    return from(Api.find(arg)).pipe(tap((id) => Log.gist(id, arg)));
  }

  return of(arg);
}

function ofFiles(gist) {
  return from(Object.values(gist._files));
}

function ofTask(file, ignore) {
  const filepath = file._filepath;
  const isPatch = Utils.isPatch(file.filename);

  // Ignore file
  if (ignore) {
    return of(filepath).pipe(tap(() => Log.ignore(filepath)));
  }

  // Patch file
  if (isPatch) {
    return from(File.patch(file.content, filepath)).pipe(
      tap(() => Log.patch(filepath)),
    );
  }

  // Copy file
  return from(File.copy(file.content, filepath)).pipe(
    tap(() => Log.copy(filepath)),
  );
}
