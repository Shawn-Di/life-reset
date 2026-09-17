const CONVERSATION_TITLE = 'Life-reset';
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

function getDefaultState() {
  return {
    enabled: true,
    schedule: { ...DEFAULT_SCHEDULE },
    conversationId: null,
    conversationTitle: CONVERSATION_TITLE,
    conversationPhase: CONVERSATION_PHASES.SILENT
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

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return hours < 24 && minutes < 60 ? hours * 60 + minutes : null;
}

function isWithinReminderWindow(localNow, schedule = DEFAULT_SCHEDULE) {
  if (!(localNow instanceof Date) || Number.isNaN(localNow.getTime())) {
    return false;
  }

  const start = timeToMinutes(schedule.start);
  const end = timeToMinutes(schedule.end);
  if (start === null || end === null || start === end) {
    return false;
  }

  const current = localNow.getHours() * 60 + localNow.getMinutes();
  return start < end
    ? current >= start && current < end
    : current >= start || current < end;
}

function isReminderDue(state = {}, localNow = new Date()) {
  if (state.enabled === false) {
    return false;
  }

  const schedule = { ...DEFAULT_SCHEDULE, ...(state.schedule || {}) };
  if (!isWithinReminderWindow(localNow, schedule)) {
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
  if (state.enabled === false) {
    return { type: 'skip', title: CONVERSATION_TITLE };
  }
  if (state.conversationId && conversationExists) {
    return { type: 'send', title: CONVERSATION_TITLE };
  }
  return { type: 'create', title: CONVERSATION_TITLE };
}

module.exports = {
  CONVERSATION_TITLE,
  CONVERSATION_PHASES,
  DEFAULT_SCHEDULE,
  decideFeedback,
  decideDelivery,
  getDefaultState,
  isReminderDue,
  isWithinReminderWindow,
  markReminderDelivered,
  needsSchedulePreference,
  parseReminderCommand
};
