const PATTERN =
  /Button A: X\+(\d+), Y\+(\d+)\nButton B: X\+(\d+), Y\+(\d+)\nPrize: X=(\d+), Y=(\d+)/;

const OFFSET = 10000000000000;

export function parse(data: string): Game[] {
  return data.trim().split("\n\n").map((game) => {
    const [_m, ax, ay, bx, by, px, py] = game.match(PATTERN)!;
    return new Game([Number(ax), Number(ay)], [Number(bx), Number(by)], [
      Number(px),
      Number(py),
    ]);
  });
}

class Game {
  a: [number, number];
  b: [number, number];
  p: [number, number];
  constructor(a: [number, number], b: [number, number], p: [number, number]) {
    this.a = a;
    this.b = b;
    this.p = p;
  }

  correct(): Game {
    return new Game(this.a, this.b, [this.p[0] + OFFSET, this.p[1] + OFFSET]);
  }

  solve(): [number, number] {
    // return X such that
    // X * [A^T | B^T] = P
    // X = P * [A^T | B^T]^-1

    const A = this.a;
    const B = this.b;
    const P = this.p;

    // solve for X

    const determinant = A[0] * B[1] - A[1] * B[0];

    const AB_inv_div_det = [[B[1], -B[0]], [-A[1], A[0]]];

    const X_div_det = [
      P[0] * AB_inv_div_det[0][0] + P[1] * AB_inv_div_det[0][1],
      P[0] * AB_inv_div_det[1][0] + P[1] * AB_inv_div_det[1][1],
    ];

    if (
      determinant !== 0 &&
      X_div_det[0] % determinant === 0 &&
      X_div_det[1] % determinant === 0
    ) {
      return [X_div_det[0] / determinant, X_div_det[1] / determinant];
    } else {
      return [-1, -1];
    }
  }
}

export function solve1(data: Game[]): number {
  return data.map((game) => game.solve()).filter(([x, y]) =>
    0 <= x && x <= 100 && 0 <= y && y <= 100
  ).map(([x, y]) => x * 3 + y).reduce((a, b) => a + b, 0);
}

export function solve2(data: Game[]): number {
  return data.map((game) => game.correct().solve()).filter(([x, y]) =>
    0 <= x && 0 <= y
  ).map(([x, y]) => x * 3 + y).reduce((a, b) => a + b, 0);
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
