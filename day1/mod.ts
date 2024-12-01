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

export function solve(data: number[][]): number {
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

if (import.meta.main) {
  const raw_data = await Deno.readTextFile("day1/input.txt");
  console.log(solve(process_data(raw_data)));
}
