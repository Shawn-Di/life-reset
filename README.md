# Life-reset

一个会主动提醒你重新审视生活方向的 AI Skill。

它以 Dan Koe 的文章内容源，在 AI 工具中创建或继续一个名为 `Life-reset` 的对话。这个对话会默认围绕目标、习惯、注意力、行动和复盘展开。

## 工作方式

Life-reset 分成三个部分：

1. `skills/life-reset/SKILL.md`：告诉 AI 如何保持人生导师模式。
2. `content/`：保存可切换的提醒题库模块、问题、行动和原文链接。
3. `adapters/`：说明如何接入不同 AI 工具的 Skill、任务和自动化。

Skill 不拥有独立 Token，也不代替用户登录。调度、新建对话和继续对话都使用用户在对应平台已有的账号、权限和 Token。

## 支持的平台

| 平台 | 安装命令 |
| --- | --- |
| Codex | `npx skills add Shawn-Di/life-reset -a codex` |
| Claude Code | `npx skills add Shawn-Di/life-reset -a claude-code` |
| Kimi | `/plugins install https://github.com/Shawn-Di/life-reset` |
| WorkBuddy | `gh skill install Shawn-Di/life-reset skills/life-reset --dir .workbuddy/skills` |
| 豆包 | 手动导入 [`skills/life-reset/SKILL.md`](./skills/life-reset/SKILL.md) |
| Antigravity | `agy plugin install https://github.com/Shawn-Di/life-reset` |
| Grok Bot | `npx skills add Shawn-Di/life-reset -a grok` |

## 参与贡献

欢迎提交：

- 新的平台适配说明。
- 更清晰的提醒内容和行动问题。
- 内容校验和状态决策测试。
- 平台实际能力变化后的文档更新。

新增适配器时，请明确写出真实支持的能力、需要的用户配置和降级方案，不要声明未经验证的私有 API。

## License

MIT License，详见 [`LICENSE`](./LICENSE)。
