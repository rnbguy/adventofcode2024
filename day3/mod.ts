export const regex1 = /mul\(([0-9]{1,3}),([0-9]{1,3})\)/g;
export const regex2 = /do(?:n't)?\(\)|mul\(([0-9]{1,3}),([0-9]{1,3})\)/g;

export function solve1(data: string): number {
  return data.matchAll(regex1).map((match) => {
    const [_, a, b] = match;
    return Number(a) * Number(b);
  }).reduce((acc, val) => acc + val, 0);
}

export function solve2(data: string): number {
  let is_enabled = true;
  return data.matchAll(regex2).map((match) => {
    const [m, a, b] = match;

    if (m === "do()") {
      is_enabled = true;
      return 0;
    } else if (m === "don't()") {
      is_enabled = false;
      return 0;
    } else {
      if (is_enabled) {
        return Number(a) * Number(b);
      } else return 0;
    }
  }).reduce((acc, val) => acc + val, 0);
}

if (import.meta.main) {
  const data_path = new URL("input.txt", import.meta.url).pathname;
  const data = await Deno.readTextFile(data_path);
  console.log(solve1(data));
  console.log(solve2(data));
}
