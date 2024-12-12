export function parse(data: string): number[][] {
  return data.trim().split("\n").map((row) =>
    row.trim().split("").map(
      (c) => c.charCodeAt(0) - "A".charCodeAt(0),
    )
  );
}

export function solve1(data: number[][]): number {
  const adjMap = new Map<string, string[]>();

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

      adjMap.set(`${i},${j}`, adj);
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
    return [area, perimeter];
  }).map(([area, perimeter]) => area * perimeter).reduce((a, b) => a + b, 0);
}

export function solve2(data: number[][]): number {
  return data.length * data[0].length;
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
