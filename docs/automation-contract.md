# Cross-platform automation contract

Every platform adapter uses the same automation identity:

```text
name: Life-reset
key: life-reset-v1
```

The repository exposes the same contract through `src/platform-adapters.js`. Run `npm run adapter-setup -- --platform <name>` to print a platform-specific setup prompt. This is an optional helper for manual configuration; installing the Skill does not require Node.js.

There must be one active automation per user and platform. The Skill itself is reusable across conversations; the scheduler is not. An interval, a time slot, or a conversation must never create another automation.

## Setup and repair

When the platform supports listing automations, every adapter follows this order:

1. Find active automations with the exact name `Life-reset`, the key `life-reset-v1`, or the marker in the prompt.
2. If none exists, show one reviewable proposal and create one only after approval.
3. If one exists, update and reuse it.
4. If several exist, keep the oldest active one as canonical, pause the others, and update only the canonical automation. Do not create another one.

If a platform cannot list automation IDs, use the exact name and key in the platform's automation prompt. If that name already exists, update it instead of creating another entry.

The one automation stores one saved `Life-reset` conversation ID. Before every reminder, it must list or search accessible conversations by the exact title `Life-reset`. It uses the saved ID when it is still accessible; otherwise it uses the most recently active accessible exact-title conversation and refreshes the saved ID. It creates a replacement only when no accessible exact-title conversation exists. Creating a replacement conversation is not permission to create a replacement automation.

The default schedule is exactly 08:00, 10:00, 12:00, 14:00, 16:00, 18:00, and 20:00 in the user's local timezone, inside the 08:00–22:00 daytime window. A custom window changes the same automation. It never uses per-run heartbeat scheduling or minute jitter. If execution starts a few minutes after an exact hour, select that hour's slot and do not create an extra reminder.

On first activation without `displayName`, the conversation asks “我该怎么称呼你？” and saves the answer. Later reminders are one line: `{displayName}，` followed by the selected question, a space, and the selected action. `Hi`, greeting-only lines, and line breaks are not used. Platform setup questions, status, source metadata, and Skill initialization instructions must not be sent as reminder content.

Automation lookup, deduplication, conversation-ID persistence, and delivery success are silent. A successful run emits only the reminder; it must not emit “已处理”, “已发送”, duplicate cleanup, or other execution status.

The reminder selects content from the user's active question-bank module. The default module is `life-reset-day-one`. Module selection and custom module data belong to user-owned state/configuration; they do not create another automation. If a module has no slot for the current time, skip that reminder.
