# Architecture

## Components

### Content Pack

`content/life-reset.json` is the single source of reminder copy. It contains the title, short original summary, reflection prompt, smallest action, and the source URL. The project does not fetch or republish the source article.

### Reminder Contract

The platform-neutral state is:

```json
{
  "enabled": true,
  "timezone": "Asia/Shanghai",
  "frequency": "2/week",
  "timeWindow": { "start": "09:00", "end": "21:00" },
  "randomize": true,
  "conversationId": null,
  "conversationTitle": "Life-reset"
}
```

`enabled` defaults to `true`. `conversationId` is the last conversation that received a reminder. `conversationTitle` is always `Life-reset` for newly created conversations.

### Platform Adapter

An adapter maps the contract to a host AI tool. It is responsible for scheduling, reading and writing user-owned state, checking whether the saved conversation is still accessible, and sending or creating a conversation.

The adapter uses the user's existing account, permissions, and token. The Skill does not issue credentials, log in, or store a separate token.

## Delivery state machine

```text
scheduled
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

## User controls

The default is enabled. The following natural-language commands update the user-level reminder setting:

- `关闭人生重启提醒` / `disable life-reset reminders` → `enabled: false`
- `开启人生重启提醒` / `enable life-reset reminders` → `enabled: true`

The adapter owns the actual persistence mechanism because each host provides different workflow and storage capabilities.
