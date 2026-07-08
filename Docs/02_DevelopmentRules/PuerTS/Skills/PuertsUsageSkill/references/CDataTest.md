# CDataTest.ts 写法

源示例：`puerts_unreal_demo/TypeScript/CDataTest.ts`

对应声明：`Typing/cpp/index.d.ts`

对应 C++：`Plugins/Puerts/Source/JsEnv/Private/TestBinding/TestClassWrap.cpp`

## 导入 cpp 模块

```ts
import * as cpp from 'cpp';
import { $ref, $unref } from 'puerts';

const TestClass = cpp.TestClass;
```

`cpp` 模块不是 UE 反射路径；它来自 Puerts C++ `DefineClass`/`UsingCppType` 绑定。

## 类、静态函数、重载

```ts
TestClass.Add(12, 34);
TestClass.Overload();
TestClass.Overload(1);
TestClass.Overload('hello', 2);

const obj = new TestClass(8, 9);
obj.OverloadMethod(1024n);
```

规则：
- 重载以 `Typing/cpp/index.d.ts` 为准。
- `int64` 重载用 `bigint`，如 `1024n`。
- 静态变量像属性一样读写：`TestClass.StaticInt = 789`。
- readonly 变量不要写，例如 `TestClass.Ten`。

## ref / pointer

```ts
const r = $ref(999);
const ret = obj.Ref(r);
console.log($unref(r), ret);

const sr = $ref('msg');
obj.StrPtr(sr);
console.log($unref(sr));
```

规则：
- C++ `T&` 和 `T*` 在绑定后都可能表现为 `$Ref<T>`。
- 传入 `$ref(value)`，调用后用 `$unref(ref)` 取回。
- `ConstRef` 传普通值，不传 `$ref`。

## JS 对象和函数传给 C++

```ts
const j: any = { p: 100 };
new cpp.AdvanceTestClass(100).JsObjectTest(j);

obj2.StdFunctionTest((x, y) => x + y);
```

规则：
- `FJsObject` 可接收普通 JS object，C++ 可以读写其字段。
- `std::function` 参数可传 JS function，签名按 `.d.ts`。
- 这类绑定不依赖 `UFUNCTION/UPROPERTY`，需要 C++ 手写/生成 `DefineClass` 注册。
