export function parse(data: string): string[][] {
  return data.trim().split("\n").map((line) => line.trim().split(""));
}

export function solve(rdata: string[][], bound: [number, number]): number {
  const data = rdata.map((row) => row.slice());
  const height = data.length;
  const width = data[0].length;
  const charLocs = new Map<string, [number, number][]>();
  for (let y = 0; y < width; y++) {
    for (let x = 0; x < height; x++) {
      const char = data[y][x];
      if (char === ".") continue;
      if (!charLocs.has(char)) {
        charLocs.set(char, []);
      }
      charLocs.get(char)!.push([x, y]);
    }
  }

  for (const [_, locs] of charLocs) {
    for (let i = 0; i < locs.length; i++) {
      for (let j = 0; j < locs.length; j++) {
        if (i === j) continue;

        const [x1, y1] = locs[i];
        const [x2, y2] = locs[j];

        // point1 -> point2
        for (let h = bound[0]; h <= bound[1]; h++) {
          const [ax1, ay1] = [x1 + h * (x1 - x2), y1 + h * (y1 - y2)];
          if (0 <= ax1 && ax1 < width && 0 <= ay1 && ay1 < height) {
            data[ay1][ax1] = "#";
          } else {
            break;
          }
        }
      }
    }
  }

  let count = 0;

  for (let y = 0; y < width; y++) {
    for (let x = 0; x < height; x++) {
      if (data[y][x] === "#") {
        count++;
      }
    }
  }

  return count;
}

export function solve1(data: string[][]): number {
  return solve(data, [1, 1]);
}

export function solve2(data: string[][]): number {
  return solve(data, [0, Infinity]);
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
