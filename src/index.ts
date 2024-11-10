#! /usr/bin/env node
import figlet from "figlet";
import {Command} from "commander";
import clc from "cli-color";
import * as fs from 'fs';
import path from "node:path";
import dotenv from "dotenv";
import axios from "axios";

const program = new Command();
const days = [...Array(24).keys()].flatMap(i => [(i + 1) + "a", (i + 1) + "b"]);

console.log(clc.red(figlet.textSync("Advent of Code")));

days.forEach(day => {
  const puzzleName = "day" + day;
  const puzzleDay = puzzleName.substring(0, puzzleName.length - 1);
  const puzzlePart = puzzleName.endsWith('a') ? 1 : 2;

  program.command(puzzleName)
    .action(() => {
      import("./puzzles/" + puzzleDay)
        .then(p => {
          console.log(clc.blue('Solving ' + puzzleName + '...\n'));

          const input = readInput(puzzleDay, puzzlePart);
          const start = performance.now();
          const result = puzzlePart === 1 ? p.partA(input) : p.partB(input);
          const elapsed = performance.now() - start;

          console.log(clc.blue('Result is ') + clc.bold(clc.green(result)));
          console.log(clc.blue('Puzzle solved in ') + clc.bold(clc.green(elapsed.toFixed(2) + ' ms!')));

          if (process.argv.length == 4 && process.argv[3] === 'submit') {
            submitResults(result, day);
          }
        })
        .catch((err) => {
          if (err.code === "MODULE_NOT_FOUND" || err.code === 'ENOENT')
            console.log(clc.yellow("Solution not implemented yet!"))
          else
            console.log(clc.red(err));
        });
    });
});

program.parse(process.argv);

function readInput(puzzleDay: string, puzzlePart: number): string {
  let fileName = puzzlePart === 1 ? 'a' : 'b';
  fileName += process.argv.length == 4 && process.argv[3] === 'sample' ? '.sample' : '';
  fileName += '.txt';
  return fs.readFileSync(path.join('inputs', puzzleDay, fileName), 'utf-8');
}

function submitResults(answer: string, day: string): void {
  console.log(clc.blue('\nSubmitting results...'))

  dotenv.config();
  const authCookie = process.env.AUTH_COOKIE;
  const year = process.env.YEAR;
  const dayNumber = day.slice(0, -1);
  const level = day.substring(day.length - 1) === 'a' ? '1' : '2';

  axios.post(
    `https://adventofcode.com/${year}/day/${dayNumber}/answer`,
    new URLSearchParams({level, answer}),
    {headers: {'Cookie': `session=${authCookie}`, 'Content-Type': 'application/x-www-form-urlencoded'}})
    .then(res => {
      if (isCorrect(res.data.substring(res.data.indexOf('<article>'), res.data.indexOf('</article>'))))
        console.log(clc.green('You submitted the correct answer!'));
      else
        console.log(clc.red('You submitted an incorrect answer.'));
    })
    .catch(() => {
      console.log(clc.yellow('Failed to submit answer. Please input answer manually.\n'));
    })
}

function isCorrect(responseMessage: string) {
  return responseMessage.includes('That\'s the right answer');
}