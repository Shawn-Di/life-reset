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

默认按照用户当地时间每两个小时检查一次，只在 08:00–22:00 的白天时段发送，不进行 24 小时循环。首次还没有确认提醒时段时，会优先询问：

```text
你希望每天当地几点到几点收到 Life-reset 提醒？
```

询问后暂停提醒；用户亲自确认时段后，适配器保存时段和时区，并恢复同一个自动化。

提醒内容按时段变化，不显示模块标题；首次只询问称呼并停止。用户没有亲自回复时保持待机，不代答、不推测姓名；收到真实用户回复后才直接用名字：

```text
{name}，今天最重要、却最容易被你拖到明天的那件事是什么？立刻打开相关文件或工具，完成第一步，并用一句话回复你接下来一小时唯一要交付的结果；
```

自动化查找、去重和发送成功状态不显示给用户；成功时只显示提问或这一行提醒。Codex 使用绑定在 `Life-reset` 对话上的 heartbeat，不能通过跨任务消息模拟用户输入。

用户完成行动并反馈后，Life-reset 只给出一句战术修正，然后保持静默，直到下一轮提醒；没有反馈时不推进流程，也不会代替用户回复、强迫用户回复或声称用户已经阅读。

### 模块化题库与自定义

题库由多个模块组成。默认模块是 `life-reset-day-one`，每个模块独立保存名称、简介和各时间段的 `prompt` / `action`。模块切换只更新用户状态中的 `moduleId`，不会创建第二个自动化或新对话。

用户可以在对话中说：

- `查看提醒题库`
- `切换到 <模块名或 ID> 题库`
- `自定义提醒题库`

自定义模块格式见 [`skills/life-reset/references/module-format.md`](./skills/life-reset/references/module-format.md)，完整示例见 [`content/custom-module.example.json`](./content/custom-module.example.json)。本地校验和预览：

```bash
npm run validate -- --pack content/custom-module.example.json
npm run generate -- --pack content/custom-module.example.json --module my-module --time 08:00 --name name
```

模块只需配置需要提醒的时间；当前模块没有对应时间内容时跳过该轮提醒。提醒仍只发送一行，不显示模块标题。

不同平台需要分别安装。安装能力和主动提醒能力是两件事：能安装 Skill，不代表平台一定允许 Skill 自己创建对话或定时运行。详见 [`adapters/`](./adapters/) 和 [`docs/platform-support.md`](./docs/platform-support.md)。

### 跨平台防重复自动化

所有平台统一使用自动化名称 `Life-reset` 和标识 `life-reset-v1`。安装或首次启用时先查找现有自动化：没有才创建，有一条就更新复用，有多条就保留一条并暂停重复项。对话被删除时只新建对话，不新建自动化。具体规则见 [`automation-contract.md`](./docs/automation-contract.md)。

## Codex

使用上面的 Codex 一条命令安装，或将 [`skills/life-reset/SKILL.md`](./skills/life-reset/SKILL.md) 复制到 Codex 的 Skill 目录，然后参考 [`adapters/codex/README.md`](./adapters/codex/README.md) 配置周期性自动化。

自动化需要遵守以下行为：

- 第一次提醒创建标题恰好为 `Life-reset` 的新对话。
- 后续提醒读取上一次成功提醒的对话 ID。
- 对话仍可访问时，继续在原对话发送提醒。
- 对话被删除或不可访问时，创建新的 `Life-reset` 对话。
- 用户关闭提醒后，不创建新对话，也不发送新消息。
- 每两个小时检查一次，但只在用户当地时间的提醒窗口内发送。

可直接复制 [`Codex 自动化提示词`](./adapters/codex/automation-prompt.md)。Codex 中只保留一个 `Life-reset` 自动化；如果用户修改提醒时段，应更新原自动化，不要新建第二个。

## 项目结构

```text
life-reset/
├─ skills/life-reset/          # 标准 Agent Skill 安装目标
│  ├─ SKILL.md                 # AI 读取的持续会话指令
│  └─ agents/openai.yaml       # Codex UI 元数据
├─ .claude-plugin/plugin.json  # Claude Code 插件元数据
├─ kimi.plugin.json            # Kimi Code 插件元数据
├─ plugin.json                 # Antigravity 插件元数据
├─ content/                    # 模块化提醒内容包
├─ schema/                     # 内容格式契约
├─ src/                        # 内容加载、提醒生成、状态决策
├─ scripts/                    # 可选的本地校验和生成命令
├─ adapters/                   # 各平台接入说明
├─ docs/                       # 架构与实施文档
└─ test/                       # 自动化测试
```

## 开发

需要 Node.js 20 或更高版本才能运行本地开发命令：

```bash
npm test
npm run validate
npm run generate
```

修改提醒内容时，请同时更新来源链接和版权说明，并确保测试通过。

## 参与贡献

欢迎提交：

- 新的平台适配说明。
- 更清晰的提醒内容和行动问题。
- 内容校验和状态决策测试。
- 平台实际能力变化后的文档更新。

新增适配器时，请明确写出真实支持的能力、需要的用户配置和降级方案，不要声明未经验证的私有 API。

## License

MIT License，详见 [`LICENSE`](./LICENSE)。
