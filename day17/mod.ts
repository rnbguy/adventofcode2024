import { assert } from "@std/assert/assert";

const PATTERN =
  /Register A: (\d+)\nRegister B: (\d+)\nRegister C: (\d+)\n\nProgram: (\d+(?:,\d+)*)/;

class Computer {
  a: bigint;
  b: bigint;
  c: bigint;
  program: number[];

  constructor(a: bigint, b: bigint, c: bigint, program: number[]) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.program = program;
  }

  getComboOperandValue(
    operand: number,
  ): bigint {
    switch (operand) {
      case 0:
      case 1:
      case 2:
      case 3:
        return BigInt(operand);
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

  run(): { a: bigint; b: bigint; c: bigint; output: bigint[] } {
    const data = this.clone();
    const output: bigint[] = [];
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
          data.b ^= BigInt(operand);
          instructionPointer += 2;
          break;
        }
        case 2: { // bst
          data.b = data.getComboOperandValue(operand) & 0b111n;
          instructionPointer += 2;
          break;
        }
        case 3: { // jnz
          if (data.a === 0n) {
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
          output.push(data.getComboOperandValue(operand) & 0b111n);
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
    BigInt(a),
    BigInt(b),
    BigInt(c),
    program.split(",").map(Number),
  );
}

export function solve1(data: Computer): string {
  return data.run().output.join(",");
}

export function solve2(data: Computer): bigint {
  const needle = Array.from({ length: data.program.length }, (_, _i) => 0);
  needle[needle.length - 1] = 1;

  function util(needle: number[], branchIndex: number): boolean {
    // checking at branchIndex
    const initValue = needle[branchIndex];
    for (let val = needle[branchIndex]; val < 8; val++) {
      needle[branchIndex] = val;
      const tryA = needle.reduceRight((acc, v) => (acc << 3n) | BigInt(v), 0n);
      data.a = tryA;
      const { a: aNext, output } = data.run();
      assert(output.length === data.program.length);
      assert(aNext === 0n);
      // find the last index where output[i] !== data.program[i]
      let diffIndex = output.findLastIndex((v, j) =>
        v !== BigInt(data.program[j])
      );
      if (diffIndex === -1) {
        return true;
      }
      for (; diffIndex < branchIndex; diffIndex++) {
        if (util(needle, diffIndex)) {
          return true;
        }
      }
    }
    needle[branchIndex] = initValue;
    return false;
  }

  assert(util(needle, needle.length - 1));

  return needle.reduceRight((acc, v) => acc << 3n | BigInt(v), 0n);
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
