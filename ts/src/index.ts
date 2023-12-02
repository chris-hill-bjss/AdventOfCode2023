import { match } from "ts-pattern";

import { DayOne } from "./day/01.js";
import { DayTwo } from "./day/02.js";

const solveDay: number = parseInt(
  process.argv.find((arg) => arg.startsWith("--day"))?.split("=")[1] ??
    new Date().getDate().toString()
);

await match(solveDay)
  .with(1, async () => await DayOne())
  .with(2, async () => await DayTwo())
  .otherwise((day) => console.log(`No solution for day ${day}`));
