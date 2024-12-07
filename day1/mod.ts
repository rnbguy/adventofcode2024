export function parse(data: string): number[][] {
  const parsed = data.trim().split("\n").map((x) =>
    // 3 spaces between the numbers
    x.split("   ").map((x) => parseInt(x))
  );
  return parsed
    .map((x) => [x[0], x[1]]);
}

export function solve1(data: number[][]): number {
  const left_nums = data.map((x) => x[0]);
  const right_nums = data.map((x) => x[1]);

  const sorted_left_nums = left_nums.sort((a, b) => a - b);
  const sorted_right_nums = right_nums.sort((a, b) => a - b);

  return Array.from({ length: data.length }, (_, i) => i)
    .reduce(
      (acc, i) => acc + Math.abs(sorted_left_nums[i] - sorted_right_nums[i]),
      0,
    );
}

export function solve2(data: number[][]): number {
  const left_nums = data.map((x) => x[0]);
  const right_nums = data.map((x) => x[1]);

  const right_count = right_nums.reduce<Record<number, number>>(
    (acc, x) => {
      acc[x] = (acc[x] || 0) + 1;
      return acc;
    },
    {},
  );

  return left_nums.reduce(
    (acc, x) => {
      return acc + (x * (right_count[x] || 0));
    },
    0,
  );
}

if (import.meta.main) {
  const data_path = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(data_path));
  console.log(solve1(data));
  console.log(solve2(data));
}
