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
  const { id, displayName } = getPlatformAdapter(platform);
  const delivery = id === 'codex'
    ? '💓 使用绑定在 Life-reset 对话上的唯一 heartbeat，任务提示必须严格为“$life-reset”；等待用户输入时暂停；禁止 standalone cron 和 send_message_to_thread。'
    : `💬 只复用一个 ${AUTOMATION_NAME} 对话；优先使用绑定在该对话上的原生定时能力，禁止用跨对话消息代替用户输入。`;

  return [
    `⚙️ ${displayName}：配置唯一的 ${AUTOMATION_NAME}（${AUTOMATION_KEY}）。`,
    '🔍 先查找：0 条→创建并审核；1 条→复用；多条→保留最早、暂停其余。',
    '⏰ 用户当地时间仅在 08:00、10:00、12:00、14:00、16:00、18:00、20:00 触发；默认窗口 08:00–22:00；按当前本地小时选择题库内容。',
    delivery,
    '🔎 配置或修复时查找可访问且标题精确为 Life-reset 的对话；找到就绑定，只有 0 条才新建并保存对话 ID。',
    '🔔 默认开启，支持“关闭 Life-reset 提醒 / 开启 Life-reset 提醒”。',
    '🧩 默认使用 life-reset-day-one 题库；支持“查看题库 / 切换题库 / 自定义题库”。',
    '👤 首次由助手只输出“我该怎么称呼你？”并立即结束本轮；用户未回复时不输出任何文字。只接受真实用户消息作为答案；禁止代答、推测姓名，禁止把自动化、助手、工具、系统或跨任务消息当作回复。定时只发“{name}，问题”；用户首次回复后只发对应行动；再次回复只发“现在就开始行动好了”。不加 Hi、不换行。',
    '🙈 成功时只显示提问或提醒正文；禁止进度说明、运行总结、发送记录、已记录、inbox-item 或去重状态。'
  ].join('\n');
}

module.exports = {
  PLATFORM_ADAPTERS,
  buildAutomationSetupPrompt,
  getPlatformAdapter,
  normalizePlatform
};
