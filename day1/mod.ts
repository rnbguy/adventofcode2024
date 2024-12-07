export function parse(data: string): number[][] {
  const parsed = data.trim().split("\n").map((x) =>
    // 3 spaces between the numbers
    x.split("   ").map((x) => parseInt(x))
  );
  return parsed
    .map((x) => [x[0], x[1]]);
}

export function solve1(data: number[][]): number {
  const leftNums = data.map((x) => x[0]);
  const rightNums = data.map((x) => x[1]);

  const sortedLeftNums = leftNums.sort((a, b) => a - b);
  const sortedRightNums = rightNums.sort((a, b) => a - b);

  return Array.from({ length: data.length }, (_, i) => i)
    .reduce(
      (acc, i) => acc + Math.abs(sortedLeftNums[i] - sortedRightNums[i]),
      0,
    );
}

export function solve2(data: number[][]): number {
  const leftNums = data.map((x) => x[0]);
  const rightNums = data.map((x) => x[1]);

  const rightCount = rightNums.reduce<Record<number, number>>(
    (acc, x) => {
      acc[x] = (acc[x] || 0) + 1;
      return acc;
    },
    {},
  );

  return leftNums.reduce(
    (acc, x) => acc + (x * (rightCount[x] || 0)),
    0,
  );
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
