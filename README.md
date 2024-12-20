# adventofcode2024

[![Deno](https://img.shields.io/badge/Deno-000?logo=deno&logoColor=70ffaf)][deno]
[![CI](https://github.com/rnbguy/adventofcode2024/actions/workflows/deno.yaml/badge.svg)](https://github.com/rnbguy/adventofcode2024/actions/workflows/deno.yaml)

This repo contains [typescript][tc] solutions for the
[Advent of Code 2024][aoc2024] puzzles. The scripts are written to executed in
the [Deno][deno] runtime.

## Context

I have been using Deno for a while for personal scripting needs. Also, I always
wanted to finish the Advent of Code puzzles. So, I decided to give a shot at
solving this year's AoC using typescript. This way I can improve my typescript
as well as solve the puzzles.

## Thoughts

### Typescript

So far, my experience with typescript has been subpar at solving AoC puzzles.
Deno is a great runtime, but the typescript has been a bit of a pain to write
data structures and algorithms. Coming from the Rust ecosystem, I missed some
features very much.

- Data is passed using references implicitly. If I change some value in a
  function, it changes the value in the caller function. Rust uses immutable
  borrow for this.
- No hash function for objects. The `Map` and `Set` data structures uses object
  pointers for keys. So I can have `new Set([[1, 2], [1, 2]])` with size 2
  because the two arrays are different objects, even though they have the same
  values. I had to use string keys for objects when using them as keys in a map
  or set.
- No standard data structure libraries. I had to maintain my own set, maps and
  other data structures.
  - Must say that `jsr:@std/data-structures` helped me with `BinaryHeap`.
- Not strong typing and type inference. I had to write concrete types at some
  places.
- Not strong pattern matching. I missed Rust's pattern matching very much.
- No pairs, tuples or constant size arrays.
- Footguns like `==` and `===` or `const elem of array` and
  `const elem in array`.

### Deno

Deno has been great. I would have stopped using typescript if it weren't for
Deno. The runtime is great, and the `jsr:@std` library is very useful. None of
my solution uses any external dependencies except `jsr:@std`. Deno's test and
assert libraries allowed me to test my solutions. I can use a single binary for
everything. The `lint` and `fmt` commands kept my code clean.

[aoc2024]: https://adventofcode.com/2024
[tc]: https://www.typescriptlang.org
[deno]: https://deno.com
