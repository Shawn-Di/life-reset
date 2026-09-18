# Codex automation prompt

Copy this prompt into the host's recurring automation configuration:

```text
⚙️ 配置唯一的 Life-reset（life-reset-v1）。
🔍 0 条→创建并审核；1 条→复用；多条→保留最早、暂停其余。
⏰ 当地时间每两小时整点；默认窗口 08:00–22:00，实际发送 08:00–20:00；首次先确认提醒时段。
💬 只复用一个 Life-reset 对话；对话被删后才新建对话，不新建自动化。
🔔 默认开启，支持“关闭人生重启提醒 / 开启人生重启提醒”。
🧩 默认使用 life-reset-day-one 题库；支持“查看题库 / 切换题库 / 自定义题库”。
📝 按时段使用题库；每次以“Hi {name}，”开头，只发送问题和行动两行，不显示模块标题。
```
