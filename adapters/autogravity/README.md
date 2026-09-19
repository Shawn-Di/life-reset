# AutoGravity adapter

Antigravity CLI native install:

```bash
agy plugin install https://github.com/Shawn-Di/life-reset
```

Portable Skill install:

```bash
npx skills add Shawn-Di/life-reset -a antigravity
```

The repository can print the canonical AutoGravity setup prompt with:

```bash
npm run adapter-setup -- --platform autogravity
```

If neither is available, import or paste `skills/life-reset/SKILL.md` into AutoGravity's supported custom instruction or Skill area. Connect the generated reminder to one AutoGravity workflow or scheduling rule when available.

Use the user's existing AutoGravity identity and token. Reminders are enabled by default and can be changed with “关闭人生重启提醒” or “开启人生重启提醒”. AutoGravity must have exactly one active automation named `Life-reset` with key `life-reset-v1`:

```text
⚙️ 配置唯一的 Life-reset（life-reset-v1）。🔍 0 条→创建并审核；1 条→复用；多条→保留最早、暂停其余。⏰ 当地时间每两小时整点；默认窗口 08:00–22:00，实际发送 08:00–20:00；首次先确认提醒时段。💬 只复用一个 Life-reset 对话；对话被删后才新建对话，不新建自动化。🔎 每次运行先查找标题精确为 Life-reset 的可访问对话，找到就继续，只有 0 条才新建。🔔 默认开启，支持关闭/开启提醒。🧩 默认使用 life-reset-day-one 题库；支持查看/切换/自定义题库。📝 按时段使用题库，以“Hi {name}，”开头，只发送问题和行动两行，不显示模块标题。
```

If AutoGravity cannot list or update automation IDs, configure that prompt once in its native workflow editor and do not create another workflow with the same purpose. This repository does not claim a private AutoGravity automation API.
