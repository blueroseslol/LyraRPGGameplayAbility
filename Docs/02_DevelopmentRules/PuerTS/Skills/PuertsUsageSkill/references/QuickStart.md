# QuickStart.ts 写法

来源示例：`puerts_unreal_demo/TypeScript/QuickStart.ts`。

对应源码：
- C++ 暴露类：`Source/puerts_unreal_demo/MainObject.h`、`MainActor.h`、`JSBlueprintFunctionLibrary.h`。
- 生成声明：`Typing/ue/ue.d.ts`、`Typing/ue/ue_bp.d.ts`、`Typing/ue/puerts.d.ts`、`Typing/puerts/index.d.ts`。

## 内容索引

导入；UObject/UPROPERTY/UFUNCTION；结构体和扩展方法；引用和输出参数；静态 Blueprint Function Library；枚举和默认参数；UE Containers；ArrayBuffer；启动参数和生成 Actor；Blueprint 类/结构体/枚举；Delegates；JS 函数作为 Native Delegate；运行时事件；常见错误。

## 导入

```ts
import * as UE from 'ue';
import {
  $ref, $unref, $set,
  argv, on,
  toManualReleaseDelegate, releaseManualReleaseDelegate,
  blueprint,
} from 'puerts';
```

`UE.*` 对应生成的 Unreal 类型。`puerts` helper 用于引用参数、启动参数、Blueprint 资产加载、Delegate 转换和运行时事件。

## UObject, UPROPERTY, UFUNCTION

```ts
const obj = new UE.MainObject();

obj.MyString = 'PPPPP';
console.log(obj.MyString);

const sum = obj.Add(100, 300);
obj.Bar(new UE.Vector(1, 2, 3));
```

规则：
- typings 暴露构造函数时，用 `new UE.ClassName(...)` 创建反射 UObject。
- UPROPERTY 像 TS 属性一样读写。
- UFUNCTION 像 TS 方法一样直接调用。
- 方法名以 `Typing/ue/ue.d.ts` 为准；C++ `ScriptName` metadata 可能改变 TS 方法名。

## 结构体和扩展方法

```ts
const v = new UE.Vector(3, 2, 1);
console.log(v.ToString());
v.Set(8, 88, 888);

v.X = 3;
v.Y = 2;
v.Z = 1;
v.Normalize(1);
console.log(v.Projection().ToString());
```

规则：
- `FVector` 这类 UE struct 在 TS 中通常是 `UE.Vector` 这样的 class。
- struct 字段可作为属性修改。
- 生成的扩展方法/static wrap 可能表现为实例方法，例如 `Vector.Set()`、`Vector.ToString()`。

## 引用和输出参数

```ts
const vectorRef = $ref(new UE.Vector(1, 2, 3));
obj.Bar2(vectorRef);
obj.Bar($unref(vectorRef));

actor.NotifyWithRefString.Bind((strRef) => {
  console.log($unref(strRef));
  $set(strRef, 'out to NotifyWithRefString');
});
```

规则：
- typings 显示 `$Ref<T>` 时，传 `$ref(initialValue)`。
- 用 `$unref(ref)` 读取引用值。
- 用 `$set(ref, value)` 写回 out/ref 结果。
- 不要把普通值直接传给 `$Ref<T>` 参数。

## 静态 Blueprint Function Library

```ts
const name = UE.JSBlueprintFunctionLibrary.GetName();
const text = UE.JSBlueprintFunctionLibrary.Concat(', ', name);
UE.JSBlueprintFunctionLibrary.Hello(text);
```

规则：
- C++ `UBlueprintFunctionLibrary` 的静态 UFUNCTION 会出现在 `UE.ClassName` 静态方法上。
- `UE.Class | null` 这类参数要按 typings 的 nullability 写。

## 枚举和默认参数

```ts
obj.EnumTest(UE.EToTest.V1);
obj.EnumTest(UE.EToTest.V13);

obj.DefaultTest();
obj.DefaultTest('hello john');
obj.DefaultTest('hello john', 1024);
obj.DefaultTest('hello john', 1024, new UE.Vector(7, 8, 9));
```

规则：
- C++ `UENUM(BlueprintType)` 通常写成 `UE.EnumName.Member`。
- C++ 默认参数在生成后表现为 TS 可选参数。
- 保持参数顺序，只省略尾部默认参数。

## UE Containers

```ts
function printTArray<T>(arr: UE.TArray<T>) {
  for (let i = 0; i < arr.Num(); i++) {
    console.log(i, arr.Get(i));
  }
}

obj.MyArray.Add(888);
obj.MyArray.Set(0, 7);

console.log(obj.MySet.Contains('John'));

console.log(obj.MyMap.Get('John'));
obj.MyMap.Add('Che', 10);
```

规则：
- `TArray<T>`：`Num()`、`Get(i)`、`Set(i, value)`、`Add(value)`、`RemoveAt(i)`。
- `TSet<T>`：`Num()`、`Contains(value)`、`Add(value)`、`RemoveAt(index)`。
- `TMap<K,V>`：`Get(key)`、`Add(key, value)`、`Set(key, value)`、`Remove(key)`。
- C++ 定长数组也是 wrapper；用 `Num()`、`Get(i)`、`Set(i, value)`。
- 不要对 UE 容器使用 JS 数组下标，例如 `arr[i]`。

## ArrayBuffer

```ts
const ab = obj.ArrayBuffer;
const view = new Uint8Array(ab);

obj.ArrayBufferTest(ab);
obj.ArrayBufferTest(new Uint8Array(ab).buffer);

const next = obj.ArrayBufferTest(ab.slice(5));
console.log(new Uint8Array(next));
```

规则：
- Puerts 可将合适的 native byte buffer 映射成 JS `ArrayBuffer`。
- 读写字节时用 typed array。
- UFUNCTION 需要 `ArrayBuffer` 时，可以传 `Uint8Array(...).buffer`。

## 启动参数和生成 Actor

```ts
const gameInstance = argv.getByName('GameInstance') as UE.GameInstance;

const actor = UE.GameplayStatics.BeginDeferredActorSpawnFromClass(
  gameInstance,
  UE.MainActor.StaticClass(),
  undefined,
) as UE.MainActor;

UE.GameplayStatics.FinishSpawningActor(actor, undefined);
```

规则：
- `argv` 保存 C++ 启动 JsEnv 时传入的参数；继承 UE 类作为入口时可能为空。
- UE API 需要 `UE.Class` 时传 `StaticClass()`。
- 返回值是 `UE.Actor` 等基类时，只有 spawn class 能保证类型时才 cast 到目标子类。
- 示例用 `undefined` 走默认 `FTransform`；需要确定生成位置时传真实 `UE.Transform`。

## Blueprint 类、结构体、枚举

```ts
blueprint.load(UE.Game.StarterContent.TestBlueprint.TestBlueprint_C);
const TestBlueprint_C = UE.Game.StarterContent.TestBlueprint.TestBlueprint_C;

const bpActor = UE.GameplayStatics.BeginDeferredActorSpawnFromClass(
  gameInstance,
  TestBlueprint_C.StaticClass(),
  undefined,
) as UE.Game.StarterContent.TestBlueprint.TestBlueprint_C;

UE.GameplayStatics.FinishSpawningActor(bpActor, undefined);
bpActor.Foo(false, 8000, 9000);
blueprint.unload(TestBlueprint_C);

blueprint.load(UE.Game.StarterContent.TestStruct.TestStruct);
const TestStruct = UE.Game.StarterContent.TestStruct.TestStruct;
const data = new TestStruct();
data.age = 10;
data.speed = 5;
bpActor.Bar(data);
blueprint.unload(TestStruct);

console.log(UE.Game.StarterContent.TestEnum.TestEnum.Blue);
```

规则：
- Blueprint 生成声明在 `Typing/ue/ue_bp.d.ts`。
- Blueprint class 通常以 `_C` 结尾。
- 使用生成的 Blueprint 资产命名空间前，先 `blueprint.load(Type)`。
- 不再使用该类型后调用 `blueprint.unload(Type)`。
- Blueprint struct 可 `new StructType()`，字段像 TS 属性一样设置。

## Delegates

```ts
function onInt(i: number) {
  console.warn('NotifyWithInt', i);
}

function once(i: number) {
  console.warn('once', i);
  actor.NotifyWithInt.Remove(once);
}

actor.NotifyWithInt.Add(onInt);
actor.NotifyWithInt.Add(once);
actor.NotifyWithInt.Broadcast(888999);

actor.NotifyWithStringRet.Bind((s) => '////' + s);
const ret = actor.NotifyWithStringRet.Execute("console.log('hello world')");
```

规则：
- Multicast delegate：`Add(fn)`、`Remove(fn)`、`Broadcast(args...)`。
- Single-cast delegate：`Bind(fn)`、`IsBound()`、`Execute(args...)`。
- 一次性 multicast 回调可在 callback 内 `Remove(fn)`。
- Delegate 带 ref 参数时，callback 收到 `$Ref<T>`。

## JS 函数作为 Native Delegate

```ts
function isJohn(str: string): boolean {
  return str === 'John';
}

obj.PassJsFunctionAsDelegate(toManualReleaseDelegate(isJohn));
releaseManualReleaseDelegate(isJohn);
```

规则：
- 将 JS 函数传给 native `$Delegate` 参数时，用 `toManualReleaseDelegate(fn)`。
- native 不再需要后，调用 `releaseManualReleaseDelegate(fn)`。
- 函数签名必须匹配生成的 `$Delegate<...>` 类型。

## 运行时事件

```ts
on('unhandledRejection', (reason: unknown) => {
  console.log('unhandledRejection', reason);
});
```

Puerts 运行时事件用 `on(eventType, listener)`。长生命周期脚本建议注册 `unhandledRejection`，否则 Promise 失败可能不容易在 UE 日志里定位。

## 常见错误

- 不要把 UE 容器当普通 TS array/map。
- 不要给 `$Ref<T>` 参数直接传普通值。
- 有生成的 typed namespace 时，优先用 `UE.Game...` 类型加 `blueprint.load`，不要手写裸 Blueprint 路径。
- `toManualReleaseDelegate` 必须和 `releaseManualReleaseDelegate` 配对。
- 不要凭记忆写 C++ 名称、默认值或 nullability；先查生成的 `.d.ts`。
