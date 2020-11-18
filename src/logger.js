require('colors');

const { log, error: logError } = console;

module.exports = {
  gist(id, message) {
    log(id.white + ': ' + message.grey);
  },

  patch(filepath) {
    log('P '.yellow + filepath.grey);
  },

  copy(filepath) {
    log('C '.green + filepath.grey);
  },

  ignore(filepath) {
    log('I '.red + filepath.grey);
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
    log(' ');
    log('C '.green + '= Copied');
    log('P '.yellow + '= Patched');
    log('I '.red + '= Ignored (not clean, commit changes)');
  },
};
