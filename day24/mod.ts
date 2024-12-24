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

export function solve1(data: Device): number {
  return data.input.length * data.gates.length;
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
