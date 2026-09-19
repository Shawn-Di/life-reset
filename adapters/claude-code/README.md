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
⚙️ 配置唯一的 Life-reset（life-reset-v1）。🔍 0 条→创建并审核；1 条→复用；多条→保留最早、暂停其余。⏰ 当地时间每两小时整点；默认窗口 08:00–22:00，实际发送 08:00–20:00；首次先确认提醒时段。💬 只复用一个 Life-reset 对话；对话被删后才新建对话，不新建自动化。🔎 每次运行先查找标题精确为 Life-reset 的可访问对话，找到就继续，只有 0 条才新建。🔔 默认开启。🧩 默认使用 life-reset-day-one 题库；支持查看/切换/自定义题库。📝 按时段使用题库，以“Hi {name}，”开头，只发送问题和行动两行，不显示模块标题。
```
