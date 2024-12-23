import { BinaryHeap } from "jsr:@std/data-structures";

type Keypad = string[][];

const PIN_PAD: Keypad = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  ["", "0", "A"],
];

const DIRECTIONAL_PAD: Keypad = [
  ["", "^", "A"],
  ["<", "v", ">"],
];

function bfs(keypad: Keypad, paths: Map<string, [number, Set<string>]>) {
  for (let i = 0; i < keypad.length; i++) {
    for (let j = 0; j < keypad[i].length; j++) {
      if (keypad[i][j] === "") {
        continue;
      }
      const key = `${keypad[i][j]},${keypad[i][j]}`;
      paths.set(key, [0, new Set([""])]);
    }
  }

  const directions = [
    [0, 1, ">"],
    [0, -1, "<"],
    [1, 0, "v"],
    [-1, 0, "^"],
  ] as [number, number, string][];

  const heap = new BinaryHeap<[string, string, string]>(
    ([, , a], [, , b]) => a.length - b.length,
  );

  const neighbors = new Map<string, string>();

  for (let i = 0; i < keypad.length; i++) {
    for (let j = 0; j < keypad[i].length; j++) {
      if (keypad[i][j] === "") {
        continue;
      }
      for (const [di, dj, dir] of directions) {
        const ni = i + di;
        const nj = j + dj;
        if (
          ni >= 0 &&
          ni < keypad.length &&
          nj >= 0 &&
          nj < keypad[ni].length &&
          keypad[ni][nj] !== ""
        ) {
          const key = `${keypad[i][j]},${keypad[ni][nj]}`;
          neighbors.set(key, dir);
          heap.push([keypad[i][j], keypad[ni][nj], dir]);
        }
      }
    }
  }

  while (!heap.isEmpty()) {
    const [from, to, dir] = heap.pop()!;
    const key = `${from},${to}`;

    if (paths.has(key)) {
      const [storedSize, storedPaths] = paths.get(key)!;
      if (dir.length > storedSize) {
        continue;
      }

      if (dir.length == storedSize) {
        if (storedPaths.has(dir)) {
          continue;
        }

        storedPaths.add(dir);
      }

      if (dir.length < storedSize) {
        storedPaths.clear();
        storedPaths.add(dir);
        paths.set(key, [dir.length, storedPaths]);
      }
    } else {
      paths.set(key, [dir.length, new Set([dir])]);
    }

    for (const [nkey, ndir] of neighbors) {
      const [nfrom, nto] = nkey.split(",") as [string, string];
      if (nto === from) {
        heap.push([nfrom, to, ndir + dir]);
      }

      if (to === nfrom) {
        heap.push([from, nto, dir + ndir]);
      }
    }

    for (const [nkey, [nsize, ndirs]] of paths) {
      if (nsize == 0) continue;
      const [nfrom, nto] = nkey.split(",") as [string, string];
      if (nto === from) {
        for (const ndir of ndirs.values()) {
          heap.push([nfrom, to, ndir + dir]);
        }
      }

      if (to === nfrom) {
        for (const ndir of ndirs.values()) {
          heap.push([from, nto, dir + ndir]);
        }
      }
    }
  }
}

function calculateShortestSequence(
  code: string,
  numRobots: number,
  pinPadPaths: Map<string, [number, Set<string>]>,
  directionalPadPaths: Map<string, [number, Set<string>]>,
): number {
  const memo: Map<string, number> = new Map();

  function solve(
    robotIndex: number,
    currentKey: string,
    remainingCode: string,
  ): number {
    const memoKey = `${robotIndex},${currentKey},${remainingCode}`;
    if (memo.has(memoKey)) {
      return memo.get(memoKey)!;
    }

    if (remainingCode.length === 0) {
      return 0;
    }

    if (robotIndex === 0) {
      return remainingCode.length;
    }

    let totalCost = 0;

    let loopCurrentKey = currentKey;

    for (const nextKey of remainingCode) {
      let minCost = Infinity;

      if (robotIndex === numRobots) {
        const pathsKey = `${loopCurrentKey},${nextKey}`;
        const [, paths] = pinPadPaths.get(pathsKey)!;
        for (const path of paths) {
          const cost = solve(
            robotIndex - 1,
            "A",
            path + "A",
          );
          minCost = Math.min(minCost, cost);
        }
      } else {
        const pathsKey = `${loopCurrentKey},${nextKey}`;
        const [, paths] = directionalPadPaths.get(pathsKey)!;
        for (const path of paths) {
          const cost = solve(
            robotIndex - 1,
            "A",
            path + "A",
          );
          minCost = Math.min(minCost, cost);
        }
      }

      totalCost += minCost;
      loopCurrentKey = nextKey;
    }

    memo.set(memoKey, totalCost);
    return totalCost;
  }

  return solve(numRobots, "A", code);
}

export function parse(data: string): string[] {
  return data.trim().split("\n").map((line) => line.trim());
}

export function solve(data: string[], numRobots: number): number {
  const pinPadPaths = new Map<string, [number, Set<string>]>();
  const dirPadPaths = new Map<string, [number, Set<string>]>();

  bfs(PIN_PAD, pinPadPaths);
  bfs(DIRECTIONAL_PAD, dirPadPaths);

  return data.map((line) => {
    const shortestLength = calculateShortestSequence(
      line,
      numRobots,
      pinPadPaths,
      dirPadPaths,
    );

    const num = Number(
      line.split("").map((c) => Number(c)).filter((n) => !Number.isNaN(n)).join(
        "",
      ),
    );

    return shortestLength * num;
  }).reduce((acc, val) => acc + val, 0);
}

export function solve1(data: string[]): number {
  return solve(data, 3);
}

export function solve2(data: string[]): number {
  return solve(data, 26);
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
