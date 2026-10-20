# Async File System

Three async Node.js functions for writing, reading, and deleting files with `fs/promises`.

- `writeFileAsync(filename, content)` creates or overwrites a file. On failure, it logs and returns the error.
- `readFileAsync(filename)` reads UTF-8 text. On failure, it logs and returns `null`.
- `deleteFileAsync(filename)` deletes a file and logs the result. Errors are handled without rethrowing.

Missing files are reported separately when reading or deleting. Console messages follow the assignment's Ukrainian wording.

## Run and test

Requires Node.js 24. Install the test dependencies:

```sh
npm install --package-lock=false
npm test
```

- `npm test` runs the teacher's 8 Vitest tests without modifications.
- `npm run test:files` checks real files in a temporary directory and cleans up afterward.
- `npm run build` generates the browser demo in `dist/`.
- `npm run check` checks syntax, runs both sets of checks, and builds the demo.

The implementation is in `src/main.js`. Teacher tests are in `src/__test__/`.

## Demo

Build the demo and serve `dist/` with a local static server, such as VS Code Live Server. Open `dist/index.html` through that server.

The playground supports writing, overwriting, reading, and deleting virtual files. It also shows file sizes, results, and an operation log. Files exist only in browser memory and disappear after a page reload or reset.

The build reuses `src/main.js`, changing only its filesystem import to the browser adapter. No file-operation handlers are duplicated. The expandable Node.js example is generated using real temporary files during the build.

## Credits

Assignment and original Vitest tests: [Andrii Fomenko](https://github.com/FomenkoAndrey/nodejs-hw02-tests).

© 2026 Andrii Dolzhenko. All Rights Reserved.
