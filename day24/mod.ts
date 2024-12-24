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

export function solve2(data: Device): number {
  return data.input.length * data.gates.length;
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
