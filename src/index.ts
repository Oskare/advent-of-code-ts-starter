#! /usr/bin/env node

import figlet from "figlet";
import {Command} from "commander";
import clc from "cli-color";
import * as fs from 'fs';
import path from "node:path";

const program = new Command();
const days = [...Array(24).keys()].flatMap(i => [(i + 1) + "a", (i + 1) + "b"]);

console.log(clc.red(figlet.textSync("Advent of Code 2024")));

days.forEach(day => {
  const puzzleName = "day" + day;
  const puzzleDay =  puzzleName.substring(0, puzzleName.length - 1);

  program.command(puzzleName)
    .action(() => {
      import("./puzzles/" + puzzleDay)
        .then(p => {
          console.log(clc.blue("Solving " + puzzleName + "...\n"));

          const input = fs.readFileSync(path.join("inputs", puzzleDay, "a.txt"), 'utf-8');

          const start = performance.now();
          const result = puzzleName.endsWith("b") ? p.partB(input) : p.partA(input);
          const elapsed = performance.now() - start;

          console.log(clc.blue('Result is ') + clc.bold(clc.green(result)));
          console.log(clc.blue("Puzzle solved in ") + clc.bold(clc.green(elapsed.toFixed(2) + " ms!")));
        })
        .catch((err) => {
          if (err.code === "MODULE_NOT_FOUND")
            console.log(clc.cyan("Puzzle not solved yet!"))
          else
            console.log(clc.red(err));
        });
    });
});

program.parse(process.argv);