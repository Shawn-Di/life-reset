const assert = require('node:assert/strict');
const test = require('node:test');

const {
  CONVERSATION_PHASES,
  DEFAULT_MODULE_ID,
  DEFAULT_SCHEDULE,
  decideFeedback,
  decideDelivery,
  decideDeliveryFromConversations,
  getDefaultState,
  isReminderDue,
  isReminderSlot,
  isWithinReminderWindow,
  markNameRequested,
  markReminderDelivered,
  needsDisplayName,
  needsSchedulePreference,
  parseReminderCommand,
  recordUserDisplayName
} = require('../src/reminder-state');

test('reminders are enabled by default', () => {
  assert.deepEqual(getDefaultState(), {
    enabled: true,
    displayName: null,
    moduleId: DEFAULT_MODULE_ID,
    schedule: DEFAULT_SCHEDULE,
    conversationId: null,
    conversationTitle: 'Life-reset',
    conversationPhase: 'silent',
    pendingSlotTime: null,
    lastReminderAt: null
  });
});

test('uses the reminder feedback state machine', () => {
  assert.deepEqual(markReminderDelivered({}, '08:00'), {
    conversationPhase: 'awaiting-feedback',
    pendingSlotTime: '08:00'
  });

  const awaitingFeedback = {
    conversationPhase: CONVERSATION_PHASES.AWAITING_FEEDBACK,
    pendingSlotTime: '08:00'
  };

  assert.deepEqual(decideFeedback(awaitingFeedback, false), {
    type: 'silent',
    phase: 'awaiting-feedback'
  });
  assert.deepEqual(decideFeedback(awaitingFeedback, true), {
    type: 'action',
    phase: 'awaiting-action',
    slotTime: '08:00'
  });

  assert.deepEqual(decideFeedback({
    conversationPhase: CONVERSATION_PHASES.AWAITING_ACTION,
    pendingSlotTime: '08:00'
  }, true), {
    type: 'start-now',
    phase: 'silent',
    text: '现在就开始行动好了'
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

test('waits for a real user reply before saving a display name', () => {
  const awaitingName = markNameRequested(getDefaultState());
  assert.equal(needsDisplayName(awaitingName), true);
  assert.equal(awaitingName.conversationPhase, 'awaiting-name');

  const assistantReply = recordUserDisplayName(awaitingName, {
    author: 'assistant',
    text: '叫我 ChatGPT'
  });
  assert.strictEqual(assistantReply, awaitingName);

  const emptyReply = recordUserDisplayName(awaitingName, {
    author: 'user',
    source: 'direct',
    text: '   '
  });
  assert.strictEqual(emptyReply, awaitingName);

  const delegatedReply = recordUserDisplayName(awaitingName, {
    author: 'user',
    source: 'cross-task',
    text: '叫我 ChatGPT'
  });
  assert.strictEqual(delegatedReply, awaitingName);

  const namedState = recordUserDisplayName(awaitingName, {
    author: 'user',
    source: 'direct',
    text: '  Shawn  '
  });
  assert.equal(needsDisplayName(namedState), false);
  assert.equal(namedState.displayName, 'Shawn');
  assert.equal(namedState.conversationPhase, 'silent');
});

test('only sends a due reminder inside the local window', () => {
  const localNow = new Date(2026, 8, 17, 10, 0);
  const state = {
    enabled: true,
    schedule: { ...DEFAULT_SCHEDULE },
    lastReminderAt: new Date(localNow.getTime() - 3 * 60 * 60 * 1000).toISOString()
  };

  assert.equal(isReminderDue(state, localNow), true);
  assert.equal(isReminderDue(state, new Date(2026, 8, 17, 9, 0)), false);
  assert.equal(isReminderDue(state, new Date(2026, 8, 17, 7, 0)), false);
});

test('aligns reminders to the configured start minute', () => {
  assert.equal(isReminderSlot(new Date(2026, 8, 17, 8, 0)), true);
  assert.equal(isReminderSlot(new Date(2026, 8, 17, 9, 0)), false);
  assert.equal(isReminderSlot(new Date(2026, 8, 17, 10, 0)), true);
});

test('parses Chinese and English reminder toggles', () => {
  assert.equal(parseReminderCommand('关闭 Life-reset 提醒'), 'disable');
  assert.equal(parseReminderCommand('请开启 Life-reset 提醒'), 'enable');
  assert.equal(parseReminderCommand('关闭人生重启提醒'), 'disable');
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

test('reuses an accessible exact-title conversation before creating one', () => {
  const state = { enabled: true, conversationId: null };
  const conversations = [
    { id: 'other', title: 'Other' },
    { id: 'life-reset-1', title: 'Life-reset', accessible: true }
  ];

  assert.deepEqual(decideDeliveryFromConversations(state, conversations), {
    type: 'send',
    title: 'Life-reset',
    conversationId: 'life-reset-1'
  });
});

test('creates only when no accessible exact-title conversation exists', () => {
  const state = { enabled: true, conversationId: 'deleted' };
  const conversations = [
    { id: 'deleted', title: 'Life-reset', accessible: false },
    { id: 'other', title: 'Other', accessible: true }
  ];

  assert.deepEqual(decideDeliveryFromConversations(state, conversations), {
    type: 'create',
    title: 'Life-reset'
  });
});
