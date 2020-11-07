#!/usr/bin/env node
const { program } = require('commander');
const command = require('./src/command');
const info = require('./package.json');

program.version(info.version);

program
  .option('-d, --dry-run', 'Dry run (nothing copied)', false)
  .option('--dir <path>', 'Output dir');

program.parse(process.argv);

if (!program.args.length) {
  program.outputHelp();
  process.exit(1);
}

command(program.args, program);
