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

  run(): number[] {
    const data = this.clone();
    const output: number[] = [];
    let instructionPointer = 0;

    while (instructionPointer < data.program.length) {
      const opcode = data.program[instructionPointer];
      const operand = data.program[instructionPointer + 1];

      switch (opcode) {
        case 0: { // adv
          const divisor = Math.pow(2, data.getComboOperandValue(operand));
          data.a = Math.trunc(data.a / divisor);
          instructionPointer += 2;
          break;
        }
        case 1: { // bxl
          data.b ^= operand;
          instructionPointer += 2;
          break;
        }
        case 2: { // bst
          data.b = data.getComboOperandValue(operand) % 8;
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
          output.push(data.getComboOperandValue(operand) % 8);
          instructionPointer += 2;
          break;
        }
        case 6: { // bdv
          const divisor = Math.pow(2, data.getComboOperandValue(operand));
          data.b = Math.trunc(data.a / divisor);
          instructionPointer += 2;
          break;
        }
        case 7: { // cdv
          const divisor = Math.pow(2, data.getComboOperandValue(operand));
          data.c = Math.trunc(data.a / divisor);
          instructionPointer += 2;
          break;
        }
        default:
          throw new Error(`Invalid opcode: ${opcode}`);
      }
    }

    return output;
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
  return data.run().join(",");
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
