import { assert } from "@std/assert";

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

export function solve1([gridr, moves]: [Pos[][], Move[]]): number {
  const grid = gridr.map((row) => row.slice());

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

export function solve2([oldGrid, moves]: [Pos[][], Move[]]): number {
  const grid = oldGrid.map((row) =>
    row.map((cell) => {
      switch (cell) {
        case "#":
          return ["#", "#"];
        case "O":
          return ["[", "]"];
        case ".":
          return [".", "."];
        case "@":
          return ["@", "."];
        default:
          throw new Error("Invalid cell");
      }
    }).flat()
  );

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
    dryRun: boolean,
  ): boolean {
    const sourceCell = grid[y][x];

    assert(sourceCell !== "]");

    if (y + dy < 0 || y + dy >= height || x + dx < 0 || x + dx >= width) {
      return false;
    }

    if (sourceCell === "#") {
      return false;
    }

    if (sourceCell === ".") {
      return true;
    }

    if (sourceCell === "@") {
      const targetCell = grid[y + dy][x + dx];
      if (targetCell === "#") {
        return false;
      }

      if (targetCell === ".") {
        if (!dryRun) {
          grid[y + dy][x + dx] = "@";
          grid[y][x] = ".";
        }
        return true;
      }

      // if box
      if (
        targetCell === "[" &&
        moveRel({ x: x + dx, y: y + dy }, { dx, dy }, dryRun)
      ) {
        if (!dryRun) {
          grid[y + dy][x + dx] = "@";
          grid[y][x] = ".";
        }
        return true;
      }

      // always move front of box
      if (
        targetCell === "]" &&
        moveRel({ x: x - 1 + dx, y: y + dy }, { dx, dy }, dryRun)
      ) {
        if (!dryRun) {
          grid[y + dy][x + dx] = "@";
          grid[y][x] = ".";
        }
        return true;
      }
    }

    // if box
    if (sourceCell === "[") {
      assert(grid[y][x + 1] === "]");

      const newPos = [{ x: x + dx, y: y + dy }, { x: x + 1 + dx, y: y + dy }]
        .filter((nXY) =>
          [{ x, y }, { x: x + 1, y }].every((xy) =>
            xy.x !== nXY.x || xy.y !== nXY.y
          )
        );

      if (newPos.some((pos) => grid[pos.y][pos.x] === "#")) {
        return false;
      }

      if (newPos.every((pos) => grid[pos.y][pos.x] === ".")) {
        if (!dryRun) {
          // pick up the box
          grid[y][x] = ".";
          grid[y][x + 1] = ".";
          // put back the box at new position
          // note: old and new position may overlap
          grid[y + dy][x + dx] = "[";
          grid[y + dy][x + 1 + dx] = "]";
        }
        return true;
      }

      const newBoxPos = newPos.map((pos) => {
        if (grid[pos.y][pos.x] === "]") {
          return { x: pos.x - 1, y: pos.y };
        } else {
          return pos;
        }
      });

      assert(newBoxPos.length <= 2);
      assert(newBoxPos.length > 0);

      // could have used a Set here
      const finalNexBoxPos = [];

      if (newBoxPos.length === 1) {
        finalNexBoxPos.push(newBoxPos[0]!);
      } else if (
        newBoxPos[0]!.x == newBoxPos[1]!.x && newBoxPos[0]!.y == newBoxPos[1]!.y
      ) {
        finalNexBoxPos.push(newBoxPos[0]!);
      } else {
        finalNexBoxPos.push(newBoxPos[0]!);
        finalNexBoxPos.push(newBoxPos[1]!);
      }

      assert(finalNexBoxPos.every((pos) => grid[pos.y][pos.x] !== "]"));

      if (finalNexBoxPos.every((pos) => moveRel(pos, { dx, dy }, true))) {
        if (!dryRun) {
          finalNexBoxPos.forEach((pos) => moveRel(pos, { dx, dy }, false));
          // pick up the box
          grid[y][x] = ".";
          grid[y][x + 1] = ".";
          // put back the box at new position
          // note: old and new position may overlap
          grid[y + dy][x + dx] = "[";
          grid[y + dy][x + 1 + dx] = "]";
        }
        return true;
      }
    }

    return false;
  }

  for (const move of moves) {
    switch (move) {
      case "^":
        if (moveRel(robotPos, { dy: -1, dx: 0 }, false)) robotPos.y--;
        break;
      case "v":
        if (moveRel(robotPos, { dy: 1, dx: 0 }, false)) robotPos.y++;
        break;
      case "<":
        if (moveRel(robotPos, { dy: 0, dx: -1 }, false)) robotPos.x--;
        break;
      case ">":
        if (moveRel(robotPos, { dy: 0, dx: 1 }, false)) robotPos.x++;
        break;
    }
  }

  assert(grid[robotPos.y][robotPos.x] === "@");

  let count = 0;

  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === "[") {
        count += (y + 1) * 100 + (x + 2);
      }
    });
  });

  return count;
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
