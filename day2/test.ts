import { assertEquals } from "@std/assert";
import { process_data, solve1, solve2 } from "./mod.ts";

Deno.test(async function testExample() {
  const example_data_path = new URL("example.txt", import.meta.url).pathname;
  const example_data = await Deno.readTextFile(example_data_path);
  assertEquals(solve1(process_data(example_data)), 2);
  assertEquals(solve2(process_data(example_data)), 4);
});
