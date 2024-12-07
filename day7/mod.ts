export function parse(data_r: string): [number, number[]][] {
  const data = data_r.trim();
  return data.split("\n").map((line) => {
    const [a, b] = line.split(":");
    return [Number(a.trim()), b.trim().split(" ").map(Number)];
  });
}

function solve1_util(value: number, remaining: number[]): boolean {
  if (remaining.length === 1) {
    return remaining[0] === value;
  }
  const [head, ...tail] = remaining;
  // input is reversed
  //   tail + head = value
  //   tail * head = value
  return (head <= value && solve1_util(value - head, tail)) ||
    (value % head == 0 && solve1_util(value / head, tail));
}

function solve2_util(value: number, remaining: number[]): boolean {
  if (remaining.length === 1) {
    return remaining[0] === value;
  }
  const [head, ...tail] = remaining;
  // input is reversed
  //   tail + head = value
  //   tail * head = value
  //   tail | head = value
  const value_str = value.toString();
  const head_str = head.toString();
  if (value_str.length > head_str.length && value_str.endsWith(head_str)) {
    const new_value_str = value_str.slice(
      0,
      value_str.length - head_str.length,
    );
    const new_value = Number(new_value_str);
    if (solve2_util(new_value, tail)) {
      return true;
    }
  }
  return (head <= value && solve2_util(value - head, tail)) ||
    (value % head == 0 && solve2_util(value / head, tail));
}

export function solve1(data: [number, number[]][]): number {
  return data.filter((ecase) => {
    // reverse will reverse the array in place too
    return solve1_util(ecase[0], ecase[1].slice().reverse());
  }).reduce((acc, [value, _]) => acc + value, 0);
}

export function solve2(data: [number, number[]][]): number {
  return data.filter((ecase) => {
    // reverse will reverse the array in place too
    return solve2_util(ecase[0], ecase[1].slice().reverse());
  }).reduce((acc, [value, _]) => acc + value, 0);
}

if (import.meta.main) {
  const data_path = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(data_path));
  console.log(solve1(data));
  console.log(solve2(data));
}
