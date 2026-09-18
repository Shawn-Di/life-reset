# Claude Code adapter

Install with one command:

```bash
npx skills add Shawn-Di/life-reset -a claude-code
```

The repository also includes Claude Code plugin metadata. In Claude Code, add the repository as a marketplace and install `life-reset`, or copy `skills/life-reset/SKILL.md` into the host's user Skill directory. Configure the host's own scheduler to run `npm run generate` and deliver the output.

Use the user's existing Claude Code identity and token. Reminders are enabled by default and can be changed with “关闭人生重启提醒” or “开启人生重启提醒”. If the host supports task creation and task IDs, save the last ID, reuse it while accessible, and create a new conversation titled `Life-reset` when it is missing. This repository does not claim a private Claude Code automation API.
