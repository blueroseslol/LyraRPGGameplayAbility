# PerfTest.ts 写法

源示例：`puerts_unreal_demo/TypeScript/PerfTest.ts`

对应源码：`TGUnitTestCallee.h/.cpp`、`UTGUnitTestCalleeWrap.cpp`

## 对比对象

`UE.TGUnitTestCallee` 同时暴露两类调用：

- 普通 UE 反射生成方法：`NoArgNoRet`、`RetInt`、`TArrayRefIntRet`、`VP`。
- 手动 `DefineClass` 注册方法：`sNoArgNoRet`、`sRetInt`、`sTArrayRefIntRet`、`sVP`。

## 性能循环

```ts
const obj: any = new UE.TGUnitTestCallee();
const LOOP_COUNT = 1000000;

for (let i = 0; i < LOOP_COUNT; i++) {
  obj.IntArgIntRet(i);
}
```

规则：
- `PerfTest.ts` 是基准脚本，不是业务写法模板。
- 大循环里避免创建对象，先准备 `UE.NewArray(UE.Vector)`、`$ref` 等测试数据。
- 比较 native 绑定时保持参数类型和循环次数一致。

## ref 和容器参数

```ts
const positions = UE.NewArray(UE.Vector);
const positionsRef = $ref(positions);
obj.TArrayRefIntRet(positionsRef);
obj.ConstTArrayRefIntRet(positions);
```

规则：
- 基础 `$ref` 写法查 `QuickStart.md`；本示例重点是性能对比时区分 `TArray&` 和 `const TArray&`。
- `TArray&` 对应 `$Ref<UE.TArray<T>>`，`const TArray&` 对应普通 `UE.TArray<T>`。
- `int&`、`int*`、`std::string&`、`std::string*` 都用 `$ref`。
