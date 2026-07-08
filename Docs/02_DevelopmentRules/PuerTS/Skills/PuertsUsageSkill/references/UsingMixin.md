# UsingMixin.ts 写法

源示例：`puerts_unreal_demo/TypeScript/UsingMixin.ts`

## 推荐用途

用 `blueprint.mixin` 给 Blueprint class 或 native class 注入/覆盖 TS 方法。适合覆盖 BlueprintNativeEvent、BlueprintImplementableEvent 或扩展纯 TS 方法。

## Blueprint class mixin

```ts
const ucls = UE.Class.Load('/Game/StarterContent/MixinTest.MixinTest_C');
const MixinTest = blueprint.tojs<typeof UE.Game.StarterContent.MixinTest.MixinTest_C>(ucls);

interface Loggable extends UE.Game.StarterContent.MixinTest.MixinTest_C {}
class Loggable {
  Log(msg: string): void {
    console.log(this.GetName(), msg);
    console.log(this.TsAdd(1, 3));
  }

  TsAdd(x: number, y: number): number {
    return x + y;
  }
}

const Mixed = blueprint.mixin(MixinTest, Loggable);
```

规则：
- 用同名 `interface` 让 TS 知道 mixin 类拥有 Blueprint 原方法。
- 覆盖 Blueprint 方法时参数/返回值必须兼容 `.d.ts`；不要求完全同名类型文本，但要满足 TS 可赋值规则。
- mixin 建议只放函数。若放纯 TS 字段，要自己持有脚本对象引用，或用 `config.objectTakeByNative = true`。

## Spawn mixed class

```ts
const actor = UE.GameplayStatics.BeginDeferredActorSpawnFromClass(
  gameInstance,
  Mixed.StaticClass(),
  undefined,
  UE.ESpawnActorCollisionHandlingMethod.Undefined,
  undefined,
) as Loggable;
```

规则：
- `blueprint.mixin` 返回带 `StaticClass()` 的类型。
- 对象类型可 cast 成 mixin class，以访问 TS 注入方法。

## super 调用

```ts
class BasePlaceHold {}
Object.setPrototypeOf(BasePlaceHold.prototype, BaseBlueprint.prototype);

class DerivedMixin extends BasePlaceHold {
  Foo(): void {
    super.Foo();
  }
}
```

规则：
- 要在 mixin 方法中 `super.Foo()`，先建立一个 placeholder class 并把 prototype 指向基类 Blueprint class。
- 多级 Blueprint mixin 时，子类 placeholder 应继承基类已有 mixin class。

## native class mixin

```ts
class Calc {
  Mult(x: number, y: number): number { return x * y; }
  Div(x: number, y: number): number { return x / y; }
}
interface Calc extends UE.MainObject {}

blueprint.mixin(UE.MainObject, Calc);
```

规则：
- 可给 native `UE.MainObject` 覆盖 BlueprintNativeEvent/BlueprintImplementableEvent。
- 已存在对象在 mixin 后再调用可走 TS 实现；但项目中仍应明确生命周期和加载顺序。
