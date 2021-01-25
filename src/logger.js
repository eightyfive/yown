require('colors');

const { log, error: logError } = console;

const logs = [];

let patched = false;
let copied = false;
let ignored = false;

module.exports = {
  gist(id, message) {
    log(id.white + ': ' + message.grey);
  },

  patch(filepath) {
    patched = true;

    logs.push('P '.yellow + filepath.grey);
  },

  copy(filepath) {
    copied = true;

    logs.push('C '.green + filepath.grey);
  },

  ignore(filepath) {
    ignored = true;

    logs.push('I '.red + filepath.grey);
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
    if (patched) {
      log('P '.yellow + '= Patched');
    }
    if (ignored) {
      log('I '.red + '= Ignored (not clean, commit changes)');
    }
  },
};
