#!/usr/bin/env node

const colors = require("colors");
const commander = require("commander");
const fs = require("fs-extra");
const zip = require("jszip");
const path = require("path");
const request = require("request-promise-native");
const info = require("./package.json");

const commands = {
	async add(handle, cmd) {
		const url = `https://github.com/${handle}/archive/${cmd.tag ||
			cmd.branch}.zip`;

		// DOWNLOAD
		console.log(`\nDownloading...`.blue);
		console.log(url);

		let body;

		try {
			body = await request.get({ url, encoding: null });
		} catch (err) {
			console.error(`\nError downloading file`.red);
			process.exit(1);
		}

		console.log(`\nUnzipping...`.blue);
		const archive = await zip.loadAsync(body);

		const writing = archive.file(/src/).map(async file => {
			const filepath = file.name.split("/src/").pop();
			const dest = `${cmd.dest}/${filepath}`;

			const exists = await fs.pathExists(dest);

			if (exists) {
				console.log(`Skip ${dest}`.grey);
				return Promise.resolve();
			}

			console.log("Copy ".green + dest.white);

			if (!cmd.force) {
				return Promise.resolve();
			}

			const buff = await file.async("nodebuffer");

			return fs.outputFile(dest, buff);
		});

		await Promise.all(writing);

		if (!cmd.force) {
			console.log("\nDRY RUN".green);
			console.log("Use --force option to import files");
		}
	}
};

commander
	.version(info.version)
	.command("add <handle>")
	.option("-d, --dest [folder]", "Specify destination folder", "src")
	.option("-b, --branch [name]", "Specify git branch to download", "master")
	.option("-t, --tag", "Specify git tag to download")
	.option("-f, --force", "No dry run")
	.action(commands.add);

if (!process.argv.slice(2).length) {
	commander.outputHelp();
	process.exit(1);
}

commander.parse(process.argv);
