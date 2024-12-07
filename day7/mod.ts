export function parse(data_r: string): [number, number[]][] {
  const data = data_r.trim();
  return data.split("\n").map((line) => {
    const [a, b] = line.split(":");
    return [Number(a.trim()), b.trim().split(" ").map(Number)];
  });
}

function solve1Rec(value: number, remaining: number[]): boolean {
  if (remaining.length === 1) {
    return remaining[0] === value;
  }
  const [head, ...tail] = remaining;
  // input is reversed
  //   tail + head = value
  //   tail * head = value
  return (head <= value && solve1Rec(value - head, tail)) ||
    (value % head == 0 && solve1Rec(value / head, tail));
}

function trimSuffix(big: number, small: number): number | undefined {
  const bigLen = Math.floor(Math.log10(big)) + 1;
  const smallLen = Math.floor(Math.log10(small)) + 1;
  if (smallLen < bigLen) {
    const suffix = big % Math.pow(10, smallLen);
    if (suffix === small) {
      return Math.floor(big / Math.pow(10, smallLen));
    }
  }
}

function solve2Rec(value: number, remaining: number[]): boolean {
  if (remaining.length === 1) {
    return remaining[0] === value;
  }
  const [head, ...tail] = remaining;
  // input is reversed
  //   tail + head = value
  //   tail * head = value
  //   tail | head = value
  const newValue = trimSuffix(value, head);
  return (newValue !== undefined && solve1Rec(newValue!, tail)) ||
    (head <= value && solve2Rec(value - head, tail)) ||
    (value % head == 0 && solve2Rec(value / head, tail));
}

export function solve1(data: [number, number[]][]): number {
  return data.filter((ecase) => {
    // reverse will reverse the array in place too
    return solve1Rec(ecase[0], ecase[1].slice().reverse());
  }).reduce((acc, [value, _]) => acc + value, 0);
}

export function solve2(data: [number, number[]][]): number {
  return data.filter((ecase) => {
    // reverse will reverse the array in place too
    return solve2Rec(ecase[0], ecase[1].slice().reverse());
  }).reduce((acc, [value, _]) => acc + value, 0);
}

if (import.meta.main) {
  const data_path = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(data_path));
  console.log(solve1(data));
  console.log(solve2(data));
}
