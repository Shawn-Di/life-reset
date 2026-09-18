# Codex automation prompt

Copy this prompt into the host's recurring automation configuration:

```text
Run the Life-reset reminder using my existing Codex account, permissions, and token. Reminders are enabled by default, but respect the latest user instruction “关闭人生重启提醒” or “开启人生重启提醒”. This is the only Life-reset automation: never create a second automation, heartbeat, or separate “保持 Life-reset 模式” task.

Run the single automation at minute 00 every two hours in the user's local timezone. The default daytime schedule is 08:00, 10:00, 12:00, 14:00, 16:00, 18:00, and 20:00; do not use heartbeat jitter or a 24-hour loop. If the user chooses another daytime window, update this automation only and preserve the two-hour interval. Store the schedule in user-owned automation state.

Use the bundled life-reset content and generate exactly two lines. On the first run, create one task titled exactly “Life-reset” and store its task ID. On later runs, continue in that task while it is accessible. If it was deleted or inaccessible, create one replacement task titled exactly “Life-reset” and replace the stored task ID.

Do not send a session-initialization message, title, summary, source URL, or scheduling question. The reminder body must be exactly:

【致命拷问】 今天最重要、却最容易被你拖到明天的那件事是什么？
【即刻行动】 立刻打开相关文件或工具，完成第一步，并用一句话回复你接下来一小时唯一要交付的结果；

After the user gives a short report, reply with one sentence of tactical correction and then remain silent until the next scheduled reminder. Do not pressure the user or claim that they read the reminder.

Do not request, create, or store a separate token. Do not force a popup or claim that the user has read the reminder.
```
