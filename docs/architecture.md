# Architecture

## Components

### Content Pack

`content/life-reset.json` is the single source of reminder copy. It contains the title, short original summary, reflection prompt, smallest action, and the source URL. The project does not fetch or republish the source article.

### Reminder Contract

The platform-neutral state is:

```json
{
  "enabled": true,
  "schedule": {
    "intervalMinutes": 120,
    "timezone": "user-local",
    "start": "08:00",
    "end": "22:00",
    "userConfirmed": false
  },
  "lastReminderAt": null,
  "conversationId": null,
  "conversationTitle": "Life-reset",
  "conversationPhase": "silent"
}
```

`enabled` defaults to `true`. The scheduler runs every two hours, but an adapter sends only when the current time falls inside the user's local window; the default is 08:00–22:00. `userConfirmed` records whether the user has answered the preferred-window question. `lastReminderAt` prevents reminders from being sent more frequently than the configured interval. `conversationId` is the last conversation that received a reminder. `conversationTitle` is always `Life-reset` for newly created conversations. `conversationPhase` tracks the short feedback loop after a reminder.

### Platform Adapter

An adapter maps the contract to a host AI tool. It is responsible for scheduling, reading and writing user-owned state, checking whether the saved conversation is still accessible, and sending or creating a conversation.

The adapter uses the user's existing account, permissions, and token. The Skill does not issue credentials, log in, or store a separate token.

## Delivery state machine

```text
scheduled
   │
   ├─ outside local time window ────→ skipped
   │
   ├─ enabled = false ───────────────→ skipped
   │
   └─ enabled = true
          │
          ├─ saved conversation accessible → sent
          │
          └─ no accessible conversation  → created
```

When the result is `sent`, keep the existing `conversationId`. When the result is `created`, save the new conversation ID and use the fixed title `Life-reset`. A failed operation remains `failed` with the host error and must not update the saved conversation reference.

## Conversation behavior

The first reminder creates a new conversation titled `Life-reset`. Every later reminder checks the saved conversation reference first. If it still exists and is accessible, the reminder is sent into that conversation. If it was deleted or cannot be accessed, the adapter creates a replacement titled `Life-reset`.

The first message in every newly created conversation contains the persistent life-reset mentor instruction followed by the reminder. The instruction remains active for that conversation lifetime. A host that cannot persist conversation-level instructions must repeat the instruction when it creates a replacement conversation.

### Reminder interaction loop

```text
reminder delivered
        │
        ▼
awaiting-feedback ── user gives a short report ──→ one-sentence tactical correction
        │                                             │
        └──────── no report / unrelated question ─────┴──→ silent until next reminder
```

The reminder itself contains `【致命拷问】` and `【即刻行动】`. The tactical correction is one sentence. The loop never claims that the user read the reminder, and it does not pressure the user to respond.

## User controls

The default is enabled. The following natural-language commands update the user-level reminder setting:

- `关闭人生重启提醒` / `disable life-reset reminders` → `enabled: false`
- `开启人生重启提醒` / `enable life-reset reminders` → `enabled: true`

When no preferred time window has been confirmed, ask the user for a local-time range first. Until the user answers, use the default 08:00–22:00 window and a two-hour interval. The adapter owns the actual persistence mechanism because each host provides different workflow and storage capabilities.
