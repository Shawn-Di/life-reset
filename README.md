# 人生重启 / Life-reset

一个开源的 AI 主动提醒 Skill。它以 Dan Koe 的文章《How to fix your entire life in 1 day》为第一份内容源，提醒用户重新审视当前生活、方向和下一步行动。

## 特性

- 提醒默认开启，可在对话中说“关闭人生重启提醒”或“开启人生重启提醒”。
- 第一次提醒创建一个标题为 `Life-reset` 的新对话。
- 后续提醒继续使用上一次对话；只有原对话不存在或不可访问时才新建。
- 新对话在整个生命周期内保持人生导师模式，并优先处理个人成长相关内容。
- 不拥有独立 Token，始终使用用户在对应 AI 工具中的账号、权限和 Token。
- 仓库只保存原创摘要、行动问题和原文链接，不保存文章全文。

## 快速开始

需要 Node.js 20 或更高版本：

```bash
npm test
npm run validate
npm run generate -- --include-session-instruction
```

不带 `--include-session-instruction` 时，只输出一次提醒消息：

```bash
npm run generate
```

## 安装

第一适配目标是 Codex。将根目录的 `SKILL.md` 复制到用户 Skill 目录，并参考 [`adapters/codex/README.md`](./adapters/codex/README.md) 配置周期性自动化。

其他平台的接入说明位于 [`adapters/`](./adapters/)，当前以通用 Skill / 工作流契约为主，不假设平台提供相同的自动化 API。

## 项目结构

- `content/`：经过选择的提醒内容。
- `schema/`：内容包契约。
- `src/`：内容加载、提醒生成和提醒状态决策。
- `scripts/`：本地校验和提醒生成命令。
- `adapters/`：各 AI 工具的接入说明。
- `docs/`：架构和平台支持说明。

## 添加内容

新增内容时只提交短摘要、思考问题、行动建议、来源链接和版权说明。不要复制来源文章全文。修改内容后运行 `npm run validate` 和 `npm test`。

## 开源协作

欢迎提交新的平台适配说明、内容包改进和测试。平台适配必须明确说明真实支持的能力，并遵守用户 Token 和对话权限边界。
