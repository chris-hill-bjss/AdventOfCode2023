<Query Kind="Program">
  <Namespace>System.Threading.Tasks</Namespace>
</Query>

#load "input.linq"

const string partOneTestInput = @"1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet";

const string partTwoTestInput = @"two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen";

async Task Main()
{
	var input = await GetInput(1);
	SolvePartTwo(input);
}

void SolvePartOne(string input) => 
	input
		.Split("\n", StringSplitOptions.RemoveEmptyEntries)
		.SelectMany(s => Regex.Matches(s, @"(?<first>\d)(.*(?<last>\d)(?!\d)){0,1}"))
		.Sum(m =>{
			var first = m.Groups["first"].Value;
			var last = m.Groups["last"].Success ? m.Groups["last"].Value : first;

			return Convert.ToInt32($"{first}{last}");
		})
		.Dump();

readonly Dictionary<string, char> numberWords = new() {
	{ "one", '1' },
	{ "two", '2' },
	{ "three", '3' },
	{ "four", '4' },
	{ "five", '5' },
	{ "six", '6' },
	{ "seven", '7' },
	{ "eight", '8' },
	{ "nine", '9' },
};

void SolvePartTwo(string input) =>
	input
		.Split("\n", StringSplitOptions.RemoveEmptyEntries)
		.Select(s =>
		{
			var parsed = string.Empty;

			for (int i = 0; i < s.Length; i++)
			{
				var c = s[i];
				if (Char.IsDigit(c))
				{
					parsed += c;
					continue;
				}

				var numbers =
					numberWords
						.Keys
						.Where(k => k.StartsWith(c) && (i + k.Length) <= s.Length && k == s[i..(i + k.Length)]);

				if (!numbers.Any()) continue;

				foreach (var number in numbers)
				{
					parsed += numberWords[number];
				}
			}
			return parsed;
		})
		.Sum(s => Convert.ToInt32($"{s[0]}{s[^1]}"))
		.Dump();

