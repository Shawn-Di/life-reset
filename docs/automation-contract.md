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

The default schedule is every two hours at minute `00` in the user's local timezone, only during the daytime window 08:00–22:00 (08:00 through 20:00 triggers). A custom window changes the same automation. It never uses per-run heartbeat scheduling or minute jitter.

The user-visible reminder is exactly two lines: a `Hi {name}，` greeting plus the selected question, followed by the selected action. Platform setup questions, status, source metadata, and Skill initialization instructions must not be sent as reminder content.

The reminder selects content from the user's active question-bank module. The default module is `life-reset-day-one`. Module selection and custom module data belong to user-owned state/configuration; they do not create another automation. If a module has no slot for the current time, skip that reminder.
