import { getInput } from "../http/input.js";

const partOneTestInput = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;

const partTwoTestInput = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;

const wordToDigit = new Map<string, string>([
  ["one", "1"],
  ["two", "2"],
  ["three", "3"],
  ["four", "4"],
  ["five", "5"],
  ["six", "6"],
  ["seven", "7"],
  ["eight", "8"],
  ["nine", "9"],
]);

const forwardRegex: string = Array.from(wordToDigit.keys()).join("|");
const reverseRegex: string = [...forwardRegex].reverse().join("");

const isEmpty = (s: string): boolean => s.trim() !== "";
const isDigit = (c: string): boolean => c >= "0" && c <= "9";

export const DayOne = async () => {
  const input = await getInput(1);

  const partOneAnswer = SolvePartOne(input);
  const partTwoAnswer = SolvePartTwo(input);

  console.log(`${partOneAnswer}:${partTwoAnswer}`);
};

const SolvePartOne = (input: string): number =>
  input
    .split("\n")
    .filter(isEmpty)
    .map((line) => {
      const firstDigit = [...line].find(isDigit);
      const lastDigit = [...line].reverse().find(isDigit);

      return parseInt(`${firstDigit}${lastDigit}`);
    })
    .reduce((total, n) => total + n);

const SolvePartTwo = (input: string): number =>
  input
    .split("\n")
    .filter(isEmpty)
    .map((line) => {
      const forwardParse = line.replace(
        new RegExp(`(${forwardRegex})`),
        (match) => wordToDigit.get(match)!
      );

      const firstDigit = [...forwardParse].find(isDigit);

      const reverseParse = [...line]
        .reverse()
        .join("")
        .replace(
          new RegExp(`(${reverseRegex})`),
          (match) => wordToDigit.get([...match].reverse().join(""))!
        );

      const lastDigit = [...reverseParse].find(isDigit);

      return parseInt(`${firstDigit}${lastDigit}`);
    })
    .reduce((total, n) => total + n);
