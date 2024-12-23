export function parse(data: string): [string, string][] {
  return data.trim().split("\n").map((line) =>
    line.split("-") as [string, string]
  );
}

class Graph {
  adjMap: Map<string, Set<string>>;
  constructor() {
    this.adjMap = new Map();
  }

  addDirEdge(from: string, to: string) {
    if (!this.adjMap.has(from)) {
      this.adjMap.set(from, new Set());
    }
    this.adjMap.get(from)!.add(to);
  }

  addUndirEdge(from: string, to: string) {
    this.addDirEdge(from, to);
    this.addDirEdge(to, from);
  }

  addUndirEdges(edges: [string, string][]) {
    for (const [from, to] of edges) {
      this.addUndirEdge(from, to);
    }
  }

  findCliquesOfSize(size: number): string[][] {
    const allCliques = this.findAllCliques();
    const result = new Set<string>();

    const pickN = (arr: string[], n: number): string[][] => {
      if (n === 0) {
        return [[]];
      }

      if (arr.length === 0) {
        return [];
      }

      const head = arr[0];
      const tail = arr.slice(1);
      const withHead = pickN(tail, n - 1).map((comb) => [head, ...comb]);
      const withoutHead = pickN(tail, n);

      return [...withHead, ...withoutHead];
    };

    for (const clique of allCliques) {
      for (const combination of pickN(clique, size)) {
        result.add(combination.join(","));
      }
    }

    return Array.from(result).map((clique) => clique.split(","));
  }

  findAllCliques(): string[][] {
    const allCliques: string[][] = [];
    const R = new Set<string>();
    const P = new Set(this.adjMap.keys());
    const X = new Set<string>();

    const bronKerbosch = (R: Set<string>, P: Set<string>, X: Set<string>) => {
      if (P.size === 0 && X.size === 0) {
        allCliques.push(Array.from(R).sort());
        return;
      }

      const u = [...P, ...X][0];
      const candidates = new Set(
        [...P].filter((v) => !this.adjMap.get(u)?.has(v)),
      );

      for (const v of candidates) {
        const neighbors = this.adjMap.get(v) || new Set();
        bronKerbosch(
          new Set([...R, v]),
          new Set([...P].filter((x) => neighbors.has(x))),
          new Set([...X].filter((x) => neighbors.has(x))),
        );
        P.delete(v);
        X.add(v);
      }
    };

    bronKerbosch(R, P, X);
    return allCliques;
  }
}

export function solve1(data: [string, string][]): number {
  const graph = new Graph();

  graph.addUndirEdges(data);

  return graph.findCliquesOfSize(3).filter((clique) =>
    clique.some((v) => v.startsWith("t"))
  ).length;
}

export function solve2(data: [string, string][]): string {
  const graph = new Graph();

  graph.addUndirEdges(data);

  const allCliques = graph.findAllCliques();
  const validCliques = allCliques.filter((clique) =>
    clique.some((v) => v.startsWith("t"))
  );
  return validCliques.reduce(
    (max, clique) => clique.length > max.length ? clique : max,
    [],
  ).join(",");
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
