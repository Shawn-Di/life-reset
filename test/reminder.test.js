const assert = require('node:assert/strict');
const test = require('node:test');

const { findContentForTime, loadContent } = require('../src/content');
const { buildFollowUp, buildReminder } = require('../src/reminder');

test('keeps the scheduled question and reply action separate', () => {
  const item = findContentForTime(loadContent(), '08:00');
  const reminder = buildReminder(item, 'name');

  assert.equal(reminder, `name，${item.prompt}`);
  assert.equal(buildFollowUp(item), item.action);
  assert.equal(reminder.includes(item.action), false);
  assert.doesNotMatch(reminder, /Hi|致命拷问|即刻行动|来源|简要背景|Life-reset/);
  assert.doesNotMatch(reminder, /\r?\n/);
});
