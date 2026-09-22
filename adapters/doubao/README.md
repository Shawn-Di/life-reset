# 豆包 adapter

目前没有公开、稳定且可验证的豆包 Skill 一键安装 CLI。请导入或粘贴 `skills/life-reset/SKILL.md` 到豆包的自定义指令或 Skill 入口。平台支持工作流或定时任务时，将生成的提醒接入其中。

提醒默认开启，可使用“关闭 Life-reset 提醒”或“开启 Life-reset 提醒”修改。使用用户自己的豆包账号、权限和 Token；如果平台支持新对话自动化，只配置一条名为 `Life-reset`、标识为 `life-reset-v1` 的自动化，后续更新和复用它，重复项暂停，不要按时间段新建多条。本项目不宣称拥有豆包私有自动化 API。
