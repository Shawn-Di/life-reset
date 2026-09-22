const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const {
  findContent,
  findContentForTime,
  listModules,
  loadContent
} = require('../src/content');

function writeTempPack(pack) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'life-reset-'));
  const filePath = path.join(directory, 'content.json');
  fs.writeFileSync(filePath, JSON.stringify(pack));
  return { directory, filePath };
}

test('loads the bundled life reset module', () => {
  const pack = loadContent('content/life-reset.json');
  assert.equal(pack.defaultModuleId, 'life-reset-day-one');
  assert.equal(pack.modules[0].id, 'life-reset-day-one');
  assert.equal(pack.modules[0].slots.length, 7);
  assert.equal(findContentForTime(pack, '20:00').time, '20:00');
  assert.equal(findContentForTime(pack, '20:03').time, '20:00');
  assert.deepEqual(listModules(pack), [{
    id: 'life-reset-day-one',
    title: 'Life-reset',
    summary: '通过反思、聚焦和行动，重新夺回一天的主导权。'
  }]);
});

test('keeps bundled reminders concise', () => {
  const pack = loadContent('content/life-reset.json');

  for (const slot of pack.modules[0].slots) {
    assert.ok(slot.prompt.length <= 60, `${slot.time} prompt is too long`);
    assert.ok(slot.action.length <= 60, `${slot.time} action is too long`);
  }
});

test('rejects a missing required field', () => {
  const pack = {
    version: 1,
    defaultModuleId: 'life-reset-day-one',
    modules: [{
      id: 'life-reset-day-one',
      title: 'Life-reset',
      summary: 'summary',
      slots: []
    }]
  };
  const { directory, filePath } = writeTempPack(pack);

  assert.throws(() => loadContent(filePath), /Invalid field: modules\[0\]\.slots/);
  fs.rmSync(directory, { recursive: true, force: true });
});

test('rejects duplicate module ids', () => {
  const item = {
    id: 'same-id',
    title: 'title',
    summary: 'summary',
    slots: [{ time: '08:00', prompt: 'prompt', action: 'action' }]
  };
  const { directory, filePath } = writeTempPack({
    version: 1,
    defaultModuleId: 'same-id',
    modules: [item, item]
  });

  assert.throws(() => loadContent(filePath), /Duplicate module id: same-id/);
  fs.rmSync(directory, { recursive: true, force: true });
});

test('rejects an unknown module id', () => {
  const pack = loadContent('content/life-reset.json');
  assert.throws(() => findContent(pack, 'missing'), /Unknown module id: missing/);
});

test('loads a custom module and selects it explicitly', () => {
  const customModule = {
    id: 'my-module',
    title: '我的题库',
    summary: '自定义提醒',
    slots: [{ time: '08:00', prompt: '我的问题', action: '我的行动' }]
  };
  const { directory, filePath } = writeTempPack({
    version: 1,
    defaultModuleId: 'life-reset-day-one',
    modules: [
      customModule,
      {
        id: 'life-reset-day-one',
        title: '默认题库',
        summary: '默认',
        slots: [{ time: '08:00', prompt: '默认问题', action: '默认行动' }]
      }
    ]
  });

  const pack = loadContent(filePath);
  assert.equal(findContent(pack, 'my-module', '08:00').prompt, '我的问题');
  assert.equal(findContentForTime(pack, '08:00', 'my-module').action, '我的行动');
  fs.rmSync(directory, { recursive: true, force: true });
});
