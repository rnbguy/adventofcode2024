import { assert } from "@std/assert/assert";
import { BinaryHeap } from "jsr:@std/data-structures";

class Memory {
  height: number;
  width: number;
  data: Map<string, number>;
  constructor(map: [number, number][]) {
    this.height = 0;
    this.width = 0;
    this.data = new Map();
    map.forEach(([x, y], i) => {
      this.data.set(`${x},${y}`, i + 1);
      this.height = Math.max(this.height, y);
      this.width = Math.max(this.width, x);
    });
    this.width++;
    this.height++;
  }

  grid(time: number): string[][] {
    const grid = Array.from(
      { length: this.height },
      () => Array.from({ length: this.width }, () => "."),
    );
    for (const [key, value] of this.data) {
      if (value <= time) {
        const [x, y] = key.split(",").map(Number);
        grid[y][x] = "#";
      }
    }
    return grid;
  }

  dfsFirstN(
    [x, y]: [number, number],
    visited: Set<string>,
    cache: Map<string, [number, number][]>,
    time: number,
    dTime: number,
  ): [number, number][] {
    assert(0 <= x && x < this.width && 0 <= y && y < this.height);
    const key = `${x},${y}`;

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    if (visited.has(key)) {
      return [];
    }

    if (this.data.has(key) && this.data.get(key)! <= time) {
      return [];
    }

    if (x == this.width - 1 && y == this.height - 1) {
      cache.set(key, [[x, y]]);
      return [[x, y]];
    }

    visited.add(key);

    const ans = [[0, 1], [1, 0], [-1, 0], [0, -1]]
      .map((
        [dx, dy],
      ) => [x + dx, y + dy] as [number, number])
      .filter(([px, py]) =>
        (0 <= px && px < this.width) && (0 <= py && py < this.height)
      ).filter(([px, py]) => !visited.has(`${px},${py}`)).map(([px, py]) =>
        this.dfsFirstN([px, py], visited, cache, time + dTime, dTime)
      ).filter((ar) => ar.length > 0).reduce(
        (acc, ar) => acc.length == 0 || acc.length > ar.length ? ar : acc,
        [],
      );

    if (ans.length > 0) {
      cache.set(key, [[x, y], ...ans]);
    } else {
      cache.set(key, []);
    }

    return cache.get(key)!;
  }

  bfs(time: number): [Map<string, number>, Map<string, [number, number]>] {
    const heap = new BinaryHeap<[number, [number, number]]>((a, b) =>
      a[0] - b[0]
    );

    const parentMap = new Map<string, [number, number]>();
    const scoreMap = new Map<string, number>();

    heap.push([0, [0, 0]]);

    while (heap.length > 0) {
      const [score, [x, y]] = heap.pop()!;
      const key = `${x},${y}`;
      console.log(key, score);

      if (score > (scoreMap.get(key) ?? 0)) continue;

      if (x == this.width - 1 && y == this.height - 1) {
        return [scoreMap, parentMap];
      }

      [[0, 1], [1, 0], [-1, 0], [0, -1]]
        .map((
          [dx, dy],
        ) => [x + dx, y + dy] as [number, number])
        .filter(([px, py]) =>
          (0 <= px && px < this.width) && (0 <= py && py < this.height)
        )
        .filter(([px, py]) => (this.data.get(`${px},${py}`) ?? Infinity) > time)
        .forEach(([px, py]) => {
          const nScore = score + 1;
          if (nScore < (scoreMap.get(`${px},${py}`) ?? Infinity)) {
            parentMap.set(`${px},${py}`, [x, y]);
            scoreMap.set(`${px},${py}`, nScore);
            heap.push([nScore, [px, py]]);
          }
        });
    }

    return [scoreMap, parentMap];
  }
}

export function parse(data: string): Memory {
  const bytes = data.trim().split("\n").map((line) =>
    line.trim().split(",").map(Number) as [number, number]
  );
  return new Memory(bytes);
}

export function solve1(data: Memory, time: number): number {
  // console.log(data.height, data.width);

  const grid = data.grid(time);
  // console.log(grid.map((row) => row.join("")).join("\n"));

  const [scoreMap, parentMap] = data.bfs(time);

  console.log(scoreMap);

  const path = [];
  for (
    let [x, y] = [data.width - 1, data.height - 1];
    x != 0 || y != 0;
    [x, y] = parentMap.get(`${x},${y}`)!
  ) {
    path.push([x, y]);
  }

  console.log(scoreMap);

  const score = scoreMap.get(`${data.width - 1},${data.height - 1}`)!;

  for (const [x, y] of path) {
    if (grid[y][x] == ".") {
      grid[y][x] = "O";
    } else {
      assert(grid[y][x] == "C");
      grid[y][x] = "X";
    }
  }

  console.log(grid.map((row) => row.join("")).join("\n"));

  return score;
  // return data.dfsContinuous([0, 0], 0, []);
}

export function solve2(data: Memory): number {
  return data.height * data.width;
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data, 1024));
  console.log(solve2(data));
}
