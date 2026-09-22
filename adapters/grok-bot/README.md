# Grok Bot adapter

Grok Build CLI portable install:

```bash
npx skills add Shawn-Di/life-reset -a grok
```

Grok Bot 网页端目前没有可验证的 GitHub Skill 一键安装命令。请在官方插件市场找到已发布的 `life-reset`，或导入 `skills/life-reset/SKILL.md` 到支持的自定义指令入口。Connect the generated reminder to the host's own workflow or scheduling feature when available.

Use the user's existing Grok identity and token. Reminders are enabled by default and can be changed with “关闭 Life-reset 提醒” or “开启 Life-reset 提醒”. If new-conversation automation is available, configure exactly one active automation named `Life-reset` with key `life-reset-v1`, reuse it on later runs, and pause duplicates. Save and reuse one `Life-reset` conversation ID; otherwise deliver the generated reminder manually. This repository does not claim a private Grok automation API.
