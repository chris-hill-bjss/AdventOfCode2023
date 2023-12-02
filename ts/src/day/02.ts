import { getInput } from "../lib/http.js";
import { isNotEmpty } from "../lib/string.js";

const partOneTestInput = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;

const rules = new Map<string, number>([
  ["red", 12],
  ["green", 13],
  ["blue", 14],
]);

export const DayTwo = async () => {
  const input = await getInput(2);

  const partOneAnswer = SolvePartOne(input, rules);
  const partTwoAnswer = SolvePartTwo(input, rules);

  console.log(`${partOneAnswer}:${partTwoAnswer}`);
};

const SolvePartOne = (input: string, rules: Map<string, number>): number =>
  input
    .split("\n")
    .filter(isNotEmpty)
    .map((s) => {
      const gameId = parseInt(s.match(/\d+/)![0]);
      const hands = s.match(/(\d+\s(?:red|green|blue)(?:,\s)?){1,3}/g);

      const gameHands = hands?.map((m) =>
        m.split(",").map((d) => {
          const set = d.trim().split(" ");
          const count = parseInt(set[0]);
          const colour = set[1];

          return {
            count,
            colour,
            valid: count <= rules.get(colour)!,
          };
        })
      );

      return {
        gameId,
        gameHands,
      };
    })
    .filter((game) =>
      game.gameHands?.every((hand) => hand.every((h) => h.valid))
    )
    .map((game) => game.gameId)
    .reduce((total, gameId) => total + gameId);

const SolvePartTwo = (input: string, rules: Map<string, number>): number =>
  input
    .split("\n")
    .filter(isNotEmpty)
    .map((s) => {
      const gameId = parseInt(s.match(/\d+/)![0]);
      const hands = s.match(/(\d+\s(?:red|green|blue)(?:,\s)?){1,3}/g);

      const gameHands = hands?.map((m) =>
        m.split(",").map((d) => {
          const set = d.trim().split(" ");
          const count = parseInt(set[0]);
          const colour = set[1];

          return {
            count,
            colour,
            valid: count <= rules.get(colour)!,
          };
        })
      );

      const maxRed = Math.max(
        ...gameHands
          ?.map((hand) =>
            hand.filter((set) => set.colour === "red").map((set) => set.count)
          )
          .flat()!
      );

      const maxGreen = Math.max(
        ...gameHands
          ?.map((hand) =>
            hand.filter((set) => set.colour === "green").map((set) => set.count)
          )
          .flat()!
      );

      const maxBlue = Math.max(
        ...gameHands
          ?.map((hand) =>
            hand.filter((set) => set.colour === "blue").map((set) => set.count)
          )
          .flat()!
      );

      return {
        gameId,
        gameHands,
        power: maxRed * maxGreen * maxBlue,
      };
    })
    .map((game) => game.power)
    .reduce((total, power) => total + power);
