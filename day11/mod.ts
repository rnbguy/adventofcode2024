export function parse(data: string): number[] {
  return data.trim().split(" ").map(Number);
}

function transform(x: number): number[] {
  if (x == 0) {
    return [1];
  }
  const numDigits = Math.floor(Math.log10(x)) + 1;
  if (numDigits % 2 == 0) {
    // split in two equal parts
    const half = numDigits / 2;
    const a = Math.floor(x / Math.pow(10, half));
    const b = x % Math.pow(10, half);
    return [a, b];
  } else {
    return [x * 2024];
  }
}

function solve(data: number[], nBlink: number): number {
  const mm = new Map<number, Map<number, number>>();

  function blink(x: number, n: number): number {
    if (n == 0) {
      return 1;
    }

    if (!mm.has(x)) {
      mm.set(x, new Map<number, number>());
    }

    if (mm.get(x)!.has(n)) {
      return mm.get(x)!.get(n)!;
    }

    let count = 0;

    for (const y of transform(x)) {
      count += blink(y, n - 1);
    }

    mm.get(x)!.set(n, count);

    return count;
  }

  return data.map((x) => blink(x, nBlink)).reduce((a, b) => a + b, 0);
}

export function solve1(data: number[]): number {
  return solve(data, 25);
}

export function solve2(data: number[]): number {
  return solve(data, 75);
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
