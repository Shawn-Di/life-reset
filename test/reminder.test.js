const assert = require('node:assert/strict');
const test = require('node:test');

const { loadContent } = require('../src/content');
const { buildReminder, buildSessionInstruction } = require('../src/reminder');

test('builds a persistent mentor session instruction', () => {
  const instruction = buildSessionInstruction();

  assert.match(instruction, /人生重启/);
  assert.match(instruction, /人生导师模式/);
  assert.match(instruction, /整个生命周期/);
  assert.match(instruction, /关闭人生重启提醒/);
  assert.match(instruction, /开启人生重启提醒/);
  assert.match(instruction, /每两个小时/);
});

test('builds a reminder from the selected content item', () => {
  const item = loadContent('content/life-reset.json').items[0];
  const reminder = buildReminder(item);

  assert.match(reminder, /人生重启提醒/);
  assert.match(reminder, /【致命拷问】/);
  assert.match(reminder, /【即刻行动】/);
  assert.match(reminder, new RegExp(item.title));
  assert.match(reminder, new RegExp(item.prompt));
  assert.match(reminder, new RegExp(item.action));
  assert.match(reminder, new RegExp(item.sourceUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});
