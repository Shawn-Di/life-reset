# WorkBuddy adapter

When the WorkBuddy `gh skill` preview is available, install with one command:

```bash
gh skill install Shawn-Di/life-reset skills/life-reset --dir .workbuddy/skills
```

The repository can print the canonical WorkBuddy setup prompt with:

```bash
npm run adapter-setup -- --platform workbuddy
```

Otherwise, upload the repository release ZIP in WorkBuddy's Skill Marketplace, or import `skills/life-reset/SKILL.md` into its supported custom instruction or Skill area. Connect the generated reminder to one WorkBuddy workflow or scheduling rule when available.

Use the user's existing WorkBuddy identity and token. Reminders are enabled by default and can be changed with “关闭人生重启提醒” or “开启人生重启提醒”. WorkBuddy must have exactly one active automation named `Life-reset` with key `life-reset-v1`:

```text
⚙️ 配置唯一的 Life-reset（life-reset-v1）。🔍 0 条→创建并审核；1 条→复用；多条→保留最早、暂停其余。⏰ 当地时间每两小时整点；默认窗口 08:00–22:00，实际发送 08:00–20:00；首次先确认提醒时段。💬 只复用一个 Life-reset 对话；对话被删后才新建对话，不新建自动化。🔔 默认开启，支持关闭/开启提醒。📝 按时段使用题库，以“Hi {name}，”开头，只发送问题和行动两行，不显示模块标题。
```

If WorkBuddy cannot list or update automation IDs, configure that prompt once in its native workflow editor and do not create another workflow with the same purpose. This repository does not claim a private WorkBuddy automation API.
