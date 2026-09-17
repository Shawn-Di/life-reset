const assert = require('node:assert/strict');
const test = require('node:test');

const {
  DEFAULT_SCHEDULE,
  decideDelivery,
  getDefaultState,
  isReminderDue,
  isWithinReminderWindow,
  needsSchedulePreference,
  parseReminderCommand
} = require('../src/reminder-state');

test('reminders are enabled by default', () => {
  assert.deepEqual(getDefaultState(), {
    enabled: true,
    schedule: DEFAULT_SCHEDULE,
    conversationId: null,
    conversationTitle: 'Life-reset'
  });
});

test('uses a two-hour local daytime schedule by default', () => {
  assert.deepEqual(DEFAULT_SCHEDULE, {
    intervalMinutes: 120,
    start: '08:00',
    end: '22:00',
    timezone: 'user-local',
    userConfirmed: false
  });
  assert.equal(isWithinReminderWindow(new Date(2026, 8, 17, 9, 0)), true);
  assert.equal(isWithinReminderWindow(new Date(2026, 8, 17, 22, 0)), false);
});

test('asks for a preferred schedule until the user confirms one', () => {
  assert.equal(needsSchedulePreference(getDefaultState()), true);
  assert.equal(needsSchedulePreference({
    schedule: { ...DEFAULT_SCHEDULE, userConfirmed: true }
  }), false);
});

test('only sends a due reminder inside the local window', () => {
  const localNow = new Date(2026, 8, 17, 9, 0);
  const state = {
    enabled: true,
    schedule: { ...DEFAULT_SCHEDULE },
    lastReminderAt: new Date(localNow.getTime() - 3 * 60 * 60 * 1000).toISOString()
  };

  assert.equal(isReminderDue(state, localNow), true);
  assert.equal(isReminderDue(state, new Date(2026, 8, 17, 7, 0)), false);
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
