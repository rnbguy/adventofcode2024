export function parse(data: string): number[][] {
  return data.trim().split("\n").map((x) =>
    x.split(" ").map((x) => parseInt(x))
  );
}

function is_safe(report: number[]): boolean {
  const diffs = Array.from(
    { length: report.length - 1 },
    (_, i) => report[i + 1] - report[i],
  );

  if (diffs[0] === 0) {
    return false;
  }

  const direction = diffs[0] / Math.abs(diffs[0]);

  return diffs.every((x) => 1 <= x / direction && x / direction <= 3);
}

export function solve1(data: number[][]): number {
  return data.filter(is_safe)
    .length;
}

export function solve2(data: number[][]): number {
  return data.filter((report) =>
    Array.from(
      { length: report.length },
      (_, i) => report.slice(0, i).concat(report.slice(i + 1)),
    ).some(is_safe)
  ).length;
}

if (import.meta.main) {
  const data_path = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(data_path));
  console.log(solve1(data));
  console.log(solve2(data));
}
