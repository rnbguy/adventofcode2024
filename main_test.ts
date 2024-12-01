import { assertEquals } from "@std/assert";
import { hello } from "@scope/day";

Deno.test(function helloTest() {
  assertEquals(hello("world"), "Hello, world!");
});
