import { assertEquals } from "@std/assert";
import { parse, solve1 } from "./mod.ts";

Deno.test(async function testExample() {
  const dataPath = new URL("example.txt", import.meta.url).pathname;
  const data = parse(await Deno.readTextFile(dataPath));
  assertEquals(solve1(data), "4,6,3,5,6,3,5,2,1,0");
  // no test for solve2. it works only on the input.txt
});
