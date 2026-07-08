# AsyncTest.ts 写法

源示例：`puerts_unreal_demo/TypeScript/AsyncTest.ts`

对应源码：`Source/puerts_unreal_demo/LatentActionState.h`、`AsyncLoadState.h`

## 入口

```ts
import * as UE from 'ue';
import * as AsyncUtils from './AsyncUtils';
import { argv } from 'puerts';

const world = (argv.getByName('GameInstance') as UE.GameInstance).GetWorld();
```

`argv.getByName('GameInstance')` 来自 C++ 启动 JsEnv 时传入的参数。需要调用 `Delay`、创建 Widget、Spawn Actor 时先拿 `World`。

## Latent Action 转 Promise

```ts
const state = new UE.LatentActionState();
UE.KismetSystemLibrary.Delay(world, 3, state.GetLatentActionInfo());
await AsyncUtils.WaitLatentActionState(state);
```

规则：
- C++ `ULatentActionState.GetLatentActionInfo()` 返回 `FLatentActionInfo`，完成时调用 `LatentActionCallback`。
- TS 侧不要轮询；调用 `AsyncUtils.WaitLatentActionState(state)`。
- helper 内部的 `Bind`/`Unbind` 细节查 `AsyncUtils.md`。

## 异步加载 Class

```ts
const cls = await AsyncUtils.AsyncLoad('/Game/StarterContent/TestBlueprint.TestBlueprint_C');
console.log(cls.GetName());
```

规则：
- `AsyncLoadState.StartLoad(path)` 走 C++ `FStreamableManager.RequestAsyncLoad`。
- 加载成功 resolve `UE.Class`，失败 reject；封装细节查 `AsyncUtils.md`。
- 调用处用 `asyncTest().catch(...)`，不要让 Promise rejection 静默。
