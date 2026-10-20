import assert from 'node:assert/strict';
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { writeFileAsync, readFileAsync, deleteFileAsync } from '../src/main.js';

const directory = await mkdtemp(join(tmpdir(), 'async-fs-demo-'));
const filename = join(directory, 'example.txt');
const lines = [];
const originalLog = console.log;
const originalError = console.error;
const capture = (...values) => lines.push(values.map((value) => value instanceof Error ? value.message : String(value)).join(' '));

try {
  console.log = capture;
  console.error = capture;
  lines.push('writeFileAsync("example.txt", "Привіт, Node.js! 👋")');
  assert.equal(await writeFileAsync(filename, 'Привіт, Node.js! 👋'), undefined);
  assert.equal(await readFile(filename, 'utf8'), 'Привіт, Node.js! 👋');
  lines.push('\nreadFileAsync("example.txt")');
  assert.equal(await readFileAsync(filename), 'Привіт, Node.js! 👋');
  lines.push('\ndeleteFileAsync("example.txt")');
  await deleteFileAsync(filename);
  await assert.rejects(readFile(filename), { code: 'ENOENT' });
  lines.push('\nreadFileAsync("example.txt")');
  assert.equal(await readFileAsync(filename), null);
  lines.push('Повернене значення: null');
} finally {
  console.log = originalLog;
  console.error = originalError;
  await rm(directory, { recursive: true, force: true });
}

const escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);
const template = await readFile(new URL('../demo/index.html', import.meta.url), 'utf8');
assert.equal(template.split('{{node-example}}').length, 2);
const example = lines.join('\n').replaceAll(filename, 'example.txt');
const source = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
const nodeImport = "import * as fs from 'fs/promises';";
assert.equal(source.split(nodeImport).length, 2);
const browserSource = source.replace(nodeImport, "import * as fs from './virtual-fs.js';");

await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
await writeFile(new URL('../dist/index.html', import.meta.url), template.replace('{{node-example}}', escapeHtml(example)));
await writeFile(new URL('../dist/main.js', import.meta.url), browserSource);
for (const name of ['app.js', 'virtual-fs.js']) {
  await copyFile(new URL(`../demo/${name}`, import.meta.url), new URL(`../dist/${name}`, import.meta.url));
}
console.log('Demo built: dist/index.html');
