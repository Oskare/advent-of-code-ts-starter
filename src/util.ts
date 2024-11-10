import dotenv from "dotenv";
import clc from "cli-color";
import figlet from "figlet";

export type Config = {
  authCookie: string,
  year: string
}

export const getConfig = (): Config => {
  dotenv.config();

  return {
    authCookie: process.env.AUTH_COOKIE,
    year: process.env.YEAR
  }
}

export const printSplashScreen = (): void => {
  console.log(clc.red(figlet.textSync("Advent of Code " + getConfig().year)));
}