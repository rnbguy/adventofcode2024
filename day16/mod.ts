type Elem = "S" | "E" | "." | "#";

export function parse(data: string): Elem[][] {
  return data.trim().split("\n").map((line) => line.trim().split("") as Elem[]);
}

export function solve1(data: Elem[][]): number {
  return data.length * data[0].length;
}

export function solve2(data: Elem[][]): number {
  return data.length * data[0].length;
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
