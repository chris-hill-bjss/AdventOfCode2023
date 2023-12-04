import { getInput } from "../lib/http.js";
import { isNotEmpty } from "../lib/string.js";

const testInput = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;

export const DayFour = async () => {
  const input = await getInput(4);

  console.log(SolvePartOne(input));
  console.log(SolvePartTwo(input));
};

const numbersToDigits = (input: string[]): number[] =>
  input.filter(isNotEmpty).map((s) => parseInt(s.trim()));

const SolvePartOne = (input: string): number =>
  input
    .split("\n")
    .filter(isNotEmpty)
    .map((line) => {
      const card = line.split(":")[1].split("|");

      const winningNumbers = numbersToDigits(card[0].split(" "));
      const revealedNumbers = numbersToDigits(card[1].split(" "));

      const matches = revealedNumbers.filter((n) => winningNumbers.includes(n));

      return matches.length > 0 ? Math.pow(2, matches.length - 1) : 0;
    })
    .reduce((total, n) => total + n);

const SolvePartTwo = (input: string): number => {
  const cards = input
    .split("\n")
    .filter(isNotEmpty)
    .flatMap((line) => {
      const card = line.split(":");
      const id = parseInt(card[0].match(/\d+/g)![0]);

      const numbers = card[1].split("|");

      const winningNumbers = numbersToDigits(numbers[0].split(" "));
      const revealedNumbers = numbersToDigits(numbers[1].split(" "));

      const matches = revealedNumbers.filter((n) => winningNumbers.includes(n));

      return {
        id: id,
        cards: Array.from(Array(matches.length), () => 0).map(
          (_, index) => id + index + 1
        ),
      };
    })
    .reduce((map, card) => {
      map.set(card.id, card.cards);
      return map;
    }, new Map<number, number[]>());

  const sumCards = (cardIds: number[]): number => {
    const total = cardIds
      .map((id) => {
        const childCardIds = cards.get(id)!;

        return sumCards(childCardIds);
      })
      .reduce((t, n) => t + n, 0);

    return cardIds.length + total;
  };

  const childCardCount = Array.from(cards.keys())
    .map((k) => sumCards(cards.get(k)!))
    .reduce((t, n) => t + n);

  return childCardCount + cards.size;
};
