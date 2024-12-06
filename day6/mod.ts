class Grid {
  data: string[][];
  guard: [number, number];
  guardDirection: [number, number];

  constructor(data: string[][]) {
    this.data = data;
    this.guard = this.findGuard;
    this.guardDirection = [0, -1];
  }

  get width(): number {
    return this.data[0].length;
  }

  get height(): number {
    return this.data.length;
  }

  inside(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  get(x: number, y: number): string {
    if (this.inside(x, y)) {
      return this.data[y][x];
    } else {
      return "";
    }
  }

  set(x: number, y: number, value: string) {
    if (this.inside(x, y)) {
      this.data[y][x] = value;
    }
  }

  get findGuard(): [number, number] {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.get(x, y) === "^") {
          return [x, y];
        }
      }
    }
    return [-1, -1];
  }

  isWall(x: number, y: number): boolean {
    return this.get(x, y) === "#";
  }

  isVisited(x: number, y: number): boolean {
    return this.get(x, y) === "X";
  }

  changeDirection() {
    // [0, -1] -> [1, 0] -> [0, 1] -> [-1, 0] -> [0, -1]
    let [x, y] = this.guardDirection;
    this.guardDirection = [-y, x];
  }

  guardPresent(): boolean {
    let [x, y] = this.guard;
    return this.inside(x, y);
  }

  guardWalk() {
    const [x, y] = this.guard;
    const [dx, dy] = this.guardDirection;

    const [x_, y_] = [x + dx, y + dy];

    if (this.isWall(x_, y_)) {
      this.changeDirection();
      this.guardWalk();
    } else {
      this.guard = [x_, y_];
      {
        this.set(x, y, "X");
        this.set(x_, y_, "^");
      }
    }
  }

  countX(): number {
    let count = 0;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.isVisited(x, y)) {
          count++;
        }
      }
    }
    return count;
  }
}
export function parse(data_r: string): string[][] {
  const data = data_r.trim();
  return data.split("\n").map((line) => {
    return line.split("");
  });
}

export function solve1(data: string[][]): number {
  const grid = new Grid(data);

  while (true) {
    grid.guardWalk();
    if (!grid.guardPresent()) {
      break;
    }
  }

  return grid.countX();
}

export function solve2(_data: string[][]): number {
  return 0;
}

if (import.meta.main) {
  const data_path = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(data_path));
  console.log(solve1(data));
  console.log(solve2(data));
}
