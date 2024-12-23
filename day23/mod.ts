export function parse(data: string): [string, string][] {
  return data.trim().split("\n").map((line) =>
    line.split("-") as [string, string]
  );
}

export function solve1(data: [string, string][]): number {
  return data.length;
}

export function solve2(data: [string, string][]): number {
  return data.length;
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
