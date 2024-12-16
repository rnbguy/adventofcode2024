import { BinaryHeap } from "jsr:@std/data-structures";

type Elem = "S" | "E" | "." | "#";
const DIRS = ["0,-1", "1,0", "0,1", "-1,0"];

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

  heap.push([0, start, "1,0"]);

  while (heap.length > 0) {
    const [score, [x, y], dir] = heap.pop()!;
    const key = `${x},${y}`;
    if (score > scoreMap.get(key)!.get(dir)!) continue;

    if (x === end[0] && y === end[1]) {
      return score;
    }

    const dirIndex = DIRS.indexOf(dir);

    const currentDir = dir.split(",").map(Number);
    const leftDir = DIRS[(dirIndex + 3) % DIRS.length].split(",").map(Number);
    const rightDir = DIRS[(dirIndex + 1) % DIRS.length].split(",").map(Number);

    const nextPos: [number, [number, number], string][] = [
      [score + 1, [x + currentDir[0], y + currentDir[1]], dir],
      [
        score + 1001,
        [x + leftDir[0], y + leftDir[1]],
        DIRS[(dirIndex + 3) % DIRS.length],
      ],
      [
        score + 1001,
        [x + rightDir[0], y + rightDir[1]],
        DIRS[(dirIndex + 1) % DIRS.length],
      ],
    ];

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

// FIXME: too slow on input.txt
export function solve2(data: Elem[][]): number {
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

  const bestSpots = new Map<string, number>();

  for (const dir of DIRS) {
    bestSpots.set(`${end[0]},${end[1]}|${dir}`, 0);
  }

  function isBestSpot(
    [x, y]: [number, number],
    dir: string,
    gas: number,
  ): boolean {
    if (gas < 0) return false;

    const key = `${x},${y}|${dir}`;

    if (bestSpots.has(key)) {
      if (bestSpots.get(key)! === 0) return true;
      if (bestSpots.get(key)! >= gas) return false;
    }

    const dirIndex = DIRS.indexOf(dir);

    const currentDir = dir.split(",").map(Number);
    const leftDir = DIRS[(dirIndex + 3) % DIRS.length].split(",").map(Number);
    const rightDir = DIRS[(dirIndex + 1) % DIRS.length].split(",").map(Number);

    const nextPos: [number, [number, number], string][] = [
      [gas - 1, [x + currentDir[0], y + currentDir[1]], dir],
      [
        gas - 1001,
        [x + leftDir[0], y + leftDir[1]],
        DIRS[(dirIndex + 3) % DIRS.length],
      ],
      [
        gas - 1001,
        [x + rightDir[0], y + rightDir[1]],
        DIRS[(dirIndex + 1) % DIRS.length],
      ],
    ];

    // note: it's .map(f).some((v) => v), not .some(f)
    // because, we want to perform dfs on every neighbor
    const ans = nextPos.filter(([_g, [nX, nY], _d]) => data[nY][nX] !== "#")
      .map(
        ([nGas, [nX, nY], nDir]) => isBestSpot([nX, nY], nDir, nGas),
      ).some((v) => v);

    if (ans) {
      bestSpots.set(key, 0);
    } else {
      bestSpots.set(key, gas);
    }

    return ans;
  }

  const maxGas = solve1(data);
  isBestSpot(start, "1,0", maxGas);

  return new Set(
    bestSpots.entries().filter(([_k, value]) => value === 0).map(([k]) =>
      k.split("|")[0]
    ),
  ).size;
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
