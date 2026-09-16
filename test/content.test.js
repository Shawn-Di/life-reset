const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { findContent, loadContent } = require('../src/content');

function writeTempPack(pack) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'life-reset-'));
  const filePath = path.join(directory, 'content.json');
  fs.writeFileSync(filePath, JSON.stringify(pack));
  return { directory, filePath };
}

test('loads the bundled life reset item', () => {
  const pack = loadContent('content/life-reset.json');
  assert.equal(pack.items[0].id, 'life-reset-day-one');
});

test('rejects a missing required field', () => {
  const pack = {
    version: 1,
    items: [{
      id: 'life-reset-day-one',
      title: '人生重启',
      author: 'Dan Koe',
      sourceUrl: 'https://example.com/source',
      sourcePublishedAt: '2025-12-23',
      summary: 'summary',
      action: 'action',
      copyrightNote: 'note'
    }]
  };
  const { directory, filePath } = writeTempPack(pack);

  assert.throws(() => loadContent(filePath), /Invalid field: items\[0\]\.prompt/);
  fs.rmSync(directory, { recursive: true, force: true });
});

test('rejects duplicate content ids', () => {
  const item = {
    id: 'same-id',
    title: 'title',
    author: 'author',
    sourceUrl: 'https://example.com/source',
    sourcePublishedAt: '2025-12-23',
    summary: 'summary',
    prompt: 'prompt',
    action: 'action',
    copyrightNote: 'note'
  };
  const { directory, filePath } = writeTempPack({ version: 1, items: [item, item] });

  assert.throws(() => loadContent(filePath), /Duplicate content id: same-id/);
  fs.rmSync(directory, { recursive: true, force: true });
});

test('rejects an unknown content id', () => {
  const pack = loadContent('content/life-reset.json');
  assert.throws(() => findContent(pack, 'missing'), /Unknown content id: missing/);
});
