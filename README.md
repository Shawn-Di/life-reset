# Life-reset

一个会主动提醒你重新审视生活方向的 AI Skill。

### 📚 理论框架与数据源 (Theoretical Foundations)

本 Skill 的交互逻辑与打断机制并非经验主义拼凑，而是严格建立在五大领域的经典学术文献与思想体系之上：

1. **心流与心理控制论**：依据米哈里·契克森米哈赖（Mihaly Csikszentmihalyi）的《心流》与麦克斯韦尔·马尔茨（Maxwell Maltz）的《心理控制论》，将拖延界定为潜意识导航模糊引发的“精神熵增”，推行“清晰度压倒意志力”法则。
2. **超级个体与无需许可杠杆**：依托纳瓦尔·拉维肯特（Naval Ravikant）的无许可资产理论与戴维森等人的《主权个人》（The Sovereign Individual），重构以个人为最小单元的高杠杆生产力模型。
3. **反平庸哲学与反脆弱心智**：融合尼采（Nietzsche）对从众性“末人剧本”的存在主义批判，以及斯多葛主义（Stoicism）的“控制二分法”，打破被动执行社会程序的惯性。
4. **认知科学与深度工作范式**：遵循卡尔·纽波特（Cal Newport）关于“注意力残留”与 4 小时深度工作天花板的实证研究，阻断无效的多任务切换。
5. **多巴胺神经生物学机制**：基于斯坦福大学安娜·伦布克（Anna Lembke）博士的多巴胺神经天平理论，提供防成瘾与神经脱机的落地干预。

通过上述理论支撑，本 Skill 将象牙塔中的认知法则转译为直接面向实战的“致命拷问”与“即刻行动”双核闭环。

## 工作方式

Life-reset 分成三个部分：

1. `skills/life-reset/SKILL.md`：告诉 AI 如何保持人生导师模式。
2. `content/`：保存可切换的提醒题库模块、问题、行动和原文链接。
3. `adapters/`：说明如何接入不同 AI 工具的 Skill、任务和自动化。

Skill 不拥有独立 Token，也不代替用户登录。调度、新建对话和继续对话都使用用户在对应平台已有的账号、权限和 Token。

## 支持的平台

| 平台 | 安装命令 |
| --- | --- |
| Codex | `npx skills add Shawn-Di/life-reset -a codex` |
| Claude Code | `npx skills add Shawn-Di/life-reset -a claude-code` |
| Kimi | `/plugins install https://github.com/Shawn-Di/life-reset` |
| WorkBuddy | `gh skill install Shawn-Di/life-reset skills/life-reset --dir .workbuddy/skills` |
| 豆包 | 手动导入 [`skills/life-reset/SKILL.md`](./skills/life-reset/SKILL.md) |
| Antigravity | `agy plugin install https://github.com/Shawn-Di/life-reset` |
| Grok Bot | `npx skills add Shawn-Di/life-reset -a grok` |

## 参与贡献

欢迎提交：

- 新的平台适配说明。
- 更清晰的提醒内容和行动问题。
- 内容校验和状态决策测试。
- 平台实际能力变化后的文档更新。

新增适配器时，请明确写出真实支持的能力、需要的用户配置和降级方案，不要声明未经验证的私有 API。

## License

MIT License，详见 [`LICENSE`](./LICENSE)。
