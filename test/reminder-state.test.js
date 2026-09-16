const assert = require('node:assert/strict');
const test = require('node:test');

const {
  decideDelivery,
  getDefaultState,
  parseReminderCommand
} = require('../src/reminder-state');

test('reminders are enabled by default', () => {
  assert.deepEqual(getDefaultState(), {
    enabled: true,
    conversationId: null,
    conversationTitle: 'Life-reset'
  });
});

test('parses Chinese and English reminder toggles', () => {
  assert.equal(parseReminderCommand('关闭人生重启提醒'), 'disable');
  assert.equal(parseReminderCommand('请开启人生重启提醒'), 'enable');
  assert.equal(parseReminderCommand('disable life-reset reminders'), 'disable');
  assert.equal(parseReminderCommand('enable life-reset reminders'), 'enable');
  assert.equal(parseReminderCommand('今天聊聊目标'), null);
});

test('skips a reminder when disabled', () => {
  assert.deepEqual(decideDelivery({ enabled: false, conversationId: 'c1' }, true), {
    type: 'skip',
    title: 'Life-reset'
  });
});

test('continues an accessible prior conversation', () => {
  assert.deepEqual(decideDelivery({ enabled: true, conversationId: 'c1' }, true), {
    type: 'send',
    title: 'Life-reset'
  });
});

test('creates a new conversation when the prior one is unavailable', () => {
  assert.deepEqual(decideDelivery({ enabled: true, conversationId: 'c1' }, false), {
    type: 'create',
    title: 'Life-reset'
  });
  assert.deepEqual(decideDelivery({ enabled: true, conversationId: null }, false), {
    type: 'create',
    title: 'Life-reset'
  });
});
