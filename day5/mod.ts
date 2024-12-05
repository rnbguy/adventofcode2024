class DirectedGraph {
  edges: Record<number, Set<number>>;
  tempEdges: Record<number, Set<number>>;

  constructor() {
    this.edges = {};
    this.tempEdges = {};
  }

  addEdge(from: number, to: number) {
    if (this.edges[from] === undefined) {
      this.edges[from] = new Set();
    }
    this.edges[from].add(to);
  }

  addTempEdge(from: number, to: number) {
    if (this.tempEdges[from] === undefined) {
      this.tempEdges[from] = new Set();
    }
    this.tempEdges[from].add(to);
  }

  clearTempEdges() {
    this.tempEdges = {};
  }

  hasEdge(from: number, to: number): boolean {
    return (this.edges[from]?.has(to) ?? false) ||
      (this.tempEdges[from]?.has(to) ?? false);
  }

  hasCycleFrom(
    node: number,
    visited: Set<number>,
    stack: Set<number>,
  ): boolean {
    if (visited.has(node)) {
      // already visited; no cycle
      return false;
    }

    if (stack.has(node)) {
      // node is in the current stack; cycle
      return true;
    }

    visited.add(node);
    stack.add(node);

    for (const neighbor of this.edges[node] ?? []) {
      if (this.hasCycleFrom(neighbor, visited, stack)) {
        return true;
      }
    }

    for (const neighbor of this.tempEdges[node] ?? []) {
      if (this.hasCycleFrom(neighbor, visited, stack)) {
        return true;
      }
    }

    stack.delete(node);
    return false;
  }

  hasCycle(): boolean {
    const visited = new Set<number>();
    const stack = new Set<number>();

    for (const node of Object.keys(this.edges).map(Number)) {
      if (stack.size > 0) {
        alert("stack not empty");
      }
      if (this.hasCycleFrom(node, visited, stack)) {
        return true;
      }
    }

    for (const node of Object.keys(this.tempEdges).map(Number)) {
      if (stack.size > 0) {
        alert("stack not empty");
      }
      if (this.hasCycleFrom(node, visited, stack)) {
        return true;
      }
    }

    return false;
  }
}

export function parse(data_r: string): [number[][], number[][]] {
  const data = data_r.trim();
  const [rules_s, pages_s, _] = data.split("\n\n");
  const rules = rules_s.split("\n").map((rule) =>
    rule.split("|").map((r) => Number(r))
  );

  const pages = pages_s.split("\n").map((page) => page.split(",").map(Number));

  return [rules, pages];
}

export function solve1(data: [number[][], number[][]]): number {
  const [rules, pages] = data;

  const dirGraph = new DirectedGraph();

  rules.forEach(([from, to]) => {
    dirGraph.addEdge(from, to);
  });

  return pages.filter((page) => {
    dirGraph.clearTempEdges();
    for (let i = 0; i < page.length - 1; i++) {
      if (dirGraph.hasEdge(page[i + 1], page[i])) {
        return false;
      }
      dirGraph.addTempEdge(page[i], page[i + 1]);
    }
    return !dirGraph.hasCycle();
  }).map((page) => page[(page.length - 1) / 2]).reduce((a, b) => a + b, 0);
}

export function solve2(_data: [number[][], number[][]]): number {
  return 0;
}

if (import.meta.main) {
  const data_path = new URL("input.txt", import.meta.url).pathname;
  const data = await Deno.readTextFile(data_path);
  console.log(solve1(parse(data)));
  console.log(solve2(parse(data)));
}
