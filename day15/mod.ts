import { assert } from "@std/assert/assert";

type Move = "^" | "v" | "<" | ">";
type Pos = "." | "#" | "O" | "@";

export function parse(data: string): [Pos[][], Move[]] {
  const [a, b] = data.trim().split("\n\n");

  assert(a[0] === a[a.length - 1]);

  const grid = a.trim().split("\n").slice(1, -1).map((line) => {
    assert(line[0] === line[line.length - 1]);
    assert(line[0] === "#");
    return line.slice(1, -1).split("").map((c) => {
      assert(c === "." || c === "#" || c === "O" || c === "@");
      return c;
    });
  });

  const moves = b.trim().split("\n").map((line) => line.trim()).join("")
    .split(
      "",
    ).map(
      (c) => {
        assert(c === "^" || c === "v" || c === "<" || c === ">");
        return c;
      },
    );

  return [grid, moves];
}

export function solve1([grid, moves]: [Pos[][], Move[]]): number {
  const height = grid.length;
  const width = grid[0].length;

  let robotPos = { x: 0, y: 0 };
  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === "@") {
        robotPos = { x, y };
      }
    });
  });

  function moveRel(
    { x, y }: { x: number; y: number },
    { dx, dy }: { dx: number; dy: number },
  ): boolean {
    if (y + dy < 0 || y + dy >= height || x + dx < 0 || x + dx >= width) {
      return false;
    }
    const sourceCell = grid[y][x];
    const targetCell = grid[y + dy][x + dx];
    if (sourceCell == "#" || targetCell === "#") {
      return false;
    }

    if (targetCell === ".") {
      grid[y + dy][x + dx] = sourceCell;
      grid[y][x] = ".";
      return true;
    }

    if (targetCell === "O" && moveRel({ x: x + dx, y: y + dy }, { dx, dy })) {
      grid[y + dy][x + dx] = sourceCell;
      grid[y][x] = ".";
      return true;
    }

    return false;
  }

  for (const move of moves) {
    switch (move) {
      case "^":
        if (moveRel(robotPos, { dy: -1, dx: 0 })) robotPos.y--;
        break;
      case "v":
        if (moveRel(robotPos, { dy: 1, dx: 0 })) robotPos.y++;
        break;
      case "<":
        if (moveRel(robotPos, { dy: 0, dx: -1 })) robotPos.x--;
        break;
      case ">":
        if (moveRel(robotPos, { dy: 0, dx: 1 })) robotPos.x++;
        break;
    }
  }

  assert(grid[robotPos.y][robotPos.x] === "@");

  let count = 0;

  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === "O") {
        count += (y + 1) * 100 + (x + 1);
      }
    });
  });

  return count;
}

export function solve2([grid, moves]: [Pos[][], Move[]]): number {
  return grid.length * grid[0].length * moves.length;
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
