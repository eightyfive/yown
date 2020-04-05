const colors = require("colors");

const session = {
  appended: [],
  copied: [],
  skipped: [],
  forced: [],
};

const log = console.log;
const logError = console.error;

module.exports = {
  append(filepath) {
    session.appended.push("A ".yellow + filepath.grey);
  },
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

  die(message, err) {
    logError(`\n${message}`.red);

    if (err) {
      log(err);
    }

    process.exit(1);
  },

  session(dryRun) {
    log(" ");

    Object.values(session)
      .flat()
      .forEach((txt) => log(txt));

    log(" ");

    if (session.appended.length) {
      log("A ".yellow + (dryRun ? "= Append" : "= Appended"));
    }

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
