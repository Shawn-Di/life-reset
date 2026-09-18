const assert = require('node:assert/strict');
const test = require('node:test');

const {
  buildAutomationSetupPrompt,
  getPlatformAdapter,
  normalizePlatform
} = require('../src/platform-adapters');

test('normalizes platform aliases', () => {
  assert.equal(normalizePlatform('CC'), 'claude-code');
  assert.equal(normalizePlatform('antigravity'), 'autogravity');
  assert.equal(normalizePlatform('workbuddy'), 'workbuddy');
});

test('exposes a setup prompt for each supported platform', () => {
  const adapter = getPlatformAdapter('autogravity');
  const prompt = buildAutomationSetupPrompt('autogravity');

  assert.equal(adapter.displayName, 'AutoGravity');
  assert.match(prompt, /Life-reset/);
  assert.match(prompt, /life-reset-v1/);
  assert.match(prompt, /暂停重复项/);
  assert.match(prompt, /不创建新的自动化/);
});
