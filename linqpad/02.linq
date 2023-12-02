<Query Kind="Program">
  <Namespace>System.Threading.Tasks</Namespace>
</Query>

#load "input.linq"

const string partOneTestInput = @"Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green";

readonly Dictionary<string, int> partOneRules = new()
{
	{"red", 12},
	{"green", 13},
	{"blue", 14},
};	

async Task Main()
{
	var input = await GetInput(2);
	SolvePartOne(input, partOneRules);
}

void SolvePartOne(string input, Dictionary<string, int> rules) =>
	input
		.Split("\n", StringSplitOptions.RemoveEmptyEntries)
		.Select(s => {
			var id = int.Parse(s[s.IndexOf(' ')..s.IndexOf(':')]);
			
			var hands = 
				s
					.Substring(s.IndexOf(":")+1)
					.Split(";")
					.Select(
						hand =>
							new Hand(
							hand
								.Split(",")
								.Select(cubeSet =>
								{
									var fields = cubeSet.Trim().Split(" ");
									var count = int.Parse(fields[0].Trim());
									var colour = fields[1].Trim();
									var isValid = count <= rules[colour];
									
									return new CubeSet(count, colour, isValid);
								})
								.ToArray())
					)
					.ToArray();

			return new Game(id, hands);
		})
		//.Where(g => g.Hands.All(h => h.CubeSets.All(cs => cs.IsValid)))
		.Sum(g => g.Power)
		.Dump();


record CubeSet(int Count, string Colour, bool IsValid);

record Hand(CubeSet[] CubeSets);

record Game(int Id, Hand[] Hands)
{
	public CubeSet[] MinCubes => Hands.SelectMany(h => h.CubeSets).GroupBy(cs => cs.Colour).Select(grp => grp.MaxBy(cs => cs.Count)).ToArray();

	public int Power => MinCubes.Select(cs => cs.Count).Aggregate(1, (x, y) => x*y);
};