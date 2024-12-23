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

  findCliques(size: number): string[][] {
    const cliques: Set<string> = new Set();
    const visited = new Set<string>();
    const current: string[] = [];

    const backtrack = (vertex: string | undefined = undefined) => {
      if (current.length === size) {
        const ar = current.slice();
        ar.sort();
        cliques.add(ar.join(","));
        return;
      }

      const candidates = vertex === undefined
        ? Array.from(this.adjMap.keys())
        : Array.from(this.adjMap.get(vertex) || []);

      for (const next of candidates) {
        if (visited.has(next)) continue;
        if (
          current.length > 0 &&
          !current.every((v) => this.adjMap.get(v)?.has(next))
        ) continue;

        visited.add(next);
        current.push(next);
        backtrack(next);
        current.pop();
        visited.delete(next);
      }
    };

    backtrack();
    return Array.from(cliques).map((clique) => clique.split(","));
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

  return graph.findCliques(3).filter((clique) =>
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
