export function parse(data: string): number[][] {
  return data.trim().split("\n").map((row) =>
    row.trim().split("").map(
      (c) => c.charCodeAt(0) - "A".charCodeAt(0),
    )
  );
}

export function solve(data: number[][]): [number, number, number, number][] {
  const adjMap = new Map<string, string[]>();
  const convexCorner = new Map<string, number>();
  const concaveCorner = new Map<string, number>();

  function getPlot([i, j]: [number, number]): number {
    if (0 <= i && i < data.length && 0 <= j && j < data[i].length) {
      return data[i][j];
    } else {
      return -1;
    }
  }

  function isRegion(
    [xi, yi]: [number, number],
    [xj, yj]: [number, number],
  ): boolean {
    return getPlot([xi, yi]) === getPlot([xj, yj]);
  }

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      const adj: string[] = [];
      [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ].map(([di, dj]) => [i + di, j + dj])
        .filter(([ni, nj]) => isRegion([i, j], [ni, nj]))
        .forEach(([ni, nj]) => {
          adj.push(`${ni},${nj}`);
        });

      const [convexCount, concaveCount] = [[-1, 1], [1, 1], [1, -1], [-1, -1]]
        .map(([di, dj]) => {
          const [ni, nj] = [i + di, j + dj];
          const [ki, kj] = [i + di, j];
          const [li, lj] = [i, j + dj];

          return [
            // convex corner. e.g. if looking at top-left corner, it's a convex corner
            // if the top and left are different regions
            !isRegion([i, j], [ki, kj]) && !isRegion([i, j], [li, lj]),
            // concave corner. e.g. if looking at top-left corner, it's a concave corner
            // if the top and left are the same region
            // but the top-left is a different region
            isRegion([i, j], [ki, kj]) && isRegion([i, j], [li, lj]) &&
            !isRegion([i, j], [ni, nj]),
          ];
        }).reduce(([convexCount, concaveCount], [isConvex, isConcave]) => {
          if (isConvex) convexCount++;
          if (isConcave) concaveCount++;
          return [convexCount, concaveCount];
        }, [0, 0]);

      adjMap.set(`${i},${j}`, adj);
      convexCorner.set(`${i},${j}`, convexCount);
      concaveCorner.set(`${i},${j}`, concaveCount);
    }
  }

  const regions: string[][] = [];
  const visited = new Set<string>();

  function dfs(node: string, region: string[]) {
    if (visited.has(node)) {
      return;
    }

    visited.add(node);
    region.push(node);

    adjMap.get(node)!.forEach((n) => {
      dfs(n, region);
    });
  }

  for (const key of adjMap.keys()) {
    if (!visited.has(key)) {
      const region: string[] = [];
      dfs(key, region);
      regions.push(region);
    }
  }

  return regions.map((region) => {
    const area = region.length;
    const perimeter = region.map((node) => 4 - adjMap.get(node)!.length).reduce(
      (a, b) => a + b,
      0,
    );
    const convexCornerCount = region.map((node) => convexCorner.get(node)!)
      .reduce((a, b) => a + b, 0);
    const concaveCornerCount = region.map((node) => concaveCorner.get(node)!)
      .reduce((a, b) => a + b, 0);
    return [area, perimeter, convexCornerCount, concaveCornerCount];
  });
}

export function solve1(data: number[][]): number {
  return solve(data).reduce(
    (price, [area, perimeter, _convexCornerCount, _concaveCornerCount]) => {
      return price + area * perimeter;
    },
    0,
  );
}

export function solve2(data: number[][]): number {
  return solve(data).reduce(
    (price, [area, _perimeter, convexCornerCount, concaveCornerCount]) => {
      return price + area * (convexCornerCount + concaveCornerCount);
    },
    0,
  );
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
