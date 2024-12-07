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

  x_len(): number {
    return this.grid[0].length;
  }

  y_len(): number {
    return this.grid.length;
  }

  get(x: number, y: number): string {
    return this.grid[y]?.[x] ?? "";
  }

  find_xmas_at(x: number, y: number): number {
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

  is_x_mas_at(x: number, y: number): boolean {
    return [-1, 1].some((d) =>
      this.get(x - d, y - d) + this.get(x, y) +
          this.get(x + d, y + d) == MAS
    ) &&
      [-1, 1].some((d) =>
        this.get(x - d, y + d) + this.get(x, y) +
            this.get(x + d, y - d) == MAS
      );
  }

  find_all_xmas(): number {
    let count = 0;
    for (let x = 0; x < this.x_len(); x++) {
      for (let y = 0; y < this.y_len(); y++) {
        count += this.find_xmas_at(x, y);
      }
    }
    return count;
  }

  find_all_x_mas(): number {
    let count = 0;
    for (let y = 0; y < this.y_len(); y++) {
      for (let x = 0; x < this.x_len(); x++) {
        if (this.is_x_mas_at(x, y)) {
          count++;
        }
      }
    }
    return count;
  }
}

export function solve1(data: string[]): number {
  const grid = new Grid(data);
  return grid.find_all_xmas();
}

export function solve2(data: string[]): number {
  const grid = new Grid(data);
  return grid.find_all_x_mas();
}

if (import.meta.main) {
  const data_path = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(data_path));
  console.log(solve1(data));
  console.log(solve2(data));
}
