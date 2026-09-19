const CONVERSATION_TITLE = 'Life-reset';
const DEFAULT_MODULE_ID = 'life-reset-day-one';
const CONVERSATION_PHASES = Object.freeze({
  SILENT: 'silent',
  AWAITING_FEEDBACK: 'awaiting-feedback'
});
const DEFAULT_SCHEDULE = Object.freeze({
  intervalMinutes: 120,
  start: '08:00',
  end: '22:00',
  timezone: 'user-local',
  userConfirmed: false
});

function getDefaultState(moduleId = DEFAULT_MODULE_ID) {
  return {
    enabled: true,
    moduleId,
    schedule: { ...DEFAULT_SCHEDULE },
    conversationId: null,
    conversationTitle: CONVERSATION_TITLE,
    conversationPhase: CONVERSATION_PHASES.SILENT,
    lastReminderAt: null
  };
}

function markReminderDelivered(state = {}) {
  return {
    ...state,
    conversationPhase: CONVERSATION_PHASES.AWAITING_FEEDBACK
  };
}

function decideFeedback(state = {}, feedbackReceived = false) {
  if (
    state.conversationPhase !== CONVERSATION_PHASES.AWAITING_FEEDBACK
    || !feedbackReceived
  ) {
    return { type: 'silent', phase: CONVERSATION_PHASES.SILENT };
  }

  return { type: 'tactical-correction', phase: CONVERSATION_PHASES.SILENT };
}

function needsSchedulePreference(state = {}) {
  return state.schedule?.userConfirmed !== true;
}

function timeToMinutes(value) {
  const match = typeof value === 'string' && /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }

  const [hours, minutes] = match.slice(1).map(Number);
  return hours < 24 && minutes < 60 ? hours * 60 + minutes : null;
}

function schedulePosition(localNow, schedule) {
  if (!(localNow instanceof Date) || Number.isNaN(localNow.getTime())) {
    return null;
  }

  const start = timeToMinutes(schedule.start);
  const end = timeToMinutes(schedule.end);
  const interval = Number(schedule.intervalMinutes);
  if (
    start === null
    || end === null
    || start === end
    || !Number.isInteger(interval)
    || interval <= 0
  ) {
    return null;
  }

  const current = localNow.getHours() * 60 + localNow.getMinutes();
  const elapsed = current >= start ? current - start : current + 1440 - start;
  const windowLength = start < end ? end - start : end + 1440 - start;
  return { elapsed, interval, windowLength };
}

function isWithinReminderWindow(localNow, schedule = DEFAULT_SCHEDULE) {
  const position = schedulePosition(localNow, schedule);
  return Boolean(position && position.elapsed < position.windowLength);
}

function isReminderSlot(localNow, schedule = DEFAULT_SCHEDULE) {
  const position = schedulePosition(localNow, schedule);
  return Boolean(
    position
    && position.elapsed < position.windowLength
    && position.elapsed % position.interval === 0
  );
}

function isReminderDue(state = {}, localNow = new Date()) {
  if (state.enabled === false) {
    return false;
  }

  const schedule = { ...DEFAULT_SCHEDULE, ...(state.schedule || {}) };
  if (!isReminderSlot(localNow, schedule)) {
    return false;
  }

  if (!state.lastReminderAt) {
    return true;
  }

  const lastReminderAt = Date.parse(state.lastReminderAt);
  return Number.isFinite(lastReminderAt)
    && localNow.getTime() - lastReminderAt >= schedule.intervalMinutes * 60 * 1000;
}

function parseReminderCommand(text) {
  if (typeof text !== 'string') {
    return null;
  }

  const message = text.trim();
  if (
    /关闭\s*(?:人生重启|life[- ]?reset)?\s*提醒/i.test(message) ||
    /\b(?:disable|turn\s+off|pause|stop)\s+(?:life[- ]?reset\s+)?reminders?\b/i.test(message)
  ) {
    return 'disable';
  }
  if (
    /开启\s*(?:人生重启|life[- ]?reset)?\s*提醒/i.test(message) ||
    /\b(?:enable|turn\s+on|resume|start)\s+(?:life[- ]?reset\s+)?reminders?\b/i.test(message)
  ) {
    return 'enable';
  }

  return null;
}

function decideDelivery(state = {}, conversationExists = false) {
  if (Array.isArray(conversationExists)) {
    return decideDeliveryFromConversations(state, conversationExists);
  }

  if (state.enabled === false) {
    return { type: 'skip', title: CONVERSATION_TITLE };
  }
  if (state.conversationId && conversationExists) {
    return { type: 'send', title: CONVERSATION_TITLE };
  }
  return { type: 'create', title: CONVERSATION_TITLE };
}

function findReusableConversation(conversations = [], savedConversationId = null) {
  const matches = conversations.filter((conversation) => (
    conversation
    && conversation.id
    && conversation.title === CONVERSATION_TITLE
    && conversation.accessible !== false
    && conversation.isAccessible !== false
    && conversation.deleted !== true
  ));

  const saved = matches.find(({ id }) => id === savedConversationId);
  if (saved) {
    return saved;
  }

  return matches.reduce((latest, conversation) => (
    latest === null
      || conversationTimestamp(conversation) > conversationTimestamp(latest)
      ? conversation
      : latest
  ), null);
}

function conversationTimestamp(conversation) {
  if (!conversation) {
    return 0;
  }

  return Date.parse(conversation.updatedAt || conversation.lastActivityAt || '') || 0;
}

function decideDeliveryFromConversations(state = {}, conversations = []) {
  if (state.enabled === false) {
    return { type: 'skip', title: CONVERSATION_TITLE };
  }

  const conversation = findReusableConversation(conversations, state.conversationId);
  if (conversation) {
    return {
      type: 'send',
      title: CONVERSATION_TITLE,
      conversationId: conversation.id
    };
  }

  return { type: 'create', title: CONVERSATION_TITLE };
}

module.exports = {
  CONVERSATION_TITLE,
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
  markReminderDelivered,
  needsSchedulePreference,
  parseReminderCommand
};
