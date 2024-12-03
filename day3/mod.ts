export const regex = /mul\(([0-9]{1,3}),([0-9]{1,3})\)/g;

export function solve1(data: string): number {
  return data.matchAll(regex).map((match) => {
    const [_, a, b] = match;
    return Number(a) * Number(b);
  }).reduce((acc, val) => acc + val, 0);
}

export function solve2(_data: string): number {
  return 0;
}

if (import.meta.main) {
  const data_path = new URL("input.txt", import.meta.url).pathname;
  const data = await Deno.readTextFile(data_path);
  console.log(solve1(data));
  console.log(solve2(data));
}
