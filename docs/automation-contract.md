# Cross-platform automation contract

Every platform adapter uses the same automation identity:

```text
name: Life-reset
key: life-reset-v1
```

There must be one active automation per user and platform. The Skill itself is reusable across conversations; the scheduler is not. An interval, a time slot, or a conversation must never create another automation.

## Setup and repair

When the platform supports listing automations, every adapter follows this order:

1. Find active automations with the exact name `Life-reset`, the key `life-reset-v1`, or the marker in the prompt.
2. If none exists, show one reviewable proposal and create one only after approval.
3. If one exists, update and reuse it.
4. If several exist, keep the oldest active one as canonical, pause the others, and update only the canonical automation. Do not create another one.

If a platform cannot list automation IDs, use the exact name and key in the platform's automation prompt. If that name already exists, update it instead of creating another entry.

The one automation stores one saved `Life-reset` conversation ID. It continues that conversation when accessible and creates one replacement only when the saved conversation was deleted or cannot be accessed. Creating a replacement conversation is not permission to create a replacement automation.

The default schedule is every two hours at minute `00` in the user's local timezone, only during the daytime window 08:00–22:00 (08:00 through 20:00 triggers). A custom window changes the same automation. It never uses per-run heartbeat scheduling or minute jitter.

The user-visible reminder is exactly two lines. Platform setup questions, status, source metadata, and Skill initialization instructions must not be sent as reminder content.
