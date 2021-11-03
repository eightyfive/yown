require('colors');

const { log, error: logError } = console;

const logs = [];

let modified = false;
let copied = false;
let ignored = false;
let deleted = false;

module.exports = {
  gist(id, message) {
    log(id.white + ': ' + message.grey);
  },

  modified(filePath) {
    modified = true;

    logs.push('M '.yellow + filePath.grey);
  },

  copy(filePath) {
    copied = true;

    logs.push('C '.green + filePath.grey);
  },

  ignore(filePath) {
    ignored = true;

    logs.push('I '.orange + filePath.grey);
  },

  delete(filePath) {
    deleted = true;

    logs.push('D '.red + filePath.grey);
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

  help() {
    logs.forEach((txt) => log(txt));

    log(' ');
    if (copied) {
      log('C '.green + '= Copied');
    }
    if (modified) {
      log('M '.yellow + '= Modified');
    }
    if (ignored) {
      log('I '.orange + '= Ignored (not clean, commit changes)');
    }
    if (deleted) {
      log('D '.red + '= Deleted');
    }
  },
};
