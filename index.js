#!/usr/bin/env node
require('dotenv').config();

const { program } = require('commander');
const command = require('./src/command');
const info = require('./package.json');

program
  .version(info.version)
  .option('--dir <path>', 'Output dir')
  .parse(process.argv);

if (!program.args.length) {
  program.outputHelp();
  process.exit(1);
}

command(program.args, program);
