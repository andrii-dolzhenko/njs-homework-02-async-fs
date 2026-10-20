import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { writeFileAsync, readFileAsync, deleteFileAsync } from '../src/main.js';

const directory = await mkdtemp(join(tmpdir(), 'async-fs-check-'));
const filename = join(directory, 'example.txt');

try {
  const content = 'Привіт, Node.js! 👋\nДругий рядок.';
  assert.equal(await writeFileAsync(filename, content), undefined);
  assert.equal(await readFile(filename, 'utf8'), content);
  assert.equal(await readFileAsync(filename), content);

  await writeFileAsync(filename, 'Updated');
  assert.equal(await readFileAsync(filename), 'Updated');

  await writeFileAsync(filename, '');
  assert.equal(await readFileAsync(filename), '');

  await deleteFileAsync(filename);
  await assert.rejects(readFile(filename), { code: 'ENOENT' });
  assert.equal(await readFileAsync(filename), null);
  assert.equal(await deleteFileAsync(filename), undefined);

  const error = await writeFileAsync(join(directory, 'missing', 'file.txt'), 'Test');
  assert.ok(error instanceof Error);
  assert.equal(error.code, 'ENOENT');
  console.log('Real-file checks passed.');
} finally {
  await rm(directory, { recursive: true, force: true });
}
