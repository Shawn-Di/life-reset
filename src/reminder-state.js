const CONVERSATION_TITLE = 'Life-reset';

function getDefaultState() {
  return {
    enabled: true,
    conversationId: null,
    conversationTitle: CONVERSATION_TITLE
  };
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
  decideDelivery,
  getDefaultState,
  parseReminderCommand
};
