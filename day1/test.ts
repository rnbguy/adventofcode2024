import { assertEquals } from "@std/assert";
import { process_data, solve } from "./mod.ts";

Deno.test(async function day1() {
  const raw_data = await Deno.readTextFile("day1/example.txt");
  assertEquals(solve(process_data(raw_data)), 11);
});
