export function parse(data: string): number[] {
  return data.trim().split("").map(Number);
}

export function solve1(rdata: number[]): number {
  const data = rdata.slice();

  let lId = 0;
  let rId = Math.floor(data.length - 1) / 2;

  const disk = [];

  while (lId < rId) {
    disk.push([lId, data[lId * 2]]);
    data[lId * 2] = 0;
    while (data[lId * 2 + 1] > 0) {
      if (data[rId * 2] <= data[lId * 2 + 1]) {
        // enough space
        disk.push([rId, data[rId * 2]]);
        data[lId * 2 + 1] -= data[rId * 2];
        data[rId * 2] = 0;
        rId--;
      } else {
        // not enough space
        if (lId + 1 === rId) {
          // if last round, we can just add the remaining data
          // ..666 becomes 666..
          disk.push([rId, data[(lId + 1) * 2]]);
        } else {
          disk.push([rId, data[lId * 2 + 1]]);
        }
        data[rId * 2] -= data[lId * 2 + 1];
        data[lId * 2 + 1] = 0;
      }
    }
    lId++;
  }

  let index = 0;
  let count = 0;

  for (const [id, idCount] of disk) {
    count += id * ((idCount * index) + (((idCount - 1) * idCount) / 2));
    index += idCount;
  }

  return count;
}

export function solve2(data: number[]): number {
  return data.length;
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
