# NewContainer.ts 写法

源示例：`puerts_unreal_demo/TypeScript/NewContainer.ts`

对应声明：`Typing/ue/puerts.d.ts`

## 创建容器

```ts
const ints = UE.NewArray(UE.BuiltinInt);
const strings = UE.NewArray(UE.BuiltinString);
const vectors = UE.NewArray(UE.Vector);
const set = UE.NewSet(UE.BuiltinString);
const map = UE.NewMap(UE.BuiltinString, UE.BuiltinInt);
```

规则：
- 基础类型用 `UE.BuiltinBool`、`UE.BuiltinInt`、`UE.BuiltinString`。
- UObject/UStruct 类型用类本身，例如 `UE.Actor`、`UE.Vector`。
- 返回值是 `UE.TArray<T>`、`UE.TSet<T>`、`UE.TMap<K,V>` wrapper。
- `NewMap` 需要分别传 key/value 的类型描述符。

## 使用边界

- 创建后的对象按 `UE.TArray<T>`、`UE.TSet<T>`、`UE.TMap<K,V>` 使用；基础读写查 [QuickStart.md](QuickStart.md) 的 UE Containers。
- 类型描述符来自 `Typing/ue/puerts.d.ts` 的 `SupportedContainerKVType`，不要随便传字符串类型名。
- 需要边界行为、越界和 64 位整型示例时查 `CaseTest.md`。

## TArray 读写

业务数据可用 JS 数组；UE 参数要求 `TArray<T>` 时，用 `UE.NewArray` 创建，不用类型断言代替转换。

```ts
const values = UE.NewArray(UE.BuiltinFloat);
values.Add(1, 2);
values.Get(0); // 1
```

- 读写用 `Get/Set`，长度用 `Num()`，不用下标或 `.length`。
- ReactUMG 的 `ColumnFill/RowFill` 同样适用；容器变化不代表 UI 自动刷新。
