import { assertEquals } from "@std/assert";
import { process_data, solve1, solve2 } from "./mod.ts";

Deno.test(async function day1() {
  const raw_data = await Deno.readTextFile("day1/example.txt");
  assertEquals(solve1(process_data(raw_data)), 11);
  assertEquals(solve2(process_data(raw_data)), 31);
});
