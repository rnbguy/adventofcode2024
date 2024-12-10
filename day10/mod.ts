export function parse(data: string): number[][] {
  return data.trim().split("\n").map((row) => row.trim().split("").map(Number));
}

export function solve1(data: number[][]): number {
  const valMap = new Map<string, number>();
  const adjMap = new Map<string, Array<string>>();

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[0].length; j++) {
      const key = `${i},${j}`;
      const neighbors = [];
      for (const [di, dj] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
        const ni = i + di;
        const nj = j + dj;
        if (ni >= 0 && ni < data.length && nj >= 0 && nj < data[0].length) {
          if (data[i][j] + 1 === data[ni][nj]) {
            neighbors.push(`${ni},${nj}`);
          }
        }
      }
      adjMap.set(key, neighbors);
      valMap.set(key, data[i][j]);
    }
  }

  const transitiveClosure = new Map<string, Set<string>>();

  const findTransitiveClosure = (key: string) => {
    if (transitiveClosure.has(key)) {
      return transitiveClosure.get(key)!;
    }

    const closure = new Set<string>();

    for (const neighbor of adjMap.get(key)!) {
      if (closure.has(neighbor)) continue;
      findTransitiveClosure(neighbor);
      const neighborClosure = transitiveClosure.get(neighbor)!;
      for (const node of neighborClosure) {
        closure.add(node);
      }
      closure.add(neighbor);
    }

    transitiveClosure.set(key, closure);
  };

  for (const [key, value] of valMap.entries()) {
    if (value !== 0) continue;
    findTransitiveClosure(key);
  }

  return valMap.entries().filter(([_, val]) => val === 0).map(([key, _]) => {
    return Array.from(transitiveClosure.get(key)!.values()).filter((key) =>
      valMap.get(key)! === 9
    ).length;
  }).reduce(
    (acc, x) => acc + x,
    0,
  );
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
