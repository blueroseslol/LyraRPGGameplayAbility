# JitTest.ts 写法

源示例：`puerts_unreal_demo/TypeScript/JitTest.ts`

## 导出纯 TS 函数

```ts
function fib(n: number): number {
  return n <= 1 ? n : fib(n - 1) + fib(n - 2);
}

export function Fib(n: number): string {
  const begin = new Date();
  const result = fib(n);
  return `using ${new Date().getTime() - begin.getTime()}ms, result = ${result}`;
}
```

规则：
- 给 UE/其他脚本调用的入口用 `export function`。
- 入参与返回值保持简单：`number`、`string`、普通 object 优先。
- 性能测试中保留结果使用，避免被优化掉。
