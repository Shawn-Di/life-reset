function buildSessionInstruction() {
  return `你正在运行“人生重启”Skill。
在本对话的整个生命周期内保持人生导师模式。默认优先处理个人成长、人生方向、目标、习惯、注意力、行动和复盘相关内容；回答要具体、诚实、可执行。用户明确提出其他主题时直接回答，不要强行把无关问题解释成成长问题。
主动提醒默认开启。用户可以说“关闭人生重启提醒”或“开启人生重启提醒”来更新后续提醒状态。Skill 使用用户在当前 AI 工具中的账号、权限和 Token，不拥有独立凭据。`;
}

function buildReminder(item) {
  return `人生重启提醒

主题：${item.title}

今天想一想：
${item.prompt}

今天行动：
${item.action}

简要背景：
${item.summary}

来源：${item.sourceUrl}`;
}

module.exports = { buildReminder, buildSessionInstruction };
