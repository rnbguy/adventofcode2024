const XMAS: string = "XMAS";
const MAS: string = "MAS";

export function parse(data: string): string[] {
  return data.trim().split("\n");
}

class Grid {
  grid: string[];
  constructor(grid: string[]) {
    this.grid = grid;
  }

  width(): number {
    return this.grid[0].length;
  }

  height(): number {
    return this.grid.length;
  }

  get(x: number, y: number): string {
    return this.grid[y]?.[x] ?? "";
  }

  findXMasAt(x: number, y: number): number {
    let count = 0;

    for (const dx of [-1, 0, 1]) {
      for (const dy of [-1, 0, 1]) {
        if (dx === 0 && dy === 0) continue;

        if (
          Array.from({ length: XMAS.length }).every((_, i) => {
            const xx = x + dx * i;
            const yy = y + dy * i;

            return this.get(xx, yy) == XMAS[i];
          })
        ) {
          count++;
        }
      }
    }

    return count;
  }

  isXAndMasAt(x: number, y: number): boolean {
    return [-1, 1].some((d) =>
      this.get(x - d, y - d) + this.get(x, y) +
          this.get(x + d, y + d) == MAS
    ) &&
      [-1, 1].some((d) =>
        this.get(x - d, y + d) + this.get(x, y) +
            this.get(x + d, y - d) == MAS
      );
  }

  findAllXmas(): number {
    let count = 0;
    for (let x = 0; x < this.width(); x++) {
      for (let y = 0; y < this.height(); y++) {
        count += this.findXMasAt(x, y);
      }
    }
    return count;
  }

  findAllXAndMas(): number {
    let count = 0;
    for (let y = 0; y < this.height(); y++) {
      for (let x = 0; x < this.width(); x++) {
        if (this.isXAndMasAt(x, y)) {
          count++;
        }
      }
    }
    return count;
  }
}

export function solve1(data: string[]): number {
  const grid = new Grid(data);
  return grid.findAllXmas();
}

export function solve2(data: string[]): number {
  const grid = new Grid(data);
  return grid.findAllXAndMas();
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
  console.log(solve2(data));
}
