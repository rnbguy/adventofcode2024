export function solve1(_data: string): number {
  return 0;
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
