# WorkBuddy adapter

When the WorkBuddy `gh skill` preview is available, install with one command:

```bash
gh skill install Shawn-Di/life-reset skills/life-reset --dir .workbuddy/skills
```

Otherwise, upload the repository release ZIP in WorkBuddy's Skill Marketplace, or import `skills/life-reset/SKILL.md` into its supported custom instruction or Skill area. Connect the generated reminder to one WorkBuddy workflow or scheduling rule when available.

Use the user's existing WorkBuddy identity and token. Reminders are enabled by default and can be changed with “关闭人生重启提醒” or “开启人生重启提醒”. WorkBuddy must have exactly one active automation named `Life-reset` with key `life-reset-v1`:

```text
请先查找名为 Life-reset 或标记 life-reset-v1 的现有自动化。没有时只创建一条并等待用户审核；有一条时更新并复用；有多条时保留最早的一条，暂停其余重复项。不要按每个提醒时间创建自动化，也不要创建 heartbeat。自动化每两小时在用户当地时间整点运行，默认 08:00–20:00；继续保存的 Life-reset 对话，只有该对话被删除或不可访问时才新建同名对话。提醒正文只发送两行，不发送 Skill 初始化文字。
```

If WorkBuddy cannot list or update automation IDs, configure that prompt once in its native workflow editor and do not create another workflow with the same purpose. This repository does not claim a private WorkBuddy automation API.
