# CaseTest.ts 写法

源示例：`puerts_unreal_demo/TypeScript/CaseTest.ts`

对应源码：`MainObject.h`、`MainActor.h`、`ContainersTest.h`

## 用途

这是 Puerts 行为单元测试集合。写业务代码时不需要照搬 Mocha 结构；遇到 API 写法不确定时查本文件对应场景。

## 覆盖点

- `UE.MainObject`：UPROPERTY 读写、POD/struct 参数、`$ref` 输出参数、枚举、默认参数。
- `UE.JSBlueprintFunctionLibrary`：静态 BlueprintCallable 函数。
- `UE.MainActor`：Spawn Actor、multicast delegate、single-cast delegate、ref delegate、return delegate。
- `UE.ContainersTest`：`TArray`、`TSet`、`TMap`、`FixSizeArray` 的完整 wrapper API 与边界值。

## 边界规则

基础容器、ref、delegate 写法查 `QuickStart.md`。`CaseTest.ts` 主要补充边界：

- `int64`/`uint64` 在 TS 里是 `bigint`。
- `FString`、`FName`、`FText` 在 TS 侧都是 `string`。
- `TSet` 支持按内部 index `Get(index)`、`RemoveAt(index)`；先用 `IsValidIndex(index)` 判断。
- `TMap` 的 key API 用于业务读写；index API 只用于遍历内部 pair。
- 定长数组同样是 wrapper，越界访问按 wrapper 行为处理，不当作 JS array。

## Delegate 覆盖点

- multicast 覆盖 `Add`、`Remove`、`Broadcast`。
- single-cast 覆盖 `Bind`、`Unbind`、`IsBound`、`Execute`。
- ref 参数 callback 覆盖 `$unref(ref)` 读和 `$set(ref, value)` 写。

## Mocha 环境

`CaseTest.ts` 依赖 `MyAssert.ts` 和 `mocha`。在 Puerts 中跑测试时参考 `RunCaseTest.md`，不要在游戏业务启动路径里直接运行大量测试。
