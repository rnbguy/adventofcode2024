type Track = "." | "#";

class Grid {
  data: Track[][];

  get length(): number {
    return this.data[0].length;
  }

  get height(): number {
    return this.data.length;
  }

  constructor(data: Track[][]) {
    this.data = data;
  }
}

export function parse(data: string): Grid {
  return new Grid(
    data.trim().split("\n").map((line) => line.split("") as Track[]),
  );
}

export function solve1(data: Grid): number {
  return data.height * data.length;
}

export function solve2(data: Grid): number {
  return data.height * data.length;
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
