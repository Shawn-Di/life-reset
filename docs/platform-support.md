# Platform support

The core content pack and reminder generator are platform-neutral. Integration depth depends on whether a host exposes user-owned scheduling, new-conversation creation, and sending to an existing conversation.

| Platform | Skill import | New conversation | Continue saved conversation | Current status |
| --- | --- | --- | --- | --- |
| Codex | `skills/life-reset/SKILL.md` or `npx skills add ... -a codex` | Use host automation | Use saved task ID when available | First adapter template |
| Claude Code | `npx skills add ... -a claude-code` or Claude plugin | Configure host workflow | Configure host workflow | Generic adapter |
| Kimi | `/plugins install <GitHub URL>` or `npx skills add ... -a kimi-code-cli` | Configure Kimi workflow if available | Configure Kimi workflow if available | Generic adapter |
| WorkBuddy | `gh skill install ...` preview or Skill Marketplace ZIP | Configure WorkBuddy workflow if available | Configure WorkBuddy workflow if available | Generic adapter |
| 豆包 | Import or paste Skill instructions | Configure 豆包 workflow if available | Configure 豆包 workflow if available | Generic adapter |
| AutoGravity | `agy plugin install <GitHub URL>` or `npx skills add ... -a antigravity` | Configure AutoGravity workflow if available | Configure AutoGravity workflow if available | Generic adapter |
| Grok Build | `npx skills add ... -a grok` | Configure Grok workflow if available | Configure Grok workflow if available | Generic adapter |
| Grok Bot | Import or paste Skill instructions or official marketplace | Configure Grok workflow if available | Configure Grok workflow if available | Generic adapter |

No adapter claims private API support. If a platform cannot create a new conversation or send to an existing one, use the generated message manually or connect it to that platform's own workflow system. Every adapter must follow the shared [`automation contract`](./automation-contract.md): one active `Life-reset` automation per host, key `life-reset-v1`, with duplicates paused rather than recreated.

Scheduling defaults to a two-hour interval in the user's local timezone. Adapters must send only inside the configured daytime window, defaulting to 08:00–22:00. If the user has not confirmed a preferred window, ask for it first and temporarily use the default.

Every adapter should preserve these rules:

1. Reminders are enabled by default.
2. The user can say “关闭人生重启提醒” or “开启人生重启提醒”.
3. The operation uses the user's existing platform identity and token.
4. The first new conversation is titled exactly `Life-reset`.
5. Later reminders reuse the saved conversation when it remains accessible.
6. If the saved conversation was deleted or is inaccessible, create a replacement titled exactly `Life-reset`, without creating another automation.
