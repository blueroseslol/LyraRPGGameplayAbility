# AsyncUtils.ts 写法

源示例：`puerts_unreal_demo/TypeScript/AsyncUtils.ts`

## Latent Promise Helper

```ts
export function WaitLatentActionState(state: UE.LatentActionState): Promise<void> {
  return new Promise((resolve) => {
    state.LatentActionCallback.Bind(() => {
      state.LatentActionCallback.Unbind();
      resolve();
    });
  });
}
```

规则：
- single-cast dynamic delegate 用 `Bind(fn)` 和 `Unbind()`。
- `Unbind()` 放在 callback 内第一时间执行。
- Promise 只 resolve 一次；不要在同一个 state 上复用多个等待者。

## Async Load Helper

```ts
export function AsyncLoad(path: string): Promise<UE.Class> {
  return new Promise((resolve, reject) => {
    const state = new UE.AsyncLoadState();
    state.LoadedCallback.Bind((cls) => {
      state.LoadedCallback.Unbind();
      cls ? resolve(cls) : reject(`load ${path} fail`);
    });
    state.StartLoad(path);
  });
}
```

规则：
- `AsyncLoadState.LoadedCallback` 类型是 `$Delegate<(Obj: UE.Class | null) => void>`。
- `new UE.AsyncLoadState()` 必须被闭包持有到回调发生；不要让 state 只存在于临时表达式中。
- Blueprint class 路径通常以 `_C` 结尾，例如 `/Game/StarterContent/TestBlueprint.TestBlueprint_C`。
