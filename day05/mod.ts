class DirectedGraph {
  edges: Map<number, Set<number>>;
  tempEdges: Map<number, Set<number>>;

  constructor() {
    this.edges = new Map();
    this.tempEdges = new Map();
  }

  addEdge(from: number, to: number) {
    if (this.edges.get(from) === undefined) {
      this.edges.set(from, new Set());
    }
    this.edges.get(from)!.add(to);
  }

  hasEdge(from: number, to: number): boolean {
    return (this.edges.get(from) ?? new Set()).has(to);
  }

  restrict(nodes: Set<number>): DirectedGraph {
    const result = new DirectedGraph();

    for (const [from, tos] of this.edges) {
      if (nodes.has(from)) {
        for (const to of tos) {
          if (nodes.has(to)) {
            result.addEdge(from, to);
          }
        }
      }
    }

    return result;
  }

  hasCycleFrom(
    node: number,
    visited: Set<number>,
    stack: Set<number>,
  ): boolean {
    if (stack.has(node)) {
      return true;
    }

    if (visited.has(node)) {
      return false;
    }

    visited.add(node);
    stack.add(node);

    for (const neighbor of this.edges.get(node) ?? new Set()) {
      if (this.hasCycleFrom(neighbor, visited, stack)) {
        return true;
      }
    }

    for (const neighbor of this.tempEdges.get(node) ?? new Set()) {
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

  topologicalSort(): number[] {
    const nodes: Set<number> = new Set();

    for (const [from, tos] of this.edges) {
      nodes.add(from);
      for (const to of tos) {
        nodes.add(to);
      }
    }

    for (const [from, tos] of this.tempEdges) {
      nodes.add(from);
      for (const to of tos) {
        nodes.add(to);
      }
    }

    const parents = new Map<number, Set<number>>();

    for (const node of nodes) {
      parents.set(node, new Set());
    }

    for (const [from, tos] of this.edges) {
      for (const to of tos) {
        parents.get(to)!.add(from);
      }
    }

    for (const [from, tos] of this.tempEdges) {
      for (const to of tos) {
        parents.get(to)!.add(from);
      }
    }

    const result = [];

    while (parents.size > 0) {
      const nextNodes = [...parents.entries()].find(([_, parent]) =>
        parent.size === 0
      );
      if (nextNodes === undefined) {
        return [];
      }

      const node = nextNodes[0];

      result.push(node);
      parents.delete(node);

      for (const parent of parents.values()) {
        parent.delete(node);
      }
    }

    if (result.length === nodes.size) {
      return result;
    } else {
      return [];
    }
  }
}

export function parse(data: string): [number[][], number[][]] {
  const [rulesStr, pagesStr] = data.trim().split("\n\n");
  const rules = rulesStr.split("\n").map((rule) =>
    rule.split("|").map((r) => Number(r))
  );

  const pages = pagesStr.split("\n").map((page) => page.split(",").map(Number));

  return [rules, pages];
}

export function solve1(data: [number[][], number[][]]): number {
  const [rules, pages] = data;

  const dirGraph = new DirectedGraph();

  rules.forEach(([from, to]) => dirGraph.addEdge(from, to));

  return pages.map((page) => {
    const pageGraph = dirGraph.restrict(new Set(page));

    for (let i = 0; i < page.length - 1; i++) {
      pageGraph.addEdge(page[i], page[i + 1]);
    }
    const topSort = pageGraph.topologicalSort();
    if (topSort.length === 0) {
      return 0;
    } else {
      return page[(page.length - 1) / 2];
    }
  }).reduce((a, b) => a + b, 0);
}

export function solve2(data: [number[][], number[][]]): number {
  const [rules, pages] = data;

  const dirGraph = new DirectedGraph();

  rules.forEach(([from, to]) => dirGraph.addEdge(from, to));

  const topologicalSort = dirGraph.topologicalSort();

  const topologicalIndex = new Map<number, number>();
  topologicalSort.forEach((node, index) => topologicalIndex.set(node, index));

  return pages.map((page) => {
    const pageGraph = dirGraph.restrict(new Set(page));

    const fixed = pageGraph.topologicalSort();

    for (let i = 0; i < page.length - 1; i++) {
      pageGraph.addEdge(page[i], page[i + 1]);
    }
    const topSort = pageGraph.topologicalSort();
    if (topSort.length === 0) {
      return fixed[(fixed.length - 1) / 2];
    } else {
      return 0;
    }
  }).reduce((a, b) => a + b, 0);
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
