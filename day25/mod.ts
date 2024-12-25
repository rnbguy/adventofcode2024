import { assert } from "@std/assert";

type Pins = [number, number, number, number, number];

class Schematics {
  locks: Pins[] = [];
  keys: Pins[] = [];

  addLock(lock: Pins) {
    this.locks.push(lock);
  }

  addKey(key: Pins) {
    this.keys.push(key);
  }

  add(raw: string) {
    const lines = raw.trim().split("\n");
    assert(lines.length === 7);
    assert(lines.every((line) => line.length === 5));

    if (lines[0] === "#####" || lines[lines.length - 1] === "#####") {
      const pins = [-1, -1, -1, -1, -1] as Pins;
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 7; j++) {
          if (lines[j][i] === "#") {
            pins[i]++;
          }
        }
      }
      if (lines[0] === "#####") {
        this.addLock(pins);
      } else if (lines[lines.length - 1] === "#####") {
        this.addKey(pins);
      }
    } else {
      assert(false);
    }
  }

  doesFit(lock: Pins, key: Pins): boolean {
    for (let i = 0; i < 5; i++) {
      if (lock[i] + key[i] > 5) {
        return false;
      }
    }
    return true;
  }
}

export function parse(
  data: string,
): Schematics {
  const schematics = new Schematics();
  data.trim().split("\n\n").forEach((raw) => schematics.add(raw.trim()));
  return schematics;
}

export function solve1(data: Schematics): number {
  const matches = data.locks.map((lock) =>
    data.keys.map((key) => [lock, key, data.doesFit(lock, key)])
  ).flat().filter(([, , fits]) => fits);
  return matches.length;
}

if (import.meta.main) {
  const dataPath = new URL("input.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  console.log(solve1(data));
}
