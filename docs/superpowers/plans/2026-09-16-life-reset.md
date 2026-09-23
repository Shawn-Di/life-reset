# Life-reset Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建一个无外部依赖的开源 Skill，围绕 Dan Koe 的《How to fix your entire life in 1 day》生成提醒消息，并为新对话注入持续的人生导师模式。

**Architecture:** 使用 JSON 内容包作为唯一内容来源，使用 Node.js 标准库完成加载、校验和提醒文案生成；平台适配器只提供安装说明、会话指令和自动化接入模板。核心生成逻辑不调用远程 API，不复制文章全文。

**Tech Stack:** Node.js 20+、CommonJS、Node 内置 `node:test`、JSON Schema 2020-12（契约文件，不引入运行时校验依赖）。

**Spec:** `docs/superpowers/specs/2026-09-16-life-reset-design.md`

## Global Constraints

- 产品显示名为 `Life-reset`，包名为 `life-reset`。
- 第一版只围绕 Dan Koe 的文章《How to fix your entire life in 1 day》。
- 新对话默认永久启用 Skill：在该对话生命周期内持续使用人生导师模式。
- 默认主题路由：优先回答个人成长、目标、习惯、行动、复盘和人生方向相关问题。
- 主动提醒默认开启，并支持在对话中通过提示词关闭或重新开启。
- Skill 不拥有独立 Token；调度和对话操作始终使用用户在对应 AI 工具中的账号、权限和 Token。
- 首次提醒创建 `Life-reset` 新对话；后续提醒优先继续同一对话，原对话不存在或不可访问时才创建新的 `Life-reset` 对话。
- 每次新建的对话标题固定为 `Life-reset`。
- 项目不抓取远程内容，不收录或重新发布文章全文。
- 核心层不依赖任何具体平台。
- 平台不支持会话级持久指令时，退化为首条消息中的明确模式声明。
- 不修改现有 `index.html` 和 `activetheory.html`。

---

### Task 1: 建立 Node 项目和 Skill 元数据

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `SKILL.md`
- Create: `agents/openai.yaml`

**Interfaces:**
- Produces the package name `life-reset`, npm scripts `test`, `validate`, and `generate`.
- Produces the Skill entrypoint that instructs an AI tool to keep life-reset mentor mode active for the conversation lifetime.

- [ ] **Step 1: Write package metadata**

Create `package.json` with:

```json
{
  "name": "life-reset",
  "version": "0.1.0",
  "private": true,
  "description": "A cross-platform AI skill for life reset reminders and mentor conversations.",
  "engines": { "node": ">=20" },
  "scripts": {
    "test": "node --test",
    "validate": "node scripts/validate-content.js",
    "generate": "node scripts/generate-reminder.js"
  }
}
```

- [ ] **Step 2: Add ignore rules**

Create `.gitignore` containing:

```gitignore
node_modules/
coverage/
.DS_Store
```

- [ ] **Step 3: Write the Skill entrypoint**

Create `SKILL.md` with YAML frontmatter `name: life-reset` and a discriminating description. Its instructions must state that the Skill is initialized by a newly created conversation, remains active for that conversation lifetime, prioritizes personal growth and mentoring, gives concrete actions, and answers unrelated user requests directly without forcing a growth interpretation.

The entrypoint must also state that proactive reminders are enabled by default, that the user can say “关闭 Life-reset 提醒” or “开启 Life-reset 提醒”, and that the Skill uses the user’s existing platform identity rather than owning a separate token.

- [ ] **Step 4: Add Codex UI metadata**

Create `agents/openai.yaml` with display name `Life-reset`, a short description, and a default prompt that starts the mentor conversation from the included reminder content.

- [ ] **Step 5: Verify metadata**

Run: `node -e "const p=require('./package.json'); if(p.name!=='life-reset'||p.engines.node!=='\\u003e=20') process.exit(1)"`

Expected: exit code 0.

- [ ] **Step 6: Commit**

```bash
git add package.json .gitignore SKILL.md agents/openai.yaml
git commit -m "feat: scaffold life-reset skill"
```

### Task 2: 定义内容包和提醒契约

**Files:**
- Create: `schema/reminder.schema.json`
- Create: `skills/life-reset/references/content-pack.json`

**Interfaces:**
- `skills/life-reset/references/content-pack.json` is the only bundled question bank.
- `src/reminder.js` owns the persistent session instruction separately from the one-time reminder copy.

- [ ] **Step 1: Define the JSON Schema**

Create a draft 2020-12 schema requiring an object with `version` and `items`; require every item to contain the fields listed above, with non-empty strings; require `sourceUrl` to use `https`; and restrict `id` to lowercase letters, digits, and hyphens.

- [ ] **Step 2: Add the approved content module**

Store the current approved prompts and actions only in `skills/life-reset/references/content-pack.json`. Do not duplicate reminder copy in plans, adapters, or another JSON file.

- [ ] **Step 3: Validate JSON syntax and source fields**

Run: `npm run validate`

Expected: exit code 0.

- [ ] **Step 4: Commit**

```bash
git add schema/reminder.schema.json skills/life-reset/references/content-pack.json
git commit -m "feat: add life reset content contract"
```

### Task 3: 实现内容加载、校验和提醒生成

**Files:**
- Create: `src/content.js`
- Create: `src/reminder.js`
- Create: `src/reminder-state.js`
- Create: `scripts/validate-content.js`
- Create: `scripts/generate-reminder.js`
- Test: `test/content.test.js`
- Test: `test/reminder.test.js`
- Test: `test/reminder-state.test.js`

**Interfaces:**
- `loadContent(filePath) -> { version: number, items: ContentItem[] }` throws an `Error` naming the invalid field when the content is malformed.
- `findContent(pack, id) -> ContentItem` throws when the ID is missing.
- `buildSessionInstruction() -> string` returns the persistent mentor-mode instruction.
- `buildReminder(item) -> string` returns the user-visible Chinese reminder with title, prompt, action, and source URL.
- `parseReminderCommand(text) -> 'enable' | 'disable' | null` parses Chinese and English enable/disable commands.
- `decideDelivery(state, conversationExists) -> { type: 'skip' | 'send' | 'create', title: 'Life-reset' }` decides whether to skip, continue an existing conversation, or create a new conversation.

- [ ] **Step 1: Write failing content tests**

Add tests covering the bundled content, missing required fields, duplicate IDs, and unknown item IDs:

```js
const { loadContent, findContent } = require('../src/content');

test('loads the bundled life reset item', () => {
  const pack = loadContent();
  assert.equal(pack.items[0].id, 'life-reset-day-one');
});

test('rejects an unknown content id', () => {
  const pack = loadContent();
  assert.throws(() => findContent(pack, 'missing'), /Unknown content id/);
});
```

- [ ] **Step 2: Run the tests and verify failure**

Run: `npm test`

Expected: FAIL because `src/content.js` and `src/reminder.js` do not exist.

- [ ] **Step 3: Implement minimal content validation**

Implement `loadContent` using `fs.readFileSync` and `JSON.parse`. Validate `version`, non-empty `items`, the exact required string fields, HTTPS source URL, lowercase ID format, and duplicate IDs. Keep validation local and dependency-free.

- [ ] **Step 4: Write failing reminder tests**

Add tests asserting that `buildSessionInstruction()` contains `Life-reset` and `人生导师模式`, and that `buildReminder()` contains the selected title, prompt, action, and source URL.

- [ ] **Step 5: Implement the reminder functions**

Use this output shape:

```text
Life-reset 提醒

主题：<title>

今天想一想：
<prompt>

今天行动：
<action>

简要背景：
<summary>

来源：<sourceUrl>
```

`buildSessionInstruction()` must state that the Skill remains active for the conversation lifetime, prioritizes mentor topics, stays concrete and actionable, and answers unrelated topics directly.

- [ ] **Step 6: Implement the CLI scripts**

`scripts/validate-content.js` loads the default content file and exits 0 with `content valid` on success; it exits 1 and prints the validation error on failure.

`scripts/generate-reminder.js` accepts `--id <id>` and optional `--include-session-instruction`; it loads the default content item, prints the session instruction first when requested, then prints the reminder. With no arguments it uses `life-reset-day-one`.

- [ ] **Step 7: Write failing reminder-state tests**

Add tests for default-enabled state, natural-language toggles, existing-conversation reuse, missing-conversation fallback, and the fixed title:

```js
assert.equal(parseReminderCommand('关闭 Life-reset 提醒'), 'disable');
assert.equal(parseReminderCommand('开启 Life-reset 提醒'), 'enable');
assert.deepEqual(decideDelivery({ enabled: true, conversationId: 'c1' }, true), {
  type: 'send',
  title: 'Life-reset'
});
assert.deepEqual(decideDelivery({ enabled: true, conversationId: 'c1' }, false), {
  type: 'create',
  title: 'Life-reset'
});
```

- [ ] **Step 8: Implement reminder state decisions**

Implement `parseReminderCommand` with explicit enable and disable phrases in Chinese and English. Treat missing `enabled` as `true`. Implement `decideDelivery` so disabled state returns `skip`, enabled state with an accessible prior conversation returns `send`, and enabled state without one returns `create`; every result includes the exact title `Life-reset`.

- [ ] **Step 9: Run focused tests**

Run: `npm test`

Expected: all content and reminder tests PASS.

- [ ] **Step 10: Run the CLI checks**

Run: `npm run validate; npm run generate -- --include-session-instruction`

Expected: validation succeeds and output includes the persistent session instruction, `Life-reset 提醒`, a question, an action, and the Dan Koe source URL.

- [ ] **Step 11: Commit**

```bash
git add src scripts test
git commit -m "feat: generate life reset reminders"
```

### Task 4: 添加平台无关会话契约和 Codex 适配

**Files:**
- Create: `docs/architecture.md`
- Create: `docs/platform-support.md`
- Create: `adapters/codex/README.md`
- Create: `adapters/codex/automation-prompt.md`
- Create: `adapters/claude-code/README.md`
- Create: `adapters/kimi/README.md`
- Create: `adapters/workbuddy/README.md`
- Create: `adapters/doubao/README.md`
- Create: `adapters/autogravity/README.md`
- Create: `adapters/grok-bot/README.md`
- Modify: `README.md`

**Interfaces:**
- `docs/architecture.md` documents `scheduled -> skipped|sent|created|failed` and the fields `enabled`, `timezone`, `frequency`, `timeWindow`, `randomize`.
- `adapters/codex/automation-prompt.md` is a copyable prompt that creates a new conversation and injects `buildSessionInstruction()` semantics plus the generated reminder.
- Every adapter README clearly states whether the platform can persist the instruction or only place it in the first message.
- Every adapter documents that it uses the user’s existing platform token and stores the reminder toggle plus last conversation reference in user-owned platform state.

- [ ] **Step 1: Write the architecture document**

Document Content Pack, Reminder Contract, Platform Adapter, the new-conversation data flow, state values `scheduled`, `skipped`, `sent`, `created`, `failed`, the default-enabled toggle, conversation reuse, fixed title `Life-reset`, user-token boundary, and no-remote-fetch boundary.

- [ ] **Step 2: Write the Codex adapter**

Document installation of `SKILL.md` into the user Skill directory and provide an automation prompt that uses the user’s existing Codex identity. The first reminder creates a fresh conversation titled `Life-reset`; later reminders send into the saved conversation when it still exists, otherwise create a replacement with the same title. Include the enable/disable prompts, default-enabled behavior, session instruction, reminder, and no-read-receipt rule.

- [ ] **Step 3: Write the generic adapter templates**

Use the same short template for Claude Code, Kimi, WorkBuddy, 豆包, AutoGravity, and Grok Bot: platform-specific installation steps, first-message session instruction, reminder text, and explicit limitation when no public new-conversation automation contract is known. Do not claim private API support.

- [ ] **Step 4: Write the README**

Include the project purpose, quick start, CLI examples, content policy, current Codex support, generic adapter status, and contribution path for adding a platform adapter or approved content item.

- [ ] **Step 5: Verify docs and examples**

Run: `rg -n "TODO|TBD|未完成|强制弹窗" README.md docs adapters`

Expected: no unfinished item and no promise of forced popups. Check manually that the docs state the article is not copied in full.

- [ ] **Step 6: Commit**

```bash
git add README.md docs adapters
git commit -m "docs: add platform adapter contract"
```

### Task 5: 全量验证并整理交付

**Files:**
- Modify: `README.md` only if verification reveals a stale command or path.

**Interfaces:**
- `npm test` exits 0.
- `npm run validate` exits 0.
- `npm run generate -- --include-session-instruction` emits both persistent session instruction and reminder content.

- [ ] **Step 1: Run the complete local verification**

Run:

```bash
npm test
npm run validate
npm run generate -- --include-session-instruction
git status --short
```

Expected: tests and validation pass; generated output has the expected sections; only the intended life-reset files and the pre-existing untracked HTML files appear in status.

- [ ] **Step 2: Check the final diff**

Run: `git diff --stat HEAD~4..HEAD; git diff --check HEAD~4..HEAD`

Expected: no whitespace errors and no changes to `index.html` or `activetheory.html`.

- [ ] **Step 3: Commit any documentation-only correction**

Only if Step 2 finds a stale path or command:

```bash
git add README.md
git commit -m "docs: correct life reset usage"
```
