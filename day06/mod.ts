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
    const [x, y] = this.guardDirection;
    this.guardDirection = [-y, x];
  }

  guardPresent(): boolean {
    const [x, y] = this.guard;
    return this.inside(x, y);
  }

  guardWalk() {
    const [x, y] = this.guard;
    const [dx, dy] = this.guardDirection;

    const [xNext, yNext] = [x + dx, y + dy];

    if (this.isWall(xNext, yNext)) {
      this.changeDirection();
      this.guardWalk();
    } else {
      this.guard = [xNext, yNext];
      {
        this.set(x, y, "X");
        this.set(xNext, yNext, "^");
      }
    }
  }

  addObstacle(x: number, y: number) {
    this.set(x, y, "#");
  }

  xLocations(): number[][] {
    const locations = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.isVisited(x, y)) {
          locations.push([x, y]);
        }
      }
    }
    return locations;
  }
}

function clone(data: string[][]): string[][] {
  return data.map((row) => row.slice());
}

export function parse(data: string): string[][] {
  return data.trim().split("\n").map((line) => line.split(""));
}

export function solve1(data: string[][]): number {
  const grid = new Grid(clone(data));

  while (true) {
    grid.guardWalk();
    if (!grid.guardPresent()) {
      break;
    }
  }

  return grid.xLocations().length;
}

export function solve2(data: string[][]): number {
  const grid = new Grid(clone(data));

  while (true) {
    grid.guardWalk();
    if (!grid.guardPresent()) {
      break;
    }
  }

  const locations = grid.xLocations();

  return locations.filter(([x, y]) => {
    const grid = new Grid(clone(data));
    grid.addObstacle(x, y);
    let stepCount = 0;
    while (true) {
      grid.guardWalk();
      if (!grid.guardPresent()) {
        break;
      }
      stepCount++;
      // this is a hack - if guard has walked too many steps, he may be in a loop.
      // we should rather check guard's location is visited with same direction
      if (stepCount > 2 * locations.length) {
        return true;
      }
    }
    return false;
  }).length;
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
