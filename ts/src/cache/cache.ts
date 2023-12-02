import fs from "fs";
import config from "../config.json" assert { type: "json" };

export type CacheHit = {
  type: "hit";
  data: string;
};
export type CacheMiss = { type: "miss" };
export type CacheResponse = CacheHit | CacheMiss;

export const tryGet = (day: number): CacheResponse => {
  const inputFilePath = `${config.CacheDir}/${day}.txt`;

  return fs.existsSync(inputFilePath)
    ? cacheHit(inputFilePath)
    : ({} as CacheMiss);
};

export const write = (day: number, input: string): string => {
  const inputFilePath = `${config.CacheDir}/${day}.txt`;

  if (!fs.existsSync(config.CacheDir)) {
    fs.mkdirSync(config.CacheDir);
  }

  fs.writeFileSync(inputFilePath, input);

  return input;
};

const cacheHit = (filePath: string): CacheHit => {
  const cacheHit = {
    type: "hit",
    data: fs.readFileSync(filePath, "utf-8"),
  } as CacheHit;

  return cacheHit;
};
