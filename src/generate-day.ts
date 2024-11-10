#!/usr/bin/env node
import clc from "cli-color";
import {exit} from "process";
import * as fs from 'fs';
import path from "node:path";
import {constants} from "node:fs";
import axios from 'axios';
import {getConfig, printSplashScreen} from "./util";

printSplashScreen();

if (process.argv.length === 2) {
  console.info("Usage: npm run generate {day}");
  exit(0);
}

const day = process.argv[2];
const dayNumber = day.substring(3);
console.log(clc.blue(`Generating ${day}...\n`));

const startPath = process.cwd();
const inputFolderPath = path.join(startPath, "inputs");
const inputDayFolderPath = path.join(inputFolderPath, day);
const puzzleFolderPath = path.join(startPath, "src", "puzzles");
const puzzleFilePath = path.join(puzzleFolderPath, day + ".ts");
const templateFile = path.join(startPath, "src", "day.template.ts");

let partAInput = 'Paste the part A input here';
let partASampleInput = 'Paste the part A sample input here';
let partBInput = 'Paste the part B input here';
let partBSampleInput = 'Paste the part B sample input here';

// input files
createDirectoryIfItDoesntExist(inputFolderPath);
createDirectoryIfItDoesntExist(inputDayFolderPath);
createFileWithContentIfItDoesntExist(path.join(inputDayFolderPath, "a.txt"), partAInput);
createFileWithContentIfItDoesntExist(path.join(inputDayFolderPath, "a.sample.txt"), partASampleInput);
createFileWithContentIfItDoesntExist(path.join(inputDayFolderPath, "b.txt"), partBInput);
createFileWithContentIfItDoesntExist(path.join(inputDayFolderPath, "b.sample.txt"), partBSampleInput);

// code files
const templateContent = fs.readFileSync(templateFile).toString();
createDirectoryIfItDoesntExist(puzzleFolderPath);
createFileWithContentIfItDoesntExist(puzzleFilePath, templateContent);

// download input
downloadPuzzleInput();

function createDirectoryIfItDoesntExist(dir: string) {
  try {
    fs.accessSync(dir, constants.F_OK | constants.W_OK);
  } catch {
    console.log(`  Creating directory: ${dir}`);
    fs.mkdirSync(dir);
  }
}

function createFileWithContentIfItDoesntExist(name: string, content: string) {
  try {
    fs.accessSync(name);
    console.log(`  File ${name} exists, will not overwrite.`);
  } catch {
    console.log(`  Creating file ${name}`);
    fs.writeFileSync(name, content);
  }
}

function downloadPuzzleInput() {
  const {authCookie, year} = getConfig();

  axios.get(
    `https://adventofcode.com/${year}/day/${dayNumber}/input`,
    {headers: {'Cookie': `session=${authCookie}`}})
    .then(res => {
      if (res.data[res.data.length - 1] === '\n') // Remove trailing newline
        res.data = res.data.substring(0, res.data.length - 1);
      fs.writeFileSync(path.join(inputDayFolderPath, "a.txt"), res.data);
      fs.writeFileSync(path.join(inputDayFolderPath, "b.txt"), res.data);
      console.log('  Puzzle input downloaded.\n');
    })
    .catch(() => {
      console.log(clc.yellow('  Failed to download input. Copy puzzle input manually.\n'));
    })
    .finally(() => {
      console.log(clc.blue('Generation finished.'));
    });
}