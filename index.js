#!/usr/bin/env node

const colors = require("colors");
const commander = require("commander");
const fs = require("fs-extra");
const zip = require("jszip");
const path = require("path");
const request = require("request-promise-native");
const info = require("./package.json");
const { prompt } = require("enquirer");

// const url = `${apiUrl}/${id}/archive/${
//       cmd.tag || cmd.branch
//     }.zip`;

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
        headers: { "User-Agent": "eightyfive" },
        json: true
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

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filepath = getFilepath(file);

      // Filter
      if (file.dir || filepath === "yown.json") {
        continue;
      }

      // Exists ?
      const exists = await fs.pathExists(filepath);

      if (!cmd.force) {
        if (exists) {
          logs.push(filepath.grey + " skip".white);
        } else {
          logs.push(filepath.grey + " copy".green);
        }

        continue;
      }

      // Overwrite ?
      let overwrite = !exists || cmd.overwrite;

      if (!overwrite) {
        const { confirmed } = await prompt({
          type: "confirm",
          name: "confirmed",
          message: `Replace ${filepath.grey} ?`
        });

        overwrite = confirmed;
      }

      if (!overwrite) {
        logs.push(filepath.grey + " skipped".white);

        continue;
      }

      // Copy
      const buff = await file.async("nodebuffer");

      await fs.outputFile(filepath, buff);

      if (exists) {
        logs.push(filepath.grey + " replaced".red);
      } else {
        logs.push(filepath.grey + " copied".green);
      }
    }

    if (cmd.force) {
      log(" ");
    } else {
      log("\nDRY RUN".green);
      log("Use --force to copy files\n");
    }

    logs.forEach(txt => log(txt));
  }
};

commander
  .version(info.version)
  .command("add <id>")
  .option("--force", "No dry run")
  .option("--overwrite", "Force file overwrite")
  .action(commands.add);

if (!process.argv.slice(2).length) {
  commander.outputHelp();
  process.exit(1);
}

commander.parse(process.argv);
