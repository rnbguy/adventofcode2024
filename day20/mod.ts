import { assert } from "@std/assert/assert";

type Track = "." | "#" | "S" | "E";

const DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]];

class Grid {
  data: Track[][];
  start: [number, number] = [0, 0];
  end: [number, number] = [0, 0];
  path: [number, number][] = [];
  score: Map<string, number> = new Map();

  get length(): number {
    return this.data[0].length;
  }

  get height(): number {
    return this.data.length;
  }

  constructor(data: Track[][]) {
    this.data = data;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.length; x++) {
        if (this.data[y][x] === "S") {
          this.start = [x, y];
        } else if (this.data[y][x] === "E") {
          this.end = [x, y];
        }
      }
    }

    this.path.push(this.start.slice() as [number, number]);
    this.score.set(`${this.start[0]},${this.start[1]}`, 0);

    while (true) {
      const lastPos = this.path[this.path.length - 1];
      if (lastPos[0] === this.end[0] && lastPos[1] === this.end[1]) {
        break;
      }

      const nextPos = DIRS.map(([dx, dy]) =>
        [lastPos[0] + dx, lastPos[1] + dy] as [number, number]
      ).filter(([x, y]) => data[y][x] !== "#").filter(([x, y]) =>
        !this.score.has(`${x},${y}`)
      );

      assert(nextPos.length === 1);

      this.path.push(nextPos[0]);
      this.score.set(`${nextPos[0][0]},${nextPos[0][1]}`, this.path.length - 1);
    }
  }

  shortCircuits(): [number, number, number][] {
    const countSC = [];

    for (let p = 0; p < this.path.length; p++) {
      for (let q = p + 2; q < this.path.length; q++) {
        const [px, py] = this.path[p];
        const [qx, qy] = this.path[q];
        if (
          !DIRS.some(([dx, dy]) => px + dx * 2 === qx && py + dy * 2 === qy)
        ) continue;
        const pScore = this.score.get(`${px},${py}`)!;
        const qScore = this.score.get(`${qx},${qy}`)!;
        assert(qScore >= pScore + 2);
        if (qScore === pScore + 2) continue;
        countSC.push([p, q, qScore - pScore - 2] as [number, number, number]);
      }
    }

    return countSC;
  }
}

export function parse(data: string): Grid {
  return new Grid(
    data.trim().split("\n").map((line) => line.split("") as Track[]),
  );
}

export function solve1(data: Grid, minimumSC: number): number {
  const sc = data.shortCircuits();
  return sc.filter(([, , len]) => len >= minimumSC).length;
}

export function solve2(data: Grid): number {
  return data.height * data.length;
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data, 100));
  console.log(solve2(data));
}
