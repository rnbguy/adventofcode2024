const PATTERN = /p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/;

type Vec = [number, number];

export function parse(data: string): [Vec, Vec][] {
  return data.trim().split("\n").map((game) => {
    const [_m, x, y, vx, vy] = game.match(PATTERN)!;
    return [[Number(x), Number(y)], [Number(vx), Number(vy)]];
  });
}

export function solve(data: [Vec, Vec][], duration: number): number {
  let [width, height] = data.reduce(
    ([w, h], [[x, y], _vel]) => [Math.max(w, x), Math.max(h, y)],
    [0, 0],
  );

  width += 1;
  height += 1;

  const data_: Vec[] = data.map(([[x, y], [vx, vy]]) => {
    let x_ = (x + vx * duration) % width;
    if (x_ < 0) x_ += width;
    let y_ = (y + vy * duration) % height;
    if (y_ < 0) y_ += height;
    return [x_, y_];
  });

  const [midX, midY] = [Math.floor(width / 2), Math.floor(height / 2)];

  return data_.reduce(([a, b, c, d], [x, y]) => {
    // top-left quadrant
    if (x < midX && y < midY) return [a + 1, b, c, d];
    // bottom-left quadrant
    if (x < midX && y > midY) return [a, b + 1, c, d];
    // top-right quadrant
    if (x > midX && y < midY) return [a, b, c + 1, d];
    // bottom-right quadrant
    if (x > midX && y > midY) return [a, b, c, d + 1];
    return [a, b, c, d];
  }, [0, 0, 0, 0]).reduce((a, b) => a * b, 1);
}

export function solve1(data: [Vec, Vec][]): number {
  return solve(data, 100);
}

function printGrid(data: [Vec, Vec][], duration: number) {
  let [width, height] = data.reduce(
    ([w, h], [[x, y], _vel]) => [Math.max(w, x), Math.max(h, y)],
    [0, 0],
  );

  width += 1;
  height += 1;

  const posAfterDur = data.map(([[x, y], [vx, vy]]) => {
    let x_ = (x + vx * duration) % width;
    if (x_ < 0) x_ += width;
    let y_ = (y + vy * duration) % height;
    if (y_ < 0) y_ += height;
    return [[x_, y_], [vx, vy]];
  });

  const countAtPos = new Map<string, number>();

  posAfterDur.forEach(([x, y]) => {
    const key = `${x},${y}`;
    countAtPos.set(key, (countAtPos.get(key) || 0) + 1);
  });

  const grid = Array.from(
    { length: height },
    () => Array.from({ length: width }, () => "."),
  );

  countAtPos.forEach((count, key) => {
    const [x, y] = key.split(",").map(Number);
    grid[y][x] = count > 10 ? "#" : count.toString();
  });

  console.log(grid.map((row) => row.join("")).join("\n"));
}

export function solve2(data: [Vec, Vec][]): number {
  // min_index(i) solve(data, i)

  // this iteration can be optimized by keeping
  // track of a visited the grid config.
  // but this brute force works fine for the input.
  const { minDuration } = Array.from({ length: 10000 }).reduce(
    ({ minSafety, minDuration }, _, i) => {
      const safety = solve(data, i);
      if (safety < minSafety) {
        return { minSafety: safety, minDuration: i };
      }
      return { minSafety, minDuration };
    },
    { minSafety: Infinity, minDuration: 0 },
  );

  if (import.meta.main) {
    printGrid(data, minDuration);
  }

  return minDuration;
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
