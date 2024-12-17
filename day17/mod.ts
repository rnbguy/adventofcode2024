const PATTERN =
  /Register A: (\d+)\nRegister B: (\d+)\nRegister C: (\d+)\n\nProgram: (\d+(?:,\d+)*)/;

class Computer {
  a: number;
  b: number;
  c: number;
  program: number[];

  constructor(a: number, b: number, c: number, program: number[]) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.program = program;
  }
}

export function parse(data: string): Computer {
  const [_m, a, b, c, program] = data.match(PATTERN)!;
  return new Computer(
    Number(a),
    Number(b),
    Number(c),
    program.split(",").map(Number),
  );
}

export function solve1(data: Computer): number {
  return data.program.length;
}

export function solve2(data: Computer): number {
  return data.program.length;
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
