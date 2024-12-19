import { BinaryHeap } from "jsr:@std/data-structures";

class Memory {
  height: number;
  width: number;
  bytes: [number, number][];
  constructor(bytes: [number, number][]) {
    this.height = 0;
    this.width = 0;
    bytes.forEach(([x, y], i) => {
      this.height = Math.max(this.height, y);
      this.width = Math.max(this.width, x);
    });
    this.bytes = bytes;
    this.width++;
    this.height++;
  }

  topBytes(time: number): Set<string> {
    return new Set(
      Array.from({ length: time }, (_, i) => i).map((i) =>
        this.bytes[i].join(",")
      ),
    );
  }

  grid(time: number): string[][] {
    const grid = Array.from(
      { length: this.height },
      () => Array.from({ length: this.width }, () => "."),
    );
    for (const key of this.topBytes(time)) {
      const [x, y] = key.split(",").map(Number);
      grid[y][x] = "#";
    }
    return grid;
  }

  bfs(time: number): [Map<string, number>, Map<string, [number, number]>] {
    const heap = new BinaryHeap<[number, [number, number]]>((a, b) =>
      a[0] - b[0]
    );

    const topBytes = this.topBytes(time);

    const parentMap = new Map<string, [number, number]>();
    const scoreMap = new Map<string, number>();

    heap.push([0, [0, 0]]);

    while (heap.length > 0) {
      const [score, [x, y]] = heap.pop()!;
      const key = `${x},${y}`;

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
        .filter(([px, py]) => !topBytes.has(`${px},${py}`))
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
  const [scoreMap, _parentMap] = data.bfs(time);
  return scoreMap.get(`${data.width - 1},${data.height - 1}`)!;
}

export function solve2(data: Memory, time: number): [number, number] {
  let low = time;
  let high = data.bytes.length;
  while (low + 1 < high) {
    const mid = (low + high) >> 1;
    const [scoreMap, _parentMap] = data.bfs(mid);
    if (scoreMap.has(`${data.width - 1},${data.height - 1}`)) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return data.bytes[high - 1];
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data, 1024));
  console.log(solve2(data, 1024));
}
