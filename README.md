# Life-reset

一个会主动提醒你重新审视生活方向的 AI Skill。

它以 Dan Koe 的文章《How to fix your entire life in 1 day》为第一份内容源，在 AI 工具中创建或继续一个名为 `Life-reset` 的对话。这个对话会持续保持人生导师模式，默认围绕目标、习惯、注意力、行动和复盘展开。

## 它解决什么问题

很多提醒只告诉你“该做什么”，却不会留下连续的思考空间。Life-reset 把提醒变成一段持续的对话：

```text
第一次提醒  → 创建 Life-reset 对话
后续提醒    → 继续同一个对话
对话被删除  → 创建新的 Life-reset 对话
提醒已关闭  → 本轮不创建、不发送
```

提醒默认开启。你可以直接在对话中说：

```text
关闭人生重启提醒
开启人生重启提醒
```

## 30 秒开始

Skill 本身不要求 Node.js。支持通用 Agent Skills 标准的 CLI 可以直接安装标准入口：

```bash
npx skills add https://github.com/Shawn-Di/life-reset/tree/master/skills/life-reset -g -a codex --copy -y
```

上面的 `npx skills` 是安装器，因此只有使用这条命令时才需要 Node.js 20+ 和 npm。也可以手动把 [`skills/life-reset/SKILL.md`](./skills/life-reset/SKILL.md) 复制到目标 AI 工具的 Skill / 自定义指令目录。

安装后，把下面的提醒消息交给它：

```text
初始化 Life-reset。保持人生导师模式，默认启用主动提醒。
第一次创建标题为 Life-reset 的新对话；以后优先继续同一对话，只有对话不存在或不可访问时才新建。
```

如果你需要本地校验或生成提醒，再使用 Node.js：

```bash
npm test
npm run validate
npm run generate -- --include-session-instruction
```

## 各平台一条命令安装

下面的命令都指向同一个可安装目录：[`skills/life-reset/`](./skills/life-reset)。`npx skills` 支持 Codex、Claude Code、Cursor、Antigravity、Kimi Code CLI、Grok Build 等多种 Agent，完整支持列表见 [vercel-labs/skills](https://github.com/vercel-labs/skills#supported-agents)。

### Codex CLI

```bash
npx skills add https://github.com/Shawn-Di/life-reset/tree/master/skills/life-reset -g -a codex --copy -y
```

Codex App 也可以在 Plugins 面板中搜索 `life-reset` 后安装；周期性主动提醒需要再配置 Codex 自动化，见 [`adapters/codex/`](./adapters/codex/)。

### Claude Code / CC

```bash
npx skills add https://github.com/Shawn-Di/life-reset/tree/master/skills/life-reset -g -a claude-code --copy -y
```

如果使用 Claude Code 插件市场，也可以执行：

```text
/plugin marketplace add Shawn-Di/life-reset
/plugin install life-reset@life-reset
```

### Kimi Code

Kimi Code 原生安装命令：

```text
/plugins install https://github.com/Shawn-Di/life-reset
```

Kimi Code CLI 也可以使用通用安装器：

```bash
npx skills add https://github.com/Shawn-Di/life-reset/tree/master/skills/life-reset -g -a kimi-code-cli --copy -y
```

### WorkBuddy

WorkBuddy 的 `gh skill` 安装方式仍属于预览能力；在已安装对应 GitHub CLI 扩展时可以执行：

```bash
gh skill install Shawn-Di/life-reset skills/life-reset --dir .workbuddy/skills
```

如果当前 WorkBuddy 版本没有 `gh skill`，请在 WorkBuddy 的 Skill Marketplace 上传仓库发布的 ZIP 包。

### 豆包

目前没有查到豆包公开、稳定且可验证的 Skill 一键安装 CLI。可以先复制 [`skills/life-reset/SKILL.md`](./skills/life-reset/SKILL.md) 到豆包的自定义指令或 Skill 入口；主动提醒则接入豆包自己的工作流或定时任务。

### Antigravity / AutoGravity

Antigravity CLI 原生安装命令：

```bash
agy plugin install https://github.com/Shawn-Di/life-reset
```

也可以使用通用安装器：

```bash
npx skills add https://github.com/Shawn-Di/life-reset/tree/master/skills/life-reset -g -a antigravity --copy -y
```

### Grok Build / Grok Bot

Grok Build CLI 可以使用通用安装器：

```bash
npx skills add https://github.com/Shawn-Di/life-reset/tree/master/skills/life-reset -g -a grok --copy -y
```

Grok Bot 网页端目前没有可验证的 GitHub Skill 一键安装命令。若使用 Grok 官方插件市场，需要先在 `/marketplace` 中找到已发布的 `life-reset`；否则请导入 [`skills/life-reset/SKILL.md`](./skills/life-reset/SKILL.md) 到可用的自定义指令入口。

## 工作方式

Life-reset 分成三个部分：

1. `skills/life-reset/SKILL.md`：告诉 AI 如何保持人生导师模式。
2. `content/`：保存提醒内容、行动问题和原文链接。
3. `adapters/`：说明如何接入不同 AI 工具的 Skill、任务和自动化。

Skill 不拥有独立 Token，也不代替用户登录。调度、新建对话和继续对话都使用用户在对应平台已有的账号、权限和 Token。

## 支持的平台

| 平台 | Skill 接入 | 自动新建 / 继续对话 | 当前状态 |
| --- | --- | --- | --- |
| Codex | 支持 | 使用平台自动化配置 | 第一适配目标 |
| Claude Code | 支持 | 使用平台工作流配置 | 通用适配 |
| Kimi | 支持自定义指令时可用 | 取决于平台工作流 | 通用适配 |
| WorkBuddy | 支持自定义指令时可用 | 取决于平台工作流 | 通用适配 |
| 豆包 | 支持自定义指令时可用 | 取决于平台工作流 | 通用适配 |
| Antigravity | 支持 | 使用平台 Skill / Plugin 能力 | 通用适配 |
| Grok Bot | 支持自定义指令时可用 | 取决于平台工作流 | 通用适配 |

不同平台需要分别安装。安装能力和主动提醒能力是两件事：能安装 Skill，不代表平台一定允许 Skill 自己创建对话或定时运行。详见 [`adapters/`](./adapters/) 和 [`docs/platform-support.md`](./docs/platform-support.md)。

## Codex

使用上面的 Codex 一条命令安装，或将 [`skills/life-reset/SKILL.md`](./skills/life-reset/SKILL.md) 复制到 Codex 的 Skill 目录，然后参考 [`adapters/codex/README.md`](./adapters/codex/README.md) 配置周期性自动化。

自动化需要遵守以下行为：

- 第一次提醒创建标题恰好为 `Life-reset` 的新对话。
- 后续提醒读取上一次成功提醒的对话 ID。
- 对话仍可访问时，继续在原对话发送提醒。
- 对话被删除或不可访问时，创建新的 `Life-reset` 对话。
- 用户关闭提醒后，不创建新对话，也不发送新消息。

可直接复制 [`Codex 自动化提示词`](./adapters/codex/automation-prompt.md)。

## 其他平台

每个平台的接入深度取决于它是否公开提供：

- Skill / 自定义指令导入能力。
- 定时或随机调度能力。
- 创建新对话能力。
- 向已有对话发送消息的能力。
- 用户级状态保存能力。

如果平台只支持 Skill，不支持主动新建对话，仍然可以手动运行提醒；仓库不会把平台没有提供的能力包装成原生功能。新建对话是平台自己的提醒状态和对话能力，不是强行要求用户观看。

## 内容

第一份内容是 Dan Koe 的《How to fix your entire life in 1 day》：

- 通过反思当前不想继续的生活，明确新的方向。
- 把方向拆成年度使命、月度项目和每日行动。
- 用一个具体问题和一个最小行动结束每次提醒。

原文：[letters.thedankoe.com/p/how-to-fix-your-entire-life-in-1](https://letters.thedankoe.com/p/how-to-fix-your-entire-life-in-1)

仓库只保存原创摘要、思考问题、行动建议和来源链接，不保存或重新发布文章全文。

## 项目结构

```text
life-reset/
├─ skills/life-reset/          # 标准 Agent Skill 安装目标
│  ├─ SKILL.md                 # AI 读取的持续会话指令
│  └─ agents/openai.yaml       # Codex UI 元数据
├─ .claude-plugin/plugin.json  # Claude Code 插件元数据
├─ kimi.plugin.json            # Kimi Code 插件元数据
├─ plugin.json                 # Antigravity 插件元数据
├─ content/                    # 提醒内容包
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
npm run generate -- --include-session-instruction
```

修改提醒内容时，请同时更新来源链接和版权说明，并确保测试通过。

## 安全与隐私

- Skill 不读取或保存用户 Token。
- Skill 不自动登录第三方平台。
- 自动化只使用用户已有的平台权限。
- 安装第三方 Skill 前，应先检查其脚本、外部请求和权限范围。

## 参与贡献

欢迎提交：

- 新的平台适配说明。
- 更清晰的提醒内容和行动问题。
- 内容校验和状态决策测试。
- 平台实际能力变化后的文档更新。

新增适配器时，请明确写出真实支持的能力、需要的用户配置和降级方案，不要声明未经验证的私有 API。

## License

MIT License，详见 [`LICENSE`](./LICENSE)。
