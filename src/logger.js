require('colors');

const session = {
  patched: [],
  copied: [],
  skipped: [],
};

const o = Object;
const { log, error: logError } = console;

module.exports = {
  patch(filepath) {
    session.patched.push('P '.yellow + filepath.grey);
  },

  copy(filepath) {
    session.copied.push('C '.green + filepath.grey);
  },

  skip(filepath) {
    session.skipped.push('S '.red + filepath.grey);
  },

  info(message) {
    log(message.blue);
  },

  warn(title, message) {
    log(title.inverse + ' ' + message.blue);
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

    o.values(session)
      .flat()
      .forEach((txt) => log(txt));

    log(' ');

    if (session.patched.length) {
      log('P '.yellow + (dryRun ? '= Patch' : '= Patched'));
    }

    if (session.copied.length) {
      log('C '.green + (dryRun ? '= Copy' : '= Copied'));
    }

    if (session.skipped.length) {
      log(
        'S '.red +
          (dryRun ? '= Skip' : '= Skipped (not clean, commit changes)'),
      );
    }

    if (dryRun) {
      log('\nDRY RUN'.green);
    }
  },
};
