import { assertEquals } from "@std/assert";
import { solve1, solve2 } from "./mod.ts";

Deno.test(async function testExample() {
  const dataPath1 = new URL("example1.txt", import.meta.url).pathname;
  const data1 = await Deno.readTextFile(dataPath1);
  assertEquals(solve1(data1), 161);

  const dataPath2 = new URL("example2.txt", import.meta.url).pathname;
  const data2 = await Deno.readTextFile(dataPath2);
  assertEquals(solve2(data2), 48);
});
