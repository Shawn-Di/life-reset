# Custom module format

Add a module to a user-owned content pack. Do not edit the installed Skill's `SKILL.md` and do not create another automation.

```json
{
  "id": "my-module",
  "title": "我的题库",
  "summary": "围绕我当前目标的提醒。",
  "slots": [
    {
      "time": "08:00",
      "prompt": "今天最重要的结果是什么？",
      "action": "写下唯一任务，并立刻开始第一步。"
    }
  ]
}
```

`id` uses lowercase letters, numbers, and hyphens. `time` uses `HH:MM`. Each time appears at most once in a module. `author`, `sourceUrl`, `sourcePublishedAt`, and `copyrightNote` are optional metadata fields. The reminder only sends the selected module's `prompt` and `action`.
