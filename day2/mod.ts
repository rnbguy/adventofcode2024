export function process_data(data: string): number[][] {
  const parsed = data.split("\n").map((x) =>
    x.split(" ").map((x) => parseInt(x))
  );
  return parsed
    // Remove the last element, which is an empty string
    .slice(0, parsed.length - 1);
}

function is_safe(report: number[]): boolean {
  const diffs = Array.from({ length: report.length - 1 }, (_, i) => {
    return (report[i + 1] - report[i]);
  });

  if (diffs[0] === 0) {
    return false;
  }

  const direction = diffs[0] / Math.abs(diffs[0]);

  return diffs.every((x) => {
    return 1 <= x / direction && x / direction <= 3;
  });
}

export function solve1(data: number[][]): number {
  return data.filter(is_safe)
    .length;
}

export function solve2(data: number[][]): number {
  return data.filter((report) => {
    return Array.from({ length: report.length }, (_, i) => {
      return report.slice(0, i).concat(report.slice(i + 1));
    }).some(is_safe);
  }).length;
}

if (import.meta.main) {
  const data_path = new URL("input.txt", import.meta.url).pathname;
  const data = await Deno.readTextFile(data_path);
  console.log(solve1(process_data(data)));
  console.log(solve2(process_data(data)));
}
