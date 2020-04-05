#!/usr/bin/env node
const { program } = require("commander");

const info = require("./package.json");
const commands = require("./commands");

program.version(info.version);

program
  .command("install")
  .option("-d, --dry-run", "Dry run (nothing copied)")
  .option("-f, --force", "Force copy when file exists (overwrite)")
  .action(commands.install);

program
  .command("add <id>")
  .option("-d, --dry-run", "Dry run (nothing copied)")
  .option("-f, --force", "Force copy when file exists (overwrite)")
  .action(commands.add);

if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit(1);
}

program.parse(process.argv);
