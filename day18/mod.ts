class Memory {
  height: number;
  width: number;
  data: Map<string, number>;
  constructor(map: [number, number][]) {
    this.height = 0;
    this.width = 0;
    this.data = new Map();
    map.forEach(([x, y], i) => {
      this.data.set(`${x},${y}`, i);
      this.height = Math.max(this.height, y);
      this.width = Math.max(this.width, x);
    });
    this.width++;
    this.height++;
  }
}

export function parse(data: string): Memory {
  const bytes = data.trim().split("\n").map((line) =>
    line.trim().split(",").map(Number) as [number, number]
  );
  return new Memory(bytes);
}

export function solve1(data: Memory): number {
  return data.height * data.width;
}

export function solve2(data: Memory): number {
  return data.height * data.width;
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
