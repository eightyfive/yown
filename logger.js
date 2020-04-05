const colors = require("colors");

const session = {
  copy: [],
  skip: [],
  force: [],
};

const log = console.log;

module.exports = {
  copy(filepath) {
    session.skip.push("C ".green + filepath.grey);
  },

  force(filepath) {
    session.force.push("F ".red + filepath.grey);
  },

  skip(filepath) {
    session.skip.push("S ".white + filepath.grey);
  },

  info(message) {
    log(`${message}`.blue);
  },

  error(message, err) {
    console.error(`\n${message}`.red);
    log(err);
  },

  session(dryRun) {
    log(" ");

    Object.values(session)
      .flat()
      .forEach((txt) => log(txt));

    log(" ");

    if (session.copy.length) {
      log("C ".green + (dryRun ? "= Copy" : "= Copied"));
    }

    if (session.force.length) {
      log("F ".red + "= Copied (Forced)");
    }

    if (session.skip.length) {
      log("S ".white + (dryRun ? "= Skip" : "= Skipped"));
    }

    log("\nDRY RUN".green);
  },
};
