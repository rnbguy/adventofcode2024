export function parse(data: string): bigint[] {
  return data.trim().split("\n").map(BigInt);
}

function mixAndPrune(a: bigint, b: bigint): bigint {
  return (a ^ b) % 16777216n;
}

function nextRandom(one: bigint): bigint {
  const two = mixAndPrune(one, one << 6n);
  const three = mixAndPrune(two, two >> 5n);
  const four = mixAndPrune(three, three << 11n);
  return four;
}

function nthRandom(seed: bigint, n: number): bigint {
  let current = seed;
  for (let i = 0; i < n; i++) {
    current = nextRandom(current);
  }
  return current;
}

export function solve1(data: bigint[]): bigint {
  return data.map((seed) => nthRandom(seed, 2000)).reduce((a, b) => a + b, 0n);
}

export function solve2(data: bigint[]): number {
  return data.length;
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
