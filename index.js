#!/usr/bin/env node

const colors = require("colors");
const commander = require("commander");
const fs = require("fs-extra");
const zip = require("jszip");
const trim = require("lodash.trim");
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

    // Unzip
    log(`\nUnzipping gist archive...\n`.blue);

    const archive = await zip.loadAsync(data);

    // Map filepaths to files
    const files = {};

    Object.values(archive.files).forEach((file) => {
      files[getFilepath(file)] = file;
    });

    // Config
    const config = { dir: "" };
    const configFile = files["yown.json"];

    if (configFile) {
      Object.assign(config, JSON.parse(await configFile.async("string")));
    }

    if (config.dir) {
      log("Config detected...".blue);
      log("`config.dir`".grey, config.dir.white);
    }

    // Import files
    const logs = { copy: [], skip: [], force: [] };

    for (let filepath in files) {
      const file = files[filepath];

      // Filter
      if (file.dir || filepath === "yown.json") {
        continue;
      }

      // Build full filepath (with `dir`)
      let fullpath = [trim(filepath, "/")];

      if (config.dir) {
        fullpath.unshift(trim(config.dir, "/"));
      }

      fullpath = `./${fullpath.join("/")}`;

      // File already exists ?
      const exists = await fs.pathExists(fullpath);

      if (cmd.dryRun) {
        if (exists) {
          logs.skip.push("S ".white + fullpath.grey);
        } else {
          logs.copy.push("C ".green + fullpath.grey);
        }

        continue;
      }

      // Overwrite file ?
      let overwrite = !exists || cmd.force;

      if (!overwrite) {
        const { confirmed } = await prompt({
          type: "confirm",
          name: "confirmed",
          message: `overwrite ${fullpath.grey}?`,
        });

        overwrite = confirmed;
      }

      if (!overwrite) {
        logs.skip.push("S ".white + fullpath.grey);

        continue;
      }

      // Copy file
      const buff = await file.async("nodebuffer");

      await fs.outputFile(fullpath, buff);

      if (exists) {
        logs.force.push("F ".red + fullpath.grey);
      } else {
        logs.copy.push("C ".green + fullpath.grey);
      }
    }

    // Log results
    log(" ");

    Object.values(logs)
      .flat()
      .forEach((txt) => log(txt));

    log(" ");

    if (logs.copy.length) {
      log("C ".green + (cmd.dryRun ? "= Copy" : "= Copied"));
    }

    if (logs.force.length) {
      log("F ".red + "= Copied (Forced)");
    }

    if (logs.skip.length) {
      log("S ".white + (cmd.dryRun ? "= Skip" : "= Skipped"));
    }

    if (cmd.dryRun) {
      log("\nDRY RUN".green);
      log("Use --force to copy files");
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
