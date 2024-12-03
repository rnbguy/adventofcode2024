import { assertEquals } from "@std/assert";
import { solve1, solve2 } from "./mod.ts";

Deno.test(async function testExample() {
  const example_data_path_1 = new URL("example1.txt", import.meta.url).pathname;
  const example_data_1 = await Deno.readTextFile(example_data_path_1);
  assertEquals(solve1(example_data_1), 161);

  const example_data_path_2 = new URL("example2.txt", import.meta.url).pathname;
  const example_data_2 = await Deno.readTextFile(example_data_path_2);
  assertEquals(solve2(example_data_2), 48);
});
