export const regex1 = /mul\(([0-9]{1,3}),([0-9]{1,3})\)/g;
export const regex2 = /do(?:n't)?\(\)|mul\(([0-9]{1,3}),([0-9]{1,3})\)/g;

export function solve1(data: string): number {
  return data.matchAll(regex1).map(([_, a, b]) => Number(a) * Number(b)).reduce(
    (acc, val) => acc + val,
    0,
  );
}

export function solve2(data: string): number {
  let isEnabled = true;
  return data.matchAll(regex2).map(([m, a, b]) => {
    if (m === "do()") {
      isEnabled = true;
      return 0;
    } else if (m === "don't()") {
      isEnabled = false;
      return 0;
    } else {
      if (isEnabled) {
        return Number(a) * Number(b);
      } else return 0;
    }
  }).reduce((acc, val) => acc + val, 0);
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = await Deno.readTextFile(dataPath);
  console.log(solve1(data));
  console.log(solve2(data));
}
