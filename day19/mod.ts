class Towels {
  patterns: string[];
  targets: string[];

  constructor(patterns: string[], targets: string[]) {
    this.patterns = patterns;
    this.targets = targets;
  }
}

export function parse(data: string): Towels {
  const [patternData, targetData] = data.trim().split("\n\n");
  const patterns = patternData.trim().split(", ");
  const targets = targetData.trim().split("\n");
  return new Towels(patterns, targets);
}

export function solve1(data: Towels): number {
  const isPossible = new Map<string, boolean>();

  function utilRec(target: string): boolean {
    if (isPossible.has(target)) return isPossible.get(target)!;
    for (const pattern of data.patterns) {
      if (!target.startsWith(pattern)) continue;
      const nextSlice = target.slice(pattern.length, target.length);
      let isNextPossible = false;
      if (nextSlice.length === 0) isNextPossible = true;
      else isNextPossible = utilRec(nextSlice);
      isPossible.set(target, isNextPossible);
      if (isNextPossible) return true;
    }
    return false;
  }

  return data.targets.filter((target) => utilRec(target)).length;
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
