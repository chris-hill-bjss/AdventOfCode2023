import { match } from "ts-pattern";
import { tryGet, write } from "../cache/cache.js";
import config from "../config.json" assert { type: "json" };

export const getInput = async (day: number): Promise<string> => {
  const cacheResponse = tryGet(day);

  return await match(cacheResponse)
    .with({ type: "hit" }, (hit) => hit.data)
    .otherwise(async () => fetchInput(day));
};

const fetchInput = async (day: number): Promise<string> => {
  const response = await fetch(
    `https://adventofcode.com/2023/day/${day}/input`,
    {
      headers: {
        Cookie: `session=${config.Session};`,
      },
    }
  );

  const input = await response.text();

  return write(day, input);
};
