import { getInput } from "../lib/http.js";
import { isNotEmpty } from "../lib/string.js";

const partOneTestInput = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

type Position = {
  y: number;
  x: number;
  length: number;
};

export const DayThree = async () => {
  const input = await getInput(3);

  const partOneAnswer = SolvePartOne(input);
  const partTwoAnswer = SolvePartTwo(input);

  console.log(`${partOneAnswer}:${partTwoAnswer}`);
};

const SolvePartOne = (input: string): number => {
  const numbersAndSymbols = input
    .split("\n")
    .filter(isNotEmpty)
    .flatMap((line, y) =>
      Array.from(line.matchAll(/(?<number>\d+)|(?<symbol>[^\.])/g)).map(
        (match) => {
          const value = match.groups!.number ?? match.groups!.symbol;
          const numericValue = parseInt(value);
          const isSymbol = Number.isNaN(numericValue);

          return {
            isSymbol,
            value: !isSymbol ? numericValue : value,
            position: {
              y,
              x: match.index as number,
              length: value.length,
            },
          };
        }
      )
    );

  const numbers = numbersAndSymbols.filter((ns) => !ns.isSymbol);
  const symbolPositions = numbersAndSymbols
    .filter((ns) => ns.isSymbol)
    .map((s) => s.position);

  return numbers
    .filter((n) => anyAdjacent(n.position, symbolPositions))
    .map((p) => p.value as number)
    .reduce((total, n) => total + n);
};

const anyAdjacent = (position: Position, candidates: Position[]): boolean => {
  const adjacentPositions = candidates.filter(
    (c) =>
      (c.y === position.y ||
        c.y + 1 === position.y ||
        c.y - 1 === position.y) &&
      c.x >= position.x - 1 &&
      c.x <= position.x + position.length
  );

  return adjacentPositions.length > 0;
};

const SolvePartTwo = (input: string): number => {
  const numbersAndSymbols = input
    .split("\n")
    .filter(isNotEmpty)
    .flatMap((line, y) =>
      Array.from(line.matchAll(/(?<number>\d+)|(?<symbol>[\*])/g)).map(
        (match) => {
          const value = match.groups!.number ?? match.groups!.symbol;
          const numericValue = parseInt(value);
          const isSymbol = Number.isNaN(numericValue);

          return {
            isSymbol,
            value: !isSymbol ? numericValue : value,
            position: {
              y,
              x: match.index as number,
              length: value.length,
            },
          };
        }
      )
    );

  const symbols = numbersAndSymbols.filter((ns) => ns.isSymbol);
  const numbers = numbersAndSymbols.filter((ns) => !ns.isSymbol);

  return symbols
    .map((s) => {
      return {
        s,
        partNumbers: numbers
          .filter((n) => isAdjacent(s.position, n.position))
          .map((n) => n.value as number),
      };
    })
    .filter((g) => g.partNumbers.length == 2)
    .flatMap((g) => g.partNumbers.reduce((total, n) => total * n))
    .reduce((total, n) => total + n);
};

const isAdjacent = (symbol: Position, number: Position) => {
  return (
    (symbol.y === number.y ||
      symbol.y + 1 === number.y ||
      symbol.y - 1 === number.y) &&
    symbol.x >= number.x - 1 &&
    symbol.x <= number.x + number.length
  );
};
