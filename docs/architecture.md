# Architecture

## Components

### Content Pack

`skills/life-reset/references/content-pack.json` is the single bundled content registry used by both the installed Skill and local tooling. It contains a `defaultModuleId` and independent reminder modules. Each module owns its metadata and local-time question/action slots. The project does not fetch or republish the source article.

### Reminder Contract

The platform-neutral state is:

```json
{
  "enabled": true,
  "displayName": null,
  "moduleId": "life-reset-day-one",
  "schedule": {
    "intervalMinutes": 120,
    "timezone": "user-local",
    "start": "08:00",
    "end": "22:00",
    "userConfirmed": false
  },
  "pendingSlotTime": null,
  "lastReminderAt": null,
  "conversationId": null,
  "conversationTitle": "Life-reset",
  "conversationPhase": "silent"
}
```

`enabled` defaults to `true`. The scheduler runs every two hours, but an adapter sends only when the current time falls inside the user's local window; the default is 08:00–22:00. `userConfirmed` records whether the user has answered the preferred-window question. `lastReminderAt` prevents reminders from being sent more frequently than the configured interval. `pendingSlotTime` identifies the action paired with the latest question. `conversationId` is the last conversation that received a reminder. `conversationTitle` is always `Life-reset` for newly created conversations. `conversationPhase` tracks the short feedback loop after a reminder.

### Platform Adapter

An adapter maps the contract to a host AI tool. It is responsible for scheduling, reading and writing user-owned state, checking whether the saved conversation is still accessible, and creating or attaching to a conversation. Codex uses one heartbeat attached to the canonical `Life-reset` task; it does not send cross-task messages because those are rendered as user-side input.

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

Every reminder first searches accessible conversations for the exact title `Life-reset`. If one exists, the adapter reuses the saved ID when possible; otherwise it chooses the most recently active matching conversation and refreshes the saved ID. Only zero accessible exact-title matches permit creating a replacement titled `Life-reset`.

The installed Skill instructions provide the persistent life-reset mentor behavior. A newly created conversation must receive only the single-line reminder after the display name is known; it must not receive a separate mode-initialization message. There is exactly one active Life-reset automation per host, even when the saved conversation is replaced.

### Reminder interaction loop

```text
question delivered
        │
        ▼
awaiting-feedback ── first user reply ──→ matching action ──→ awaiting-action
        │                                                    │
        └── no reply ──→ silent until next reminder          └── next reply ──→ “现在就开始行动好了” ──→ silent
```

On first activation without `displayName`, the assistant outputs only the name question, enters `awaiting-name`, pauses the heartbeat, and stops. Only a user-authored message can leave this state; automation, assistant, system, tool, and cross-task messages cannot provide the name or advance the flow. After that reply, the same heartbeat resumes. Later reminders contain only the name and selected question. The user's first reply receives the matching action; one more reply receives “现在就开始行动好了”, then the cycle becomes silent. Without user feedback, the state stays pending until the next scheduled reminder replaces it. The loop never claims that the user read the reminder or invents a user response. Successful automation housekeeping produces no visible status or records.

The active question bank is the module named by `moduleId`. “查看提醒题库” lists available modules; “切换到 <模块> 题库” changes only `moduleId`; “自定义提醒题库” adds a user-owned module with its own slots. Module changes never create another automation or conversation.

## User controls

The default is enabled. The following natural-language commands update the user-level reminder setting:

- `关闭 Life-reset 提醒` / `disable life-reset reminders` → `enabled: false`
- `开启 Life-reset 提醒` / `enable life-reset reminders` → `enabled: true`

When no preferred time window has been confirmed, ask the user for a local-time range first. Until the user answers, use the default 08:00–22:00 window and a two-hour interval. The adapter owns the actual persistence mechanism because each host provides different workflow and storage capabilities.
