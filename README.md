# advent-of-code-ts-starter
This is a template for solving Advent of Code puzzles with TypeScript.

## Setup
### Install
Download the repository as a .zip and extract to a local folder, then run
```
npm install
```

### Configure
Copy .env.example to .env and set **YEAR** and **AUTH_COOKIE** values to fully support the **generate** and **submit** commands.

## Generate files for a day
```
npm run generate day1
```
If .env is set with a valid **YEAR** and **AUTH_COOKIE** value, generation will automatically populate the puzzle input contents.

Generates the following files:

| File | Description |
| ----------- | ----------- |
| inputs/day1/a.sample.txt | Sample input for the first part |
| inputs/day1/a.txt | Puzzle input for the first part |
| inputs/day1/b.sample.txt | Sample input for the second part |
| inputs/day1/b.txt | Puzzle input for the second part |
| src/puzzles/day1.ts | Puzzle solution implementation |

## Run with puzzle input
```
npm run start day1a
```

## Run with sample input
```
npm run start day1a sample
```

## Run and submit answer
```
npm run start day1a submit
```