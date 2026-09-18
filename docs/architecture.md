# Architecture

## Components

### Content Pack

`content/life-reset.json` is the bundled content registry. It contains a `defaultModuleId` and independent reminder modules. Each module owns its metadata and local-time question/action slots. The project does not fetch or republish the source article. The installed Skill includes the default registry at `skills/life-reset/references/content-pack.json`.

### Reminder Contract

The platform-neutral state is:

```json
{
  "enabled": true,
  "moduleId": "life-reset-day-one",
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

The standard Skill installer only copies files and must not execute installation-time scripts. On first Skill activation, a host that exposes automation listing and creation may present one reviewable proposal for the user-owned `Life-reset` automation. The user must approve the proposal before it becomes active. The bootstrap is idempotent: use the exact name `Life-reset` and key `life-reset-v1`, reuse one existing automation, and pause duplicates rather than creating another. See [`automation-contract.md`](./automation-contract.md).

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

The installed Skill instructions provide the persistent life-reset mentor behavior. A newly created conversation must receive only the two-line reminder; it must not receive a separate mode-initialization message. There is exactly one active Life-reset automation per host, even when the saved conversation is replaced.

### Reminder interaction loop

```text
reminder delivered
        │
        ▼
awaiting-feedback ── user gives a short report ──→ one-sentence tactical correction
        │                                             │
        └──────── no report / unrelated question ─────┴──→ silent until next reminder
```

The reminder itself starts with `Hi {name}，` and contains the selected question and action on two lines without module labels. The tactical correction is one sentence. The loop never claims that the user read the reminder, and it does not pressure the user to respond.

The active question bank is the module named by `moduleId`. “查看提醒题库” lists available modules; “切换到 <模块> 题库” changes only `moduleId`; “自定义提醒题库” adds a user-owned module with its own slots. Module changes never create another automation or conversation.

## User controls

The default is enabled. The following natural-language commands update the user-level reminder setting:

- `关闭人生重启提醒` / `disable life-reset reminders` → `enabled: false`
- `开启人生重启提醒` / `enable life-reset reminders` → `enabled: true`

When no preferred time window has been confirmed, ask the user for a local-time range first. Until the user answers, use the default 08:00–22:00 window and a two-hour interval. The adapter owns the actual persistence mechanism because each host provides different workflow and storage capabilities.
