const colors = require("colors");

const session = {
  copied: [],
  skipped: [],
  forced: [],
};

const log = console.log;
const logError = console.error;

module.exports = {
  copy(filepath) {
    session.copied.push("C ".green + filepath.grey);
  },

  force(filepath) {
    session.forced.push("F ".red + filepath.grey);
  },

  skip(filepath) {
    session.skipped.push("S ".white + filepath.grey);
  },

  info(message) {
    log(`${message}`.blue);
  },

  error(message, err) {
    logError(`\n${message}`.red);
    log(err);
  },

  session(dryRun) {
    log(" ");

    Object.values(session)
      .flat()
      .forEach((txt) => log(txt));

    log(" ");

    if (session.copied.length) {
      log("C ".green + (dryRun ? "= Copy" : "= Copied"));
    }

    if (session.forced.length) {
      log("F ".red + "= Copied (Forced)");
    }

    if (session.skipped.length) {
      log("S ".white + (dryRun ? "= Skip" : "= Skipped"));
    }

    log("\nDRY RUN".green);
  },
};
