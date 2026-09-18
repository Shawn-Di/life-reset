# Claude Code adapter

Install with one command:

```bash
npx skills add Shawn-Di/life-reset -a claude-code
```

The repository can print the canonical Claude Code setup prompt with:

```bash
npm run adapter-setup -- --platform cc
```

The repository also includes Claude Code plugin metadata. In Claude Code, add the repository as a marketplace and install `life-reset`, or copy `skills/life-reset/SKILL.md` into the host's user Skill directory. Configure one native scheduler to run `npm run generate` and deliver the output.

Use the user's existing Claude Code identity and token. Reminders are enabled by default and can be changed with “关闭人生重启提醒” or “开启人生重启提醒”. The scheduler must use exactly one automation named `Life-reset` with key `life-reset-v1`: list before creating, reuse or update the existing entry, and pause duplicates instead of creating another. Save one conversation ID, reuse it while accessible, and create a new conversation titled `Life-reset` only when it is missing. This repository does not claim a private Claude Code automation API.

Use this as the one-time scheduler setup prompt:

```text
配置或更新唯一的 Life-reset 自动化（key: life-reset-v1）。先查找现有自动化；没有时创建一条并等待审核，有一条时复用，有多条时保留最早的一条并暂停重复项。每两小时按用户当地时间整点运行，默认 08:00–20:00。保存一个 Life-reset 对话 ID并持续复用；对话被删除后只新建一个同名对话，不创建新的自动化。提醒只发送两行正文，不发送初始化模式消息。
```
