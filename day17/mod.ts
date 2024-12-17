import { assert } from "@std/assert/assert";

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

  getComboOperandValue(
    operand: number,
  ): number {
    switch (operand) {
      case 0:
      case 1:
      case 2:
      case 3:
        return operand;
      case 4:
        return this.a;
      case 5:
        return this.b;
      case 6:
        return this.c;
      default:
        throw new Error(`Invalid combo operand: ${operand}`);
    }
  }

  clone(): Computer {
    return new Computer(this.a, this.b, this.c, this.program.slice());
  }

  run(): { a: number; b: number; c: number; output: number[] } {
    const data = this.clone();
    const output: number[] = [];
    let instructionPointer = 0;

    while (instructionPointer < data.program.length) {
      const opcode = data.program[instructionPointer];
      const operand = data.program[instructionPointer + 1];

      switch (opcode) {
        case 0: { // adv
          data.a = data.a >> data.getComboOperandValue(operand);
          instructionPointer += 2;
          break;
        }
        case 1: { // bxl
          data.b ^= operand;
          instructionPointer += 2;
          break;
        }
        case 2: { // bst
          data.b = data.getComboOperandValue(operand) & 0b111;
          instructionPointer += 2;
          break;
        }
        case 3: { // jnz
          if (data.a === 0) {
            instructionPointer += 2;
          } else {
            instructionPointer = operand;
          }
          break;
        }
        case 4: { // bxc
          data.b ^= data.c;
          instructionPointer += 2;
          break;
        }
        case 5: { // out
          output.push(data.getComboOperandValue(operand) & 0b111);
          instructionPointer += 2;
          break;
        }
        case 6: { // bdv
          data.b = data.a >> data.getComboOperandValue(operand);
          instructionPointer += 2;
          break;
        }
        case 7: { // cdv
          data.c = data.a >> data.getComboOperandValue(operand);
          instructionPointer += 2;
          break;
        }
        default:
          throw new Error(`Invalid opcode: ${opcode}`);
      }
    }

    return { a: data.a, b: data.b, c: data.c, output };
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

export function solve1(data: Computer): string {
  return data.run().output.join(",");
}

export function solve2(data: Computer): number {
  const initB = data.b;
  const initC = data.c;

  // (currentB, currentOutput) => [(currentA, nextB, nextC)]
  const cache = new Map<string, [number, number, number][]>();

  for (let a = 0; a < 8; a++) {
    for (let b = 0; b < 8; b++) {
      for (let c = 0; c < 8; c++) {
        data.a = a;
        data.b = b;
        data.c = c;
        const { a: nextA, b: nextB, c: nextC, output } = data.run();
        assert(output.length === 1);
        assert(nextA === 0);

        const key = `${b},${c},${output[0]}`;

        if (!cache.has(key)) {
          cache.set(key, []);
        }

        cache.get(key)!.push([a, nextB, nextC]);
      }
    }
  }

  let allChains = new Map<string, number[][]>();

  data.program.forEach((out, i) => {
    const key = `${initB},${initC},${out}`;

    if (i === 0) {
      for (const [a, nextB, nextC] of cache.get(key)!) {
        const subKey = `${nextB},${nextC}`;
        allChains.set(subKey, [[a]]);
      }
    } else {
      const newAllChains = new Map<string, number[][]>();

      for (const [bcKey, chainA] of allChains) {
        const key = `${bcKey},${out}`;
        if (cache.has(key)) {
          for (const [a, nextB, nextC] of cache.get(key)!) {
            const subKey = `${nextB},${nextC}`;
            if (!newAllChains.has(subKey)) {
              newAllChains.set(subKey, []);
            }
            newAllChains.get(subKey)!.push(...chainA.map((v) => [a, ...v]));
          }
        }
      }

      allChains = newAllChains;
    }
  });

  return allChains.values().flatMap((v) => v).map((as) =>
    as.reduce((acc, v) => acc << 3 | v, 0)
  )
    .reduce((acc, v) => {
      if (acc === 0 || v < acc) {
        return v;
      } else {
        return acc;
      }
    }, 0);
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
