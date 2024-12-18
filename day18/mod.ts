import { assert } from "@std/assert/assert";

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

  dfsContinuous(
    [x, y]: [number, number],
    time: number,
    visited: string[],
  ): number {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return -1;
    }
    const key = `${x},${y}`;
    if (x == this.width - 1 && y == this.height - 1) {
      return time;
    }
    if (this.data.has(key) && this.data.get(key)! >= time) {
      return -1;
    }

    return [[0, 1], [0, -1], [1, 0], [-1, 0]].map((
      [dx, dy],
    ) => [x + dx, y + dy]).filter(([x, y]) =>
      visited.findIndex((v) => v == `${x},${y}`) == -1
    ).map((
      [px, py],
    ) => {
      visited.push(`${px},${py}`);
      const ans = this.dfsContinuous([px, py], time + 1, visited);
      visited.pop();
      return ans;
    }).filter((t) => t != -1).reduce(
      (a, b) => Math.min(a, b),
      Infinity,
    );
  }

  dfsFirstN(
    [x, y]: [number, number],
    time: number,
    distance: Map<string, [number, number][]>,
  ) {
    const key = `${x},${y}`;
    if (distance.has(key)) {
      return;
    }
    assert(0 <= x && x < this.width && 0 <= y && y < this.height);
    if (x == this.width - 1 && y == this.height - 1) {
      distance.set(key, [[x, y]]);
      return;
    }
    if (this.data.has(key) && this.data.get(key)! <= time) {
      distance.set(key, []);
      return;
    }

    distance.set(key, []);

    const neighbors = [[0, 1], [0, -1], [1, 0], [-1, 0]].map((
      [dx, dy],
    ) => [x + dx, y + dy])
      .filter(([px, py]) =>
        (0 <= px && px < this.width) && (0 <= py && py < this.height)
      );

    neighbors.forEach(([px, py]) => this.dfsFirstN([px, py], time, distance));

    const ans: [number, number][] = neighbors
      .map(([px, py]) => distance.get(`${px},${py}`)!)
      .filter((d) => d.length > 0)
      .map((p) => [[x, y], ...p] as [number, number][])
      .reduce(
        (a, b) => (a.length == 0 || a.length > b.length ? b : a),
        [],
      );
    distance.set(key, ans);
  }
}

export function parse(data: string): Memory {
  const bytes = data.trim().split("\n").map((line) =>
    line.trim().split(",").map(Number) as [number, number]
  );
  return new Memory(bytes);
}

export function solve1(data: Memory, time: number): number {
  const grid = data.grid(time);
  console.log(grid.map((row) => row.join("")).join("\n"));

  // const map = new Map();
  // data.dfsFirstN([0, 0], time, map);
  // return map.get("0,0")!.length - 1;

  return data.dfsContinuous([0, 0], 0, []);
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
