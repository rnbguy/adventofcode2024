export function process_data(data: string): number[][] {
  const parsed = data.split("\n").map((x) =>
    x.split(" ").map((x) => parseInt(x))
  );
  return parsed
    // Remove the last element, which is an empty string
    .slice(0, parsed.length - 1)
    // Three spaces are used to separate the numbers
    .map((x) => [x[0], x[3]]);
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
  const raw_data_1 = await Deno.readTextFile("day1/input.txt");
  console.log(solve1(process_data(raw_data_1)));
  const raw_data_2 = await Deno.readTextFile("day1/input.txt");
  console.log(solve2(process_data(raw_data_2)));
}
