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
  autogravity: { displayName: 'AutoGravity', scheduler: 'native-workflow' },
  'claude-code': { displayName: 'Claude Code', scheduler: 'native-workflow' },
  codex: { displayName: 'Codex', scheduler: 'native-automation' },
  doubao: { displayName: '豆包', scheduler: 'native-workflow' },
  'grok-bot': { displayName: 'Grok Bot', scheduler: 'native-workflow' },
  kimi: { displayName: 'Kimi', scheduler: 'native-workflow' },
  workbuddy: { displayName: 'WorkBuddy', scheduler: 'native-workflow' }
});

function normalizePlatform(platform) {
  const value = String(platform || '').trim().toLowerCase();
  return PLATFORM_ALIASES[value] || value;
}

function getPlatformAdapter(platform) {
  const id = normalizePlatform(platform);
  const adapter = PLATFORM_ADAPTERS[id];
  if (!adapter) {
    throw new Error(`Unknown platform: ${platform}`);
  }

  return { id, ...adapter };
}

function buildAutomationSetupPrompt(platform) {
  const adapter = getPlatformAdapter(platform);
  return `在${adapter.displayName}中配置或更新唯一的 ${AUTOMATION_NAME} 自动化（key: ${AUTOMATION_KEY}）。先列出现有自动化：没有时创建一条并等待用户审核；有一条时更新并复用；有多条时保留最早的一条并暂停重复项。不要按提醒时间创建多条自动化，也不要创建 heartbeat。按用户当地时间每两小时整点运行，默认 08:00–20:00。保存一个 ${AUTOMATION_NAME} 对话 ID 并持续复用；对话被删除或不可访问时只新建一个同名对话，不创建新的自动化。提醒正文只发送两行，不发送 Skill 初始化、标题、摘要、来源或时间段问题。`;
}

module.exports = {
  PLATFORM_ADAPTERS,
  buildAutomationSetupPrompt,
  getPlatformAdapter,
  normalizePlatform
};
