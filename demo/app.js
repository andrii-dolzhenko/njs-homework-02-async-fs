import { writeFileAsync, readFileAsync, deleteFileAsync } from './main.js';
import { files } from './virtual-fs.js';

const form = document.querySelector('#file-form');
const filenameInput = document.querySelector('#filename');
const contentInput = document.querySelector('#content');
const fileList = document.querySelector('#file-list');
const emptyState = document.querySelector('#empty-state');
const fileCount = document.querySelector('#file-count');
const result = document.querySelector('#result');
const resultLabel = document.querySelector('#result-label');
const resultValue = document.querySelector('#result-value');
const journal = document.querySelector('#journal');
const journalEmpty = document.querySelector('#journal-empty');
const resetButton = document.querySelector('#reset');
const controls = [...form.querySelectorAll('button, input, textarea'), resetButton];
let busy = false;

function addLog(level, values) {
  const item = document.createElement('li');
  item.className = `journal__entry journal__entry--${level}`;
  const marker = document.createElement('span');
  marker.className = 'journal__level';
  marker.textContent = level === 'error' ? 'Помилка' : 'Готово';
  const message = document.createElement('code');
  message.textContent = values.map((value) => value instanceof Error ? value.message : String(value)).join(' ');
  item.append(marker, message);
  journal.prepend(item);
  while (journal.children.length > 30) journal.lastElementChild.remove();
  journalEmpty.hidden = true;
}

function renderFiles() {
  fileList.replaceChildren();
  fileCount.textContent = String(files.size);
  emptyState.hidden = files.size > 0;
  for (const [filename, content] of files) {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'file';
    button.disabled = busy;
    button.setAttribute('aria-pressed', String(filenameInput.value.trim() === filename));
    const name = document.createElement('span');
    name.className = 'file__name';
    name.textContent = filename;
    const size = document.createElement('span');
    size.className = 'file__size';
    size.textContent = `${new TextEncoder().encode(content).length} B`;
    button.append(name, size);
    button.addEventListener('click', () => {
      filenameInput.value = filename;
      filenameInput.setCustomValidity('');
      result.hidden = true;
      renderFiles();
      filenameInput.focus();
    });
    item.append(button);
    fileList.append(item);
  }
}

function showResult(label, value, failed = false) {
  result.hidden = false;
  result.dataset.state = failed ? 'error' : 'success';
  resultLabel.textContent = label;
  resultValue.textContent = value;
}

function reset() {
  files.clear();
  form.reset();
  filenameInput.setCustomValidity('');
  result.hidden = true;
  journal.replaceChildren();
  journalEmpty.hidden = false;
  renderFiles();
}

filenameInput.addEventListener('input', () => {
  filenameInput.setCustomValidity('');
  result.hidden = true;
  renderFiles();
});
resetButton.addEventListener('click', reset);

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (busy) return;
  const filename = filenameInput.value.trim();
  if (!filename || /[/\\\0]/.test(filename) || filename === '.' || filename === '..') {
    filenameInput.setCustomValidity('Введіть ім’я файлу без шляху до папки.');
    filenameInput.reportValidity();
    return;
  }

  const operation = event.submitter?.value ?? 'write';
  const content = contentInput.value;
  const originalLog = console.log;
  const originalError = console.error;
  let failed = false;
  let errorMessage = '';
  busy = true;
  controls.forEach((control) => { control.disabled = true; });
  form.setAttribute('aria-busy', 'true');
  renderFiles();
  console.log = (...values) => addLog('success', values);
  console.error = (...values) => {
    failed = true;
    errorMessage = values.map((value) => value instanceof Error ? value.message : String(value)).join(' ');
    addLog('error', values);
  };

  try {
    if (operation === 'write') {
      const value = await writeFileAsync(filename, content);
      showResult('writeFileAsync()', value instanceof Error ? value.message : `Записано: ${filename}`, failed);
    } else if (operation === 'read') {
      const value = await readFileAsync(filename);
      showResult('readFileAsync()', value === null ? errorMessage : value === '' ? 'Порожній файл — ""' : value, failed);
    } else {
      await deleteFileAsync(filename);
      showResult('deleteFileAsync()', failed ? errorMessage : `Видалено: ${filename}`, failed);
    }
  } catch (error) {
    addLog('error', [error]);
    showResult('Помилка демо', error.message, true);
  } finally {
    console.log = originalLog;
    console.error = originalError;
    busy = false;
    controls.forEach((control) => { control.disabled = false; });
    form.setAttribute('aria-busy', 'false');
    renderFiles();
  }
});

reset();
document.querySelector('#playground').hidden = false;
