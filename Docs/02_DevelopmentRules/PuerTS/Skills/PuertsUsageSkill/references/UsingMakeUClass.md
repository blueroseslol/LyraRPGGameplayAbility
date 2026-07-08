# UsingMakeUClass.ts 写法

源示例：`puerts_unreal_demo/TypeScript/UsingMakeUClass.ts`

## 结论

`makeUClass` 已废弃。本文件只用于读旧代码和理解旧机制；新代码优先查 `UsingMixin.md`。

## JS 继承 UE 类

```ts
class MyActor extends UE.Actor {
  tickCount: number;

  Constructor() {
    this.PrimaryActorTick.bCanEverTick = true;
    this.tickCount = 0;
  }

  ReceiveBeginPlay(): void {}
  ReceiveTick(deltaSeconds: number): void {}
}

const cls = makeUClass(MyActor);
```

规则：
- 继承 UE 类时构造函数名是大写 `Constructor()`，不是 TS `constructor()`。
- 覆盖 UE 事件函数时签名按 `.d.ts`。
- `makeUClass` 功能有限，例如示例注释说明不支持 RPC。

## 生成 Actor

```ts
const gameInstance = argv.getByName('GameInstance') as UE.GameInstance;
const actor = UE.GameplayStatics.BeginDeferredActorSpawnFromClass(gameInstance, cls, undefined) as UE.Actor;
UE.GameplayStatics.FinishSpawningActor(actor, undefined);
```

规则：
- `BeginDeferredActorSpawnFromClass` 的 class 参数传 `makeUClass` 返回的 `UE.Class`。
- Spawn 返回基类时，根据传入 class 再 cast。

## 继承 Blueprint 类

```ts
const ucls = UE.Class.Load('/Game/StarterContent/TestBlueprint.TestBlueprint_C');
const TestBlueprint = blueprint.tojs<typeof UE.Game.StarterContent.TestBlueprint.TestBlueprint_C>(ucls);

class MyBPActor extends TestBlueprint {
  Foo(p1: boolean, p2: number, p3: number): void {}
}
```

规则：
- `blueprint.tojs<T>(ucls)` 把动态加载的 `UE.Class` 转成可继承的 TS class。
- `ucls` 和 `tojs` 得到的类生命周期要保持一致；不要只保存 TS class 丢掉 native class 引用。
- 旧代码可维护，新代码优先看 `UsingMixin.md`。
