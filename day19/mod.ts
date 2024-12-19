class Towels {
  patterns: string[];
  targets: string[];

  constructor(patterns: string[], targets: string[]) {
    this.patterns = patterns;
    this.targets = targets;
  }

  countDiffWays(target: string, diffWays: Map<string, number>): number {
    if (diffWays.has(target)) return diffWays.get(target)!;
    const ans = this.patterns.map((pattern) => {
      if (!target.startsWith(pattern)) return 0;
      const nextSlice = target.slice(pattern.length, target.length);
      let count = 0;
      if (nextSlice.length === 0) count = 1;
      else count = this.countDiffWays(nextSlice, diffWays);
      diffWays.set(target, count);
      return count;
    }).reduce((a, b) => a + b, 0);
    diffWays.set(target, ans);
    return ans;
  }
}

export function parse(data: string): Towels {
  const [patternData, targetData] = data.trim().split("\n\n");
  const patterns = patternData.trim().split(", ");
  const targets = targetData.trim().split("\n");
  return new Towels(patterns, targets);
}

export function solve1(data: Towels): number {
  const diffWays = new Map<string, number>();

  return data.targets.filter((target) =>
    data.countDiffWays(target, diffWays) > 0
  )
    .length;
}

export function solve2(data: Towels): number {
  return data.patterns.length * data.targets.length;
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
