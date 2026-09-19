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
  assert.match(prompt, /⚙️ AutoGravity/);
  assert.match(prompt, /life-reset-v1/);
  assert.match(prompt, /⏰/);
  assert.match(prompt, /📝/);
  assert.match(prompt, /暂停其余/);
  assert.match(prompt, /不新建自动化/);
  assert.match(prompt, /每次运行先查找/);
  assert.match(prompt, /Hi \{name\}/);
  assert.doesNotMatch(prompt, /致命拷问|即刻行动/);
});
