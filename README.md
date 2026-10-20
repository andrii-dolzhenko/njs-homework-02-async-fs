# Node.js Homework 02 — Async File System

Three functions for writing, reading, and deleting files with Node.js
`fs/promises`, using `async/await` and error handling.

## Run and test

Requires Node.js 24.

```bash
npm install --package-lock=false
npm run check
```

- `npm test` — run 8 automated tests using Vitest.
- `npm run test:files` — check operations on real temporary files.
- `npm run build` — generate the demo in `dist/index.html`.
- `npm run check` — check syntax, run tests and real-file checks, and build the demo.

Writing creates or overwrites a file. Reading returns UTF-8 text.
Missing files are reported separately when reading or deleting.
On failure, writing returns the error, reading returns `null`, and deletion
logs the error without rethrowing.
The solution is in `src/main.js`; `demo/` and `scripts/` provide the demo page.

The interactive demo uses the same functions as the Node.js solution with a
browser filesystem adapter. Enter a filename and text, then write, read, or
delete the file. Virtual files stay in browser memory and are cleared on
reset or page reload. The expandable Node.js example is generated using real
temporary files during the build.

The core functions use built-in Node.js APIs. GitHub Actions runs the checks
and publishes the demo to GitHub Pages after changes are merged into `main`.

## Demo

[GitHub Pages](https://andrii-dolzhenko.github.io/njs-homework-02-async-fs/)

Run `npm run build`, then open `dist/index.html` with VS Code Live Server.
