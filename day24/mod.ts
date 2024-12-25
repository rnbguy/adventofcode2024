class Device {
  input: [string, number][];
  gates: [string, string, string, string][];

  constructor(
    input: [string, number][],
    gates: [string, string, string, string][],
  ) {
    this.input = input;
    this.gates = gates;
  }

  compute(): bigint {
    const values = new Map<string, number>();
    const outputs = new Map<string, [string, string, string]>();

    for (const [wire, value] of this.input) {
      values.set(wire, value);
    }

    for (const [a, op, b, wire] of this.gates) {
      outputs.set(wire, [a, op, b]);
    }

    const computeWire = (wire: string): number => {
      if (!values.has(wire)) {
        const [a, op, b] = outputs.get(wire)!;

        const a_value = computeWire(a);
        const b_value = computeWire(b);

        switch (op) {
          case "AND":
            values.set(wire, a_value & b_value);
            break;
          case "OR":
            values.set(wire, a_value | b_value);
            break;
          case "XOR":
            values.set(wire, a_value ^ b_value);
            break;
          default:
            break;
        }
      }
      return values.get(wire)!;
    };

    return this.gates.map(([, , , wire]) => wire).filter((wire) =>
      wire.startsWith("z")
    ).sort().reverse().map((wire) => computeWire(wire)).reduce(
      (acc, value) => (acc << 1n) | BigInt(value),
      0n,
    );
  }

  swap(a: string, b: string): void {
    for (let i = 0; i < this.gates.length; i++) {
      if (this.gates[i][3] === a) {
        this.gates[i][3] = b;
      } else if (this.gates[i][3] === b) {
        this.gates[i][3] = a;
      }
    }
  }

  maxZVar(): number {
    return Number(
      this.gates.map(([, , , wire]) => wire).filter((wire) =>
        wire.startsWith("z")
      ).sort().reverse()[0].slice(1),
    );
  }

  isValid(): boolean {
    const visited = new Set<string>();

    const dfs = (wire: string): boolean => {
      if (visited.has(wire)) {
        return false;
      }

      visited.add(wire);

      const [a, , b] = this.gates.find(([, , , w]) => w === wire)!;

      if (!dfs(a) || !dfs(b)) return false;

      visited.delete(wire);

      return true;
    };

    return dfs(`z${this.maxZVar()}`);
  }

  getAllDependencies(): Map<string, Set<string>> {
    const dependencies = new Map<string, Set<string>>();

    for (const [a, , b, wire] of this.gates) {
      if (!dependencies.has(a)) {
        dependencies.set(a, new Set());
      }
      if (!dependencies.has(b)) {
        dependencies.set(b, new Set());
      }
      if (!dependencies.has(wire)) {
        dependencies.set(wire, new Set());
      }

      dependencies.get(wire)!.add(a);
      dependencies.get(wire)!.add(b);
      dependencies.get(wire)!.add(wire);
    }

    // find the closure of the dependencies
    let changed = true;
    while (changed) {
      changed = false;
      for (const [, deps] of dependencies) {
        for (const dep of deps) {
          for (const depDep of dependencies.get(dep)!) {
            if (!deps.has(depDep)) {
              deps.add(depDep);
              changed = true;
            }
          }
        }
      }
    }

    return dependencies;
  }

  getIncrementalDependencies(): Map<number, Set<string>> {
    const allDependencies = this.getAllDependencies();

    const incrementalDependencies = new Map<number, Set<string>>();

    let till = new Set();

    const maxZ = this.maxZVar();

    for (let zn = 0; zn <= maxZ; zn++) {
      const z = `z${zn.toString().padStart(2, "0")}`;
      const current = allDependencies.get(z)!;
      incrementalDependencies.set(
        zn,
        new Set(current.values().filter((dep) => !till.has(dep))),
      );
      till = new Set([...till, ...current]);
    }

    return incrementalDependencies;
  }

  getGatesAtEachLevel(): Map<number, [string, string, string, string][]> {
    const levels = new Map<number, [string, string, string, string][]>();

    const incrementalDependencies = this.getIncrementalDependencies();

    for (const [a, op, b, w] of this.gates) {
      const [level] = incrementalDependencies.entries().find(([, wires]) =>
        wires.has(w)
      )!;
      if (!levels.has(level)) {
        levels.set(level, []);
      }
      levels.get(level)!.push([a, op, b, w]);
    }

    return levels;
  }

  expectedGates(
    level: number,
    maxLevel: number,
  ): { and: number; or: number; xor: number } {
    switch (level) {
      case 0:
        return { and: 0, or: 0, xor: 1 };
      case 1:
        return { and: 1, or: 0, xor: 2 };
      case maxLevel:
        return { and: 2, or: 1, xor: 0 };
      default:
        return { and: 2, or: 1, xor: 2 };
    }
  }

  validLevel(
    level: number,
    maxLevel: number,
    gates: [string, string, string, string][],
  ): boolean {
    const expected = this.expectedGates(level, maxLevel);
    const { and, or, xor } = gates.reduce(
      (acc, [, op]) => {
        switch (op) {
          case "AND":
            acc.and++;
            break;
          case "OR":
            acc.or++;
            break;
          case "XOR":
            acc.xor++;
            break;
          default:
            break;
        }
        return acc;
      },
      { and: 0, or: 0, xor: 0 },
    );

    // there must be one x${level-1} AND x${level-1} gate.
    if (expected.and > 0 && expected.and === and) {
      const levelKey = (level - 1).toString().padStart(2, "0");
      if (
        gates.filter(([a, op, b]) =>
          op === "AND" &&
          ((a === `x${levelKey}` && b === `y${levelKey}`) ||
            (b === `x${levelKey}` && a === `y${levelKey}`))
        ).length === 0
      ) {
        return false;
      }
    }

    // there must be one x${level} XOR x${level} gate.
    if (expected.xor > 0 && expected.xor === xor) {
      const levelKey = level.toString().padStart(2, "0");
      if (
        gates.filter(([a, op, b]) =>
          op === "XOR" &&
          ((a === `x${levelKey}` && b === `y${levelKey}`) ||
            (b === `x${levelKey}` && a === `y${levelKey}`))
        ).length === 0
      ) {
        return false;
      }
    }

    // there must be one XOR with z${level} gate.
    if (expected.xor > 0 && expected.xor === xor) {
      const levelKey = level.toString().padStart(2, "0");
      if (
        gates.filter(([, op, , w]) => op === "XOR" && w === `z${levelKey}`)
          .length === 0
      ) {
        return false;
      }
    }

    return and === expected.and && or === expected.or && xor === expected.xor;
  }

  findBuggyLevels(): number[] {
    const levels = this.getGatesAtEachLevel();
    const buggyLevels = [];

    const maxZ = this.maxZVar();

    for (const [level, gates] of levels) {
      if (!this.validLevel(level, maxZ, gates)) {
        buggyLevels.push(level);
      }
    }

    return buggyLevels.sort();
  }

  findSwapsAtLevel(levels: number[]): [string, string][] {
    const gatesAtlevels = this.getGatesAtEachLevel();
    const swaps = [];
    const swappedLevels = new Set<number>();

    let nBuggyLevels = levels.length;

    for (let i = 0; i < levels.length; i++) {
      if (swappedLevels.has(levels[i])) continue;
      const gatesI = gatesAtlevels.get(levels[i])!;
      for (let j = i + 1; j < levels.length; j++) {
        if (swappedLevels.has(levels[j])) continue;
        const gatesJ = gatesAtlevels.get(levels[j])!;
        for (
          const [gateI, gateJ] of gatesI.flatMap((a1) =>
            gatesJ.map((a2) => [a1, a2])
          )
        ) {
          this.swap(gateI[3], gateJ[3]);
          const currentBuggyLevels = this.findBuggyLevels();
          if (nBuggyLevels == currentBuggyLevels.length + 2) {
            nBuggyLevels = currentBuggyLevels.length;
            swaps.push([gateI[3], gateJ[3]] as [string, string]);
            swappedLevels.add(levels[i]);
            swappedLevels.add(levels[j]);
            break;
          } else {
            this.swap(gateI[3], gateJ[3]);
          }
        }
      }
    }

    return swaps;
  }

  findSwaps(): [string, string][] {
    const buggyLevels = this.findBuggyLevels();
    return this.findSwapsAtLevel(buggyLevels);
  }
}

export function parse(
  data: string,
): Device {
  const [wires, gates] = data.trim().split("\n\n") as [string, string];
  return new Device(
    wires.split("\n").map((line) => {
      const [wire, value] = line.split(": ");
      return [wire, Number(value)];
    }),
    gates.split("\n").map((line) => {
      const [lhs, rhs] = line.split(" -> ");
      const [a, op, b] = lhs.split(" ");
      return [a, op, b, rhs];
    }),
  );
}

export function solve1(data: Device): bigint {
  return data.compute();
}

export function solve2(data: Device): string {
  return data.findSwaps().flat().sort().join(",");
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
