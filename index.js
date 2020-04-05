#!/usr/bin/env node
const commander = require("commander");

const info = require("./package.json");
const commands = require("./commands");

commander
  .version(info.version)
  .command("install")
  .option("-d, --dry-run", "Dry run (nothing copied)")
  .option("-f, --force", "Force copy when file exists (overwrite)")
  .action(commands.install)
  .command("add <id>")
  .option("-d, --dry-run", "Dry run (nothing copied)")
  .option("-f, --force", "Force copy when file exists (overwrite)")
  .action(commands.add);

if (!process.argv.slice(2).length) {
  commander.outputHelp();
  process.exit(1);
}

commander.parse(process.argv);
