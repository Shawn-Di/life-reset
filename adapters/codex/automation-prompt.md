# Codex automation prompt

Copy this prompt into the host's recurring automation configuration:

```text
Run the life-reset reminder using my existing Codex account and permissions. Reminders are enabled by default, but respect the latest user instruction “关闭人生重启提醒” or “开启人生重启提醒”.

Use the bundled life-reset content and generate one Chinese reminder. The first run must create a new task titled exactly “Life-reset”. Store its task ID in my user-owned automation state. On later runs, if that task still exists and is accessible, continue in it and send the reminder there. If it was deleted or is inaccessible, create a replacement task titled exactly “Life-reset” and replace the stored task ID.

Every newly created task must begin with the life-reset mentor session instruction: keep the Skill active for the lifetime of the conversation, prioritize personal growth, life direction, goals, habits, attention, action, and review, give concrete next steps, and answer unrelated topics directly. The next message content should be the generated reminder and its source URL.

Do not request, create, or store a separate token. Do not force a popup or claim that the user has read the reminder.
```
