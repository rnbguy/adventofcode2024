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

function nRandom(seed: bigint, n: number): bigint[] {
  return Array.from({ length: n }, (_, i) => i).reduce((acc, _) => {
    acc.push(nextRandom(acc[acc.length - 1]));
    return acc;
  }, [seed]);
}

export function solve1(data: bigint[]): bigint {
  return data.map((seed) => nRandom(seed, 2000)[2000]).reduce(
    (a, b) => a + b,
    0n,
  );
}

export function solve2(data: bigint[]): number {
  const patterns = data.map((seed) => {
    const ar = nRandom(seed, 2000).map((x) => Number(x % 10n));
    const diffs = Array.from(
      { length: ar.length - 1 },
      (_, i) => [ar[i + 1], ar[i + 1] - ar[i]],
    );

    const patternMap = new Map<string, number>();
    for (let i = diffs.length - 4; i >= 0; i--) {
      const price = diffs[i + 3][0];
      const diffPattern = diffs.slice(i, i + 4).map((x) => x[1]);
      patternMap.set(diffPattern.join(","), price);
    }
    return patternMap;
  });

  const mergePatterns = new Map<string, number>();

  for (const pattern of patterns) {
    for (const [key, value] of pattern) {
      mergePatterns.set(key, (mergePatterns.get(key) ?? 0) + value);
    }
  }

  const [, ans] = mergePatterns.entries().reduce(
    ([accKey, accValue], [key, value]) => {
      if (accValue < value) {
        return [key, value];
      } else {
        return [accKey, accValue];
      }
    },
    ["", 0],
  );

  return ans;
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
