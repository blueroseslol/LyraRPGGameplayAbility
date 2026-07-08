# FFITest.ts 写法

源示例：`puerts_unreal_demo/TypeScript/FFITest.ts`

对应源码：`Source/puerts_unreal_demo/FFITestGameInstance.cpp`

对应声明：`Typing/ffi/index.d.ts`

## 前提

`FFITestGameInstance` 在 `OnStart()` 里调用 `SetFunctionArray(Funcs, Num)`，TS 侧用函数索引绑定。普通 UE 反射调用不要用 `ffi`。

## 绑定函数指针

```ts
import * as ffi from 'ffi';

const Add = ffi.binding(0, 'int32', ['int32', 'int32']);
console.log(Add(22, 55));
```

规则：
- 第一个参数是 C++ 注册的函数索引，或真实函数指针。
- return/parameter 类型用 `ffi` primitive type 或 `TypeInfo`。
- 可变参数用 `fixArgNum`：`ffi.binding(2, 'int32', ['cstring', 'int32'], 1)`。

## 内存和 pointer

```ts
const int32 = ffi.typeInfo('int32');
const data = int32.alloc(2, 4, 1);
console.log(int32.get(data, 0));

const int32ptr = ffi.makePointer('int32');
const n = int32ptr.unref(ptr);
```

规则：
- `alloc` 返回 `Uint8Array` 作为 native buffer。
- 数组元素用 `get(pointer, index)`/`set(pointer, value, index)`。
- pointer 类型用 `makePointer(type)`，读写用 `ref`/`unref`。

## closure 回调

```ts
const cb = ffi.closure.alloc((x, y) => 0, 'int32', [int32ptr, int32ptr]);
qsort(data, len, int32.size, ffi.closure.func(cb));
ffi.closure.free(cb);
```

规则：
- JS function 传给 C 函数指针参数前，用 `ffi.closure.alloc`。
- 调用结束且 C++ 不再保存后必须 `ffi.closure.free(cb)`。

## struct

```ts
const TestData = ffi.makeStruct({ A: 'int32', B: 'int32' });
const p = new TestData({ A: 100, B: 101 });
PrintByValue(p);
ffi.makePointer(TestData).ref(p);
```

规则：
- by value 直接传 struct 实例。
- by pointer 先 `makePointer(structType).ref(instance)`。
