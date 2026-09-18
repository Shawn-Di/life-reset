const assert = require('node:assert/strict');
const test = require('node:test');

const { loadContent } = require('../src/content');
const { buildReminder } = require('../src/reminder');

test('builds only the two reminder modules', () => {
  const item = loadContent('content/life-reset.json').items[0];
  const reminder = buildReminder(item);

  assert.equal(reminder, `【致命拷问】 ${item.prompt}\n【即刻行动】 ${item.action}`);
  assert.doesNotMatch(reminder, /来源|简要背景|Life-reset/);
});
