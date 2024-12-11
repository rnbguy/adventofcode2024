export function parse(data: string): number[] {
  return data.trim().split(" ").map(Number);
}

export function solve1(data: number[]): number {
  return data.length;
}

export function solve2(data: number[]): number {
  return data.length;
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
