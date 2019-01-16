# api-mocker-clent changelog

## 1.3.1

* 升级moment版本，规避moment已知的正则安全漏洞
* 修复接口对比时接口名与接口方法未正确展示

## 1.3.2

* feat: 接口列表跳转默认跳转到文档模式，小图标改为编辑模式
* fix: 接口列表名称太长显示不下
* fix: 文档模式，左侧菜单滚动到当前项
* fix: 接口添加返回状态时，添加复制操作
* fix: 编辑模式保存后 3s 内不能重复保存
* fix: 编辑模式下更便捷的切换到文档模式

## 1.3.3

* feat: 添加了 example 的验证，在创建/更新接口时，example 必须按照 schema 规则书写！！！
* fix: 修改 example 中输入小数问题。
* feat: 添加组管理移交到其他人下。
* fix: 修改 api 权限，选择为指定人员时包含组管理员。
* fix: schema 生成 example 时，切换数据格式生成数据格式不切换的问题。
* fix: get 请求 query 中参数为 number 类型，但非必填，发送空字符串错误问题。

## 1.3.4

* fix: [#24](https://gitlab.dxy.net/f2e/api-mocker/issues/24)
* fix: [#44](https://gitlab.dxy.net/f2e/api-mocker/issues/44)
* feat: 组管理员可以修改组下所有 api 的设置
* fix: example 的校验去掉了对空数组的校验
* feat: 添加超级管理员
