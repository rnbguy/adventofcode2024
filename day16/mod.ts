import { BinaryHeap } from "jsr:@std/data-structures";

type Elem = "S" | "E" | "." | "#";
const DIRS = ["N", "E", "S", "W"];

export function parse(data: string): Elem[][] {
  return data.trim().split("\n").map((line) => line.trim().split("") as Elem[]);
}

export function solve1(data: Elem[][]): number {
  const height = data.length;
  const width = data[0].length;

  let start: [number, number] = [0, 0];
  let end: [number, number] = [0, 0];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[y][x] === "S") {
        start = [x, y];
      }
      if (data[y][x] === "E") {
        end = [x, y];
      }
    }
  }

  const scoreMap = new Map<string, Map<string, number>>();

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[y][x] === "#") continue;
      const key = `${x},${y}`;
      const value = new Map<string, number>();
      for (const dir of DIRS) {
        value.set(dir, Infinity);
      }

      if (data[y][x] === "S") {
        value.set("E", 0);
      }
      scoreMap.set(key, value);
    }
  }

  const heap = new BinaryHeap<[number, [number, number], string]>((a, b) =>
    a[0] - b[0]
  );

  heap.push([0, start, "E"]);

  while (heap.length > 0) {
    const [score, [x, y], dir] = heap.pop()!;
    const key = `${x},${y}`;
    if (score > scoreMap.get(key)!.get(dir)!) continue;

    if (x === end[0] && y === end[1]) {
      return score;
    }

    const nextPos: [number, [number, number], string][] = [];

    const dirIndex = DIRS.indexOf(dir);

    nextPos.push([score + 1000, [x, y], DIRS[(dirIndex + 1) % DIRS.length]]);
    nextPos.push([score + 2000, [x, y], DIRS[(dirIndex + 2) % DIRS.length]]);
    nextPos.push([score + 1000, [x, y], DIRS[(dirIndex + 3) % DIRS.length]]);

    let stepDir = [0, 0];

    switch (dir) {
      case "N":
        stepDir = [0, -1];
        break;
      case "E":
        stepDir = [1, 0];
        break;
      case "S":
        stepDir = [0, 1];
        break;
      case "W":
        stepDir = [-1, 0];
        break;
    }

    nextPos.push([score + 1, [x + stepDir[0], y + stepDir[1]], dir]);

    for (const [nScore, [nX, nY], nDir] of nextPos) {
      if (data[nY][nX] === "#") continue;
      const nKey = `${nX},${nY}`;
      if (nScore < scoreMap.get(nKey)!.get(nDir)!) {
        scoreMap.get(nKey)!.set(nDir, nScore);
        heap.push([nScore, [nX, nY], nDir]);
      }
    }
  }

  return scoreMap.get(`${end[0]},${end[1]}`)!.values().reduce(
    (a, b) => Math.min(a, b),
    Infinity,
  );
}

export function solve2(data: Elem[][]): number {
  return data.length * data[0].length;
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
