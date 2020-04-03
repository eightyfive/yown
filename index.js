#!/usr/bin/env node

const colors = require("colors");
const commander = require("commander");
const fs = require("fs-extra");
const zip = require("jszip");
const path = require("path");
const request = require("request-promise-native");
const info = require("./package.json");
const { prompt } = require("enquirer");

const log = console.log;
const logError = console.error;

function getFilepath(file) {
  const filename = file.name.split("/").pop();

  return filename.replace(/\\/g, "/");
}

const commands = {
  async add(id, cmd) {
    let url;

    // Get gist
    url = `https://api.github.com/gists/${id}`;

    log(`\nFetching gist...`.blue);
    log(url);

    let data;

    try {
      data = await request.get({
        url,
        headers: { "User-Agent": "yown" },
        json: true,
      });
    } catch (err) {
      logError(`\nError fetching gist`.red);
      log(err);
      process.exit(1);
    }

    // Download gist zip
    url = `https://gist.github.com/${data.owner.login}/${id}/archive/${data.history[0].version}.zip`;

    log(`\nDownloading gist archive...`.blue);
    log(url);

    try {
      data = await request.get({ url, encoding: null });
    } catch (err) {
      logError(`\nError downloading gist archive`.red);
      log(err);
      process.exit(1);
    }

    log(`\nUnzipping gist archive...\n`.blue);

    const archive = await zip.loadAsync(data);
    const files = Object.values(archive.files);
    const logs = [];

    let copied = false;
    let skipped = false;
    let forced = false;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filepath = getFilepath(file);

      // Filter
      if (file.dir || filepath === "yown.json") {
        continue;
      }

      // Exists ?
      const exists = await fs.pathExists(filepath);

      if (cmd.dryRun) {
        if (exists) {
          skipped = true;
          logs.push("S ".white + filepath.grey);
        } else {
          copied = true;
          logs.push("C ".green + filepath.grey);
        }

        continue;
      }

      // Overwrite ?
      let overwrite = !exists || cmd.force;

      if (!overwrite) {
        const { confirmed } = await prompt({
          type: "confirm",
          name: "confirmed",
          message: `overwrite ${filepath.grey}?`,
        });

        overwrite = confirmed;
      }

      if (!overwrite) {
        skipped = true;
        logs.push("S ".white + filepath.grey);

        continue;
      }

      // Copy
      const buff = await file.async("nodebuffer");

      await fs.outputFile(filepath, buff);

      if (exists) {
        forced = true;
        logs.push("F ".red + filepath.grey);
      } else {
        copied = true;
        logs.push("C ".green + filepath.grey);
      }
    }

    if (cmd.dryRun) {
      log("DRY RUN".green);
    } else {
      log(" ");
    }

    logs.forEach((txt) => log(txt));

    log(" ");

    if (copied) {
      log("C ".green + (cmd.dryRun ? "= Copy" : "= Copied"));
    }

    if (forced) {
      log("F ".red + "= Copied (Forced)");
    }

    if (skipped) {
      log("S ".white + (cmd.dryRun ? "= Skip" : "= Skipped"));
    }

    if (cmd.dryRun) {
      log("\nUse --force to copy files");
    }
  },
};

commander
  .version(info.version)
  .command("add <id>")
  .option("-d, --dry-run", "Dry run (nothing copied)")
  .option("-f, --force", "Force copy when file exists (overwrite)")
  .action(commands.add);

if (!process.argv.slice(2).length) {
  commander.outputHelp();
  process.exit(1);
}

commander.parse(process.argv);
