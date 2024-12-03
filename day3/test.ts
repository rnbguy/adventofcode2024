import { assertEquals } from "@std/assert";
import { solve1, solve2 } from "./mod.ts";

Deno.test(async function testExample() {
  const example_data_path = new URL("example.txt", import.meta.url).pathname;
  const example_data = await Deno.readTextFile(example_data_path);
  assertEquals(solve1(example_data), 161);
  // assertEquals(solve2(example_data), 0);
});
