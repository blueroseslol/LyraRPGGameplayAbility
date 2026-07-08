---
name: ue5-puerts-usage
description: Use when writing or reviewing Puerts TypeScript for Unreal Engine 5 gameplay code, especially when calling UFUNCTION/UPROPERTY APIs, UE structs, containers, Blueprint assets, delegates, UMG, React UMG, mixin, async loading, FFI, or C++ exposed UE types from TypeScript.
---

# UE5 Puerts Usage

Puerts 已集成后使用本 Skill。项目初始化、插件安装、GameInstance 启动流程查 `ue5-puerts-init-skill`。

## 使用流程

1. 先查实际工程生成声明：`Typing/ue/ue.d.ts`、`Typing/ue/ue_bp.d.ts`、`Typing/ue/puerts.d.ts`、`Typing/puerts/index.d.ts`。
2. 按 `.d.ts` 里的 TS 签名写调用；不要凭 C++ 原型猜 `ScriptName`、nullability、`$Ref<T>` 或 Blueprint 命名空间。
3. 只读取本次需求相关的 reference；基础语法先查 `references/QuickStart.md`。
4. 复杂调用写完后，对照 demo 的 TS、C++、typings 验证一次。

## 子文档路由

| 需求 | 读取 |
| --- | --- |
| 基础 UObject、UPROPERTY、UFUNCTION、struct、ref/out、Blueprint、delegate | `references/QuickStart.md` |
| UE latent action、异步加载封装 Promise | `references/AsyncTest.md`、`references/AsyncUtils.md` |
| 容器创建、容器边界、Mocha 用例 | `references/NewContainer.md`、`references/CaseTest.md`、`references/MyAssert.md` |
| 在 Puerts 中跑测试或把结果显示到 UMG | `references/RunCaseTest.md`、`references/RunCaseTestAndDisplay.md` |
| `cpp` 直绑 C++、`ffi` 函数指针、性能对比、JIT 导出 | `references/CDataTest.md`、`references/FFITest.md`、`references/PerfTest.md`、`references/JitTest.md` |
| 覆盖 Blueprint/native 方法、维护旧 `makeUClass` | `references/UsingMixin.md`、`references/UsingMakeUClass.md` |
| UMG Widget Blueprint | `references/UsingWidget.md` |
| React UMG 业务 UI | `references/UsingReactUMG.md`、`references/main-ui-index.md`、`references/main-ui-ui-components.md` |
| React UMG renderer 内部实现 | `references/react-umg.md` |

## 最小规则

- Puerts 能调的 C++ `UFUNCTION`/`UPROPERTY` 必须出现在生成 typings 中。
- UE API 用 `import * as UE from 'ue'`；Puerts helper 按需从 `puerts` 导入。
- 容器、`$ref`、delegate 的基础写法不要重复猜，查 `QuickStart.md`。
- Blueprint/UMG/React UMG 以生成的 `ue_bp.d.ts` 和对应 reference 为准。
