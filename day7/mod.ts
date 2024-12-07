export function parse(data_r: string): [number, number[]][] {
  const data = data_r.trim();
  return data.split("\n").map((line) => {
    const ecase = line.split(":");
    return [Number(ecase[0]), ecase[1].split(",").map(Number)];
  });
}

export function solve1(data: [number, number[]][]): number {
  return data.length;
}

export function solve2(data: [number, number[]][]): number {
  return data.length;
}

if (import.meta.main) {
  const data_path = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(data_path));
  console.log(solve1(data));
  console.log(solve2(data));
}
