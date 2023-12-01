# advent-of-code-2023

To install dependencies:

```bash
bun install
```

This script can auto-download the puzzle input for you on runtime:

1. Login on https://adventofcode.com/auth/login
2. After login, open the devtools in your browser
3. Go to your cookies
4. Copy the value of the `session` cookie
5. Create a `.env` file in the project
6. Add `SESSION=<cookie value>` to `.env`



To run all puzzles:

```bash
bun run index.ts
```

To run a specific puzzle:

```bash
bun run <day>/index.ts
```

This project was created using `bun init` in bun v1.0.14. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
