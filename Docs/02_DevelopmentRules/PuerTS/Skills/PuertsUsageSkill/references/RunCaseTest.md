# RunCaseTest.ts 写法

源示例：`puerts_unreal_demo/TypeScript/RunCaseTest.ts`

## 在 Puerts 中启动 Mocha

```ts
declare function require(name: string): any;

require('mocha');
(globalThis as any).location = new BOMString();

mocha.setup({ ui: 'bdd', reporter: 'json' });
mocha.addFile('./CaseTest.js');
mocha.run();
```

规则：
- Puerts 环境不是浏览器；某些库需要补 `globalThis.location`。
- `mocha.addFile` 指向编译后的 JS 文件，不是 TS 文件。
- `reporter: 'json'` 方便从 runner 读取统计。

## 结果输出

```ts
mocha.run().on('end', function() {
  const stats = this.testResults.stats;
  console.warn(`Test Summary: Pass[${stats.passes}/${stats.tests}], Fail[${stats.failures}/${stats.tests}].`);
});
```

规则：
- 失败时输出 `testResults.failures` 的 JSON，便于 UE 日志定位。
- 这个入口适合测试 GameInstance，不适合正式游戏启动路径。
