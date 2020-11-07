const colors = require('colors');

const session = {
  patched: [],
  copied: [],
  skipped: [],
  forced: [],
};

const log = console.log;
const logError = console.error;

module.exports = {
  patch(filepath) {
    session.patched.push('P '.yellow + filepath.grey);
  },

  copy(filepath) {
    session.copied.push('C '.green + filepath.grey);
  },

  force(filepath) {
    session.forced.push('F '.red + filepath.grey);
  },

  skip(filepath) {
    session.skipped.push('S '.white + filepath.grey);
  },

  info(message) {
    log(`${message}`.blue);
  },

  die(message, err) {
    logError(`\n${message}`.red);

    if (err) {
      log(err);
    }

    process.exit(1);
  },

  session(dryRun) {
    log(' ');

    Object.values(session)
      .flat()
      .forEach((txt) => log(txt));

    log(' ');

    if (session.patched.length) {
      log('P '.yellow + (dryRun ? '= Patch' : '= Patched'));
    }

    if (session.copied.length) {
      log('C '.green + (dryRun ? '= Copy' : '= Copied'));
    }

    if (session.forced.length) {
      log('F '.red + '= Copied (Forced)');
    }

    if (session.skipped.length) {
      log('S '.white + (dryRun ? '= Skip' : '= Skipped'));
    }

    if (dryRun) {
      log('\nDRY RUN'.green);
    }
  },
};
