const PATTERN = /p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/;

type Vec = [number, number];

export function parse(data: string): [Vec, Vec][] {
  return data.trim().split("\n").map((game) => {
    const [_m, x, y, vx, vy] = game.match(PATTERN)!;
    return [[Number(x), Number(y)], [Number(vx), Number(vy)]];
  });
}

export function solve1(data: [Vec, Vec][]): number {
  return data.length;
}

export function solve2(data: [Vec, Vec][]): number {
  return data.length;
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
