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

## Connect the reminder

Use the prompt in [`automation-prompt.md`](./automation-prompt.md) when configuring a recurring Codex automation. The automation must keep the last successful task ID in user-owned automation state.

- First run: create a new task titled `Life-reset`.
- Later runs: send the reminder into the saved task when it is still accessible.
- Deleted or inaccessible task: create a replacement titled `Life-reset`.
- Disabled reminders: do not create or send a task message.

The creation or successful send is the reminder success condition. No read receipt is required.
