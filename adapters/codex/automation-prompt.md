# Codex automation prompt

The visible scheduled-task trigger cannot be hidden by a Skill. Keep it to this single invocation and store all durable behavior in the installed Skill:

```text
$life-reset 新提醒时段已到；即使上一轮未回复，也按当前本地小时发送本轮提醒，只输出提醒正文。
```

When waiting for the user's name or schedule preference, pause this heartbeat. Reactivate the same heartbeat after the user replies.
