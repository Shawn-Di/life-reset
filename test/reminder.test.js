const assert = require('node:assert/strict');
const test = require('node:test');

const { findContentForTime, loadContent } = require('../src/content');
const { buildReminder } = require('../src/reminder');

test('builds only the two reminder modules', () => {
  const item = findContentForTime(loadContent('content/life-reset.json'), '08:00');
  const reminder = buildReminder(item, 'name');

  assert.equal(reminder, `Hi name，${item.prompt}\n${item.action}`);
  assert.doesNotMatch(reminder, /致命拷问|即刻行动|来源|简要背景|Life-reset/);
});
