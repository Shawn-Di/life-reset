# Platform support

The core content pack and reminder generator are platform-neutral. Integration depth depends on whether a host exposes user-owned scheduling, new-conversation creation, and sending to an existing conversation.

| Platform | Skill import | New conversation | Continue saved conversation | Current status |
| --- | --- | --- | --- | --- |
| Codex | `SKILL.md` | Use host automation | Use saved task ID when available | First adapter template |
| Claude Code | Copy Skill instructions | Configure host workflow | Configure host workflow | Generic adapter |
| Kimi | Import or paste Skill instructions | Configure Kimi workflow if available | Configure Kimi workflow if available | Generic adapter |
| WorkBuddy | Import or paste Skill instructions | Configure WorkBuddy workflow if available | Configure WorkBuddy workflow if available | Generic adapter |
| 豆包 | Import or paste Skill instructions | Configure 豆包 workflow if available | Configure 豆包 workflow if available | Generic adapter |
| AutoGravity | Import or paste Skill instructions | Configure AutoGravity workflow if available | Configure AutoGravity workflow if available | Generic adapter |
| Grok Bot | Import or paste Skill instructions | Configure Grok workflow if available | Configure Grok workflow if available | Generic adapter |

No adapter claims private API support. If a platform cannot create a new conversation or send to an existing one, use the generated message manually or connect it to that platform's own workflow system.

Every adapter should preserve these rules:

1. Reminders are enabled by default.
2. The user can say “关闭人生重启提醒” or “开启人生重启提醒”.
3. The operation uses the user's existing platform identity and token.
4. The first new conversation is titled exactly `Life-reset`.
5. Later reminders reuse the saved conversation when it remains accessible.
