# MyAssert.ts 写法

源示例：`puerts_unreal_demo/TypeScript/MyAssert.ts`

## 轻量断言

```ts
export function equal(actual: any, expected: any, message?: string): void {
  if (actual != expected) {
    throw new AssertionError(message || `${actual} == ${expected}`, actual, expected, '==');
  }
}
```

提供 `equal`、`notEqual`、`ok` 给 `CaseTest.ts` 使用。

规则：
- 断言失败直接 throw `AssertionError`，让 Mocha 统计失败。
- 示例使用宽松相等 `==`/`!=`，写新测试时若类型敏感，优先自己补严格断言。
- `code` 固定为 `ERR_TGAMEJS_ASSERT`，便于日志过滤。
