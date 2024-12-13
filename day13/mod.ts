const PATTERN =
  /Button A: X\+(\d+), Y\+(\d+)\nButton B: X\+(\d+), Y\+(\d+)\nPrize: X=(\d+), Y=(\d+)/;

export function parse(data: string): Game[] {
  return data.trim().split("\n\n").map((game) => {
    const [_m, ax, ay, bx, by, px, py] = game.match(PATTERN)!;
    return new Game([Number(ax), Number(ay)], [Number(bx), Number(by)], [
      Number(px),
      Number(py),
    ]);
  });
}

class Game {
  a: [number, number];
  b: [number, number];
  p: [number, number];
  constructor(a: [number, number], b: [number, number], p: [number, number]) {
    this.a = a;
    this.b = b;
    this.p = p;
  }
}

export function solve1(data: Game[]): number {
  return data.length;
}

export function solve2(data: Game[]): number {
  return data.length;
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
