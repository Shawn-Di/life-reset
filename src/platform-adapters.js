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
    '⏰ 用户当地时间仅在 08:00、10:00、12:00、14:00、16:00、18:00、20:00 触发；默认窗口 08:00–22:00；按当前本地小时选择题库内容。',
    `💬 只复用一个 ${AUTOMATION_NAME} 对话；对话被删后才新建对话，不新建自动化。`,
    '🔎 每次运行先查找可访问且标题精确为 Life-reset 的对话；找到就继续，只有 0 条才新建并保存对话 ID。',
    '🔔 默认开启，支持“关闭人生重启提醒 / 开启人生重启提醒”。',
    '🧩 默认使用 life-reset-day-one 题库；支持“查看题库 / 切换题库 / 自定义题库”。',
    '👤 首次先问“我该怎么称呼你？”并保存答案；之后只发一行“{name}，问题 行动”，不加 Hi、不换行。',
    '🙈 成功时只发送提醒正文，不输出“已处理”“已发送”或去重处理状态；只有失败或需要用户操作时才说明。'
  ].join('\n');
}

module.exports = {
  PLATFORM_ADAPTERS,
  buildAutomationSetupPrompt,
  getPlatformAdapter,
  normalizePlatform
};
