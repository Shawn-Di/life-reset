const { AUTOMATION_KEY, AUTOMATION_NAME } = require('./automation-policy');

const PLATFORM_ALIASES = Object.freeze({
  antigravity: 'autogravity',
  cc: 'claude-code',
  claude: 'claude-code',
  'claude-code': 'claude-code',
  codex: 'codex',
  doubao: 'doubao',
  grok: 'grok-bot',
  'grok-bot': 'grok-bot',
  kimi: 'kimi',
  autogravity: 'autogravity',
  workbuddy: 'workbuddy'
});

const PLATFORM_ADAPTERS = Object.freeze({
  autogravity: 'AutoGravity',
  'claude-code': 'Claude Code',
  codex: 'Codex',
  doubao: '豆包',
  'grok-bot': 'Grok Bot',
  kimi: 'Kimi',
  workbuddy: 'WorkBuddy'
});

function normalizePlatform(platform) {
  const value = String(platform || '').trim().toLowerCase();
  return PLATFORM_ALIASES[value] || value;
}

function getPlatformAdapter(platform) {
  const id = normalizePlatform(platform);
  const displayName = PLATFORM_ADAPTERS[id];
  if (!displayName) {
    throw new Error(`Unknown platform: ${platform}`);
  }

  return { id, displayName };
}

function buildAutomationSetupPrompt(platform) {
  const { displayName } = getPlatformAdapter(platform);
  return [
    `⚙️ ${displayName}：配置唯一的 ${AUTOMATION_NAME}（${AUTOMATION_KEY}）。`,
    '🔍 先查找：0 条→创建并审核；1 条→复用；多条→保留最早、暂停其余。',
    '⏰ 按当地时间每两小时整点运行；默认窗口 08:00–22:00，实际发送 08:00–20:00；首次先确认提醒时段。',
    `💬 只复用一个 ${AUTOMATION_NAME} 对话；对话被删后才新建对话，不新建自动化。`,
    '🔔 默认开启，支持“关闭人生重启提醒 / 开启人生重启提醒”。',
    '📝 按时段使用题库；每次以“Hi {name}，”开头，只发送问题和行动两行，不显示模块标题。'
  ].join('\n');
}

module.exports = {
  PLATFORM_ADAPTERS,
  buildAutomationSetupPrompt,
  getPlatformAdapter,
  normalizePlatform
};
