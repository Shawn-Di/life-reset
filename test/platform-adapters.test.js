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
  assert.match(prompt, /👤/);
  assert.match(prompt, /暂停其余/);
  assert.match(prompt, /跨对话消息/);
  assert.match(prompt, /配置或修复时查找/);
  assert.match(prompt, /\{name\}，问题 行动/);
  assert.match(prompt, /不加 Hi/);
  assert.match(prompt, /用户未回复时不输出任何文字/);
  assert.match(prompt, /禁止代答/);
  assert.match(prompt, /禁止进度说明/);
  assert.doesNotMatch(prompt, /致命拷问|即刻行动/);
});

test('uses a thread-bound heartbeat for Codex delivery', () => {
  const prompt = buildAutomationSetupPrompt('codex');

  assert.match(prompt, /唯一 heartbeat/);
  assert.match(prompt, /任务提示仅为“\$life-reset”/);
  assert.match(prompt, /等待用户输入时暂停/);
  assert.match(prompt, /禁止 standalone cron/);
  assert.match(prompt, /禁止.*send_message_to_thread/);
});
