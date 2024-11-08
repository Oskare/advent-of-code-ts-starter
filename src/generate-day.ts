#!/usr/bin/env node
import figlet from "figlet";
import clc from "cli-color";
import {exit} from "process";
import * as fs from 'fs';
import path from "node:path";
import {constants} from "node:fs";

console.log(clc.red(figlet.textSync("Advent of Code 2024")));

if (process.argv.length === 2) {
  console.info("Usage: npm run generate {day}");
  exit(0);
}

const day = process.argv[2];
console.log(clc.blue(`Generating ${day}...\n`));

const startPath = process.cwd();
const inputFolderPath = path.join(startPath, "inputs");
const inputDayFolderPath = path.join(inputFolderPath, day);
const puzzleFolderPath = path.join(startPath, "src", "puzzles");
const puzzleFilePath = path.join(puzzleFolderPath, day + ".ts");
const templateFile = path.join(startPath, "src", "day.template.ts");

// input
createDirectoryIfItDoesntExist(inputFolderPath);
createDirectoryIfItDoesntExist(inputDayFolderPath);
createFileWithContentIfItDoesntExist(path.join(inputDayFolderPath, "a.txt"), 'Paste the part A input here');
createFileWithContentIfItDoesntExist(path.join(inputDayFolderPath, "a.sample.txt"), 'Paste the part A sample input here');
createFileWithContentIfItDoesntExist(path.join(inputDayFolderPath, "b.txt"), 'Paste the part B input here');
createFileWithContentIfItDoesntExist(path.join(inputDayFolderPath, "b.sample.txt"), 'Paste the part B sample input here');

// code
const templateContent = fs.readFileSync(templateFile);
createDirectoryIfItDoesntExist(puzzleFolderPath);
createFileWithContentIfItDoesntExist(puzzleFilePath, templateContent);

function createDirectoryIfItDoesntExist(dir) {
  try {
    fs.accessSync(dir, constants.F_OK | constants.W_OK);
  } catch {
    console.log(`  Creating directory: ${dir}`);
    fs.mkdirSync(dir);
  }
}

function createFileWithContentIfItDoesntExist(name, content) {
  try {
    fs.accessSync(name);
    console.log(`  File ${name} exists, will not overwrite.`);
  } catch {
    console.log(`  Creating file ${name}`);
    fs.writeFileSync(name, content);
  }
}