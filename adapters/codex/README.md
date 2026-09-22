# Codex adapter

This adapter uses the user's existing Codex account and permissions. `life-reset` does not provide a separate token.

## Install the Skill

Install the standard Skill target with one command:

```bash
npx skills add Shawn-Di/life-reset -a codex
```

Manual fallback:

Copy `skills/life-reset/SKILL.md` into the Codex user Skill directory:

```text
Windows: %USERPROFILE%\.codex\skills\life-reset\SKILL.md
macOS/Linux: ~/.codex/skills/life-reset/SKILL.md
```

The Codex UI metadata is in `skills/life-reset/agents/openai.yaml`.

On the first `$life-reset` activation, Codex should show one reviewable proposal for the user-owned `Life-reset` automation when none exists. Enable it only after approval. Keep exactly one active automation and reuse or update it rather than duplicating it. If the host cannot expose automation creation, use [`automation-prompt.md`](./automation-prompt.md) once.

## Connect the reminder

Use the one-line prompt in [`automation-prompt.md`](./automation-prompt.md) when configuring a recurring Codex automation. Codex displays the scheduled-task input in the chat, so keep it to the Skill invocation plus the minimal reminder action. Use one thread-bound heartbeat so its assistant response appears directly in the `Life-reset` task. Do not use a standalone cron plus `send_message_to_thread`; Codex renders that cross-task message on the user side.

- First run: create a new task titled `Life-reset` and attach the one heartbeat.
- Later runs: let that heartbeat produce the assistant reminder in the same task.
- Delayed start: use the current local hour's slot; do not require minute `00` again inside the Skill.
- Deleted or inaccessible task: create a replacement titled `Life-reset`.
- Waiting for required user input: pause the heartbeat; reactivate the same one after the user replies.
- Disabled reminders: pause the heartbeat.

When waiting for user input, the heartbeat emits nothing. Successful runs contain only the question or reminder body—never progress, delivery records, or inbox items.
