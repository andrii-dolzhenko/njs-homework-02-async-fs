export const files = new Map();

function missingFile(filename, operation) {
  const error = new Error(`ENOENT: no such file, ${operation} '${filename}'`);
  error.code = 'ENOENT';
  return error;
}

export async function writeFile(filename, content) {
  files.set(filename, content);
}

export async function readFile(filename) {
  if (!files.has(filename)) throw missingFile(filename, 'open');
  return files.get(filename);
}

export async function unlink(filename) {
  if (!files.has(filename)) throw missingFile(filename, 'unlink');
  files.delete(filename);
}
