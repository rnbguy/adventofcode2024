import { BinaryHeap } from "jsr:@std/data-structures";

const PINGRID = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  ["#", "0", "A"],
];

const KEYPAD = [
  ["#", "^", "A"],
  ["<", "v", ">"],
];

type Dir = "^" | "v" | "<" | ">";

class Robot {
  grid: string[][];
  position: [number, number];
  passTo: Robot | null;

  constructor(
    grid: string[][],
    position: [number, number],
    passTo: Robot | null = null,
  ) {
    this.grid = grid;
    this.position = position;
    this.passTo = passTo;
  }

  currentPosition() {
    return this.grid[this.position[1]][this.position[0]];
  }

  toString(): string {
    return `${this.grid[this.position[1]][this.position[0]]}` +
      (this.passTo ? this.passTo.toString() : "");
  }

  positions(): [number, number][] {
    return [
      this.position.slice() as [number, number],
      ...(this.passTo ? this.passTo.positions() : []),
    ];
  }

  setPosition(positions: [number, number][]) {
    this.position = positions[0];
    if (this.passTo) {
      this.passTo.setPosition(positions.slice(1));
    }
  }

  move(dir: Dir): boolean {
    const newPosition = this.position.slice() as [number, number];
    switch (dir) {
      case "^":
        newPosition[1]--;
        break;
      case "v":
        newPosition[1]++;
        break;
      case "<":
        newPosition[0]--;
        break;
      case ">":
        newPosition[0]++;
        break;
    }
    if (
      newPosition[0] >= 0 && newPosition[0] < this.grid[0].length &&
      newPosition[1] >= 0 && newPosition[1] < this.grid.length &&
      this.grid[newPosition[1]][newPosition[0]] !== "#"
    ) {
      this.position = newPosition;
      return true;
    }
    return false;
  }

  action(): string | boolean {
    const key = this.currentPosition();
    if (this.passTo) {
      if (key === "A") {
        return this.passTo.action();
      } else {
        return this.passTo.move(key as Dir);
      }
    } else {
      return key;
    }
  }

  keystrokes(input: string): string {
    let ans = "";
    for (const key of input) {
      if (key === "A") {
        ans += this.action() || "";
      } else {
        this.move(key as Dir);
      }
    }
    return ans;
  }
}

export function parse(data: string): string[][] {
  return data.trim().split("\n").map((line) => line.trim().split(""));
}

export function solve1(data: string[][]): number {
  const pinRobot1 = new Robot(PINGRID, [2, 3]);
  const robot2 = new Robot(KEYPAD, [2, 0], pinRobot1);
  const me = new Robot(KEYPAD, [2, 0], robot2);

  // {output: {position: keystrokes}}
  const shortestKeystrokes = new Map<string, Map<string, string>>();

  // [keystrokes, position, output]
  const heap = new BinaryHeap<[string, [number, number][], string]>((a, b) =>
    a[0].length - b[0].length
  );

  heap.push(["", me.positions(), ""]);

  while (!heap.isEmpty()) {
    const [keystrokes, position, output] = heap.pop()!;

    me.setPosition(position);

    if (
      shortestKeystrokes.has(output) &&
      shortestKeystrokes.get(output)!.has(me.toString()) &&
      shortestKeystrokes.get(output)!.get(me.toString())!.length <=
        keystrokes.length
    ) continue;

    if (output.length > 4) {
      continue;
    }

    if (!shortestKeystrokes.has(output)) {
      shortestKeystrokes.set(output, new Map());
    }

    shortestKeystrokes.get(output)!.set(me.toString(), keystrokes);

    for (const key of ["A", "^", "v", "<", ">"]) {
      me.setPosition(position);
      if (key === "A") {
        const newOutput = me.action();
        if (newOutput === false) continue;
        if (newOutput === true) {
          heap.push([keystrokes + key, me.positions(), output]);
        } else {
          heap.push([keystrokes + key, me.positions(), output + newOutput]);
        }
      } else {
        if (me.move(key as Dir)) {
          heap.push([keystrokes + key, me.positions(), output]);
        }
      }
    }
  }

  return data.map((line) => {
    const keystrokes = shortestKeystrokes.get(line.join(""))!.values().reduce(
      (acc, val) => acc.length == 0 || acc.length > val.length ? val : acc,
      "",
    );

    const num = Number(
      line.map((c) => Number(c)).filter((n) => !Number.isNaN(n)).join(
        "",
      ),
    );

    return keystrokes.length * num;
  }).reduce((acc, val) => acc + val, 0);
}

export function solve2(data: string[][]): number {
  return data.length;
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
