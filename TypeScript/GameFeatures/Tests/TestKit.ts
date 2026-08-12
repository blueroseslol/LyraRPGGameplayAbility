/**
 * 极简零依赖测试框架 —— 供 GameFeature 的 contract tests 使用。
 *
 * ## 作用
 * 一个刻意不依赖 @types/node（本项目未安装）的最小测试框架：支持
 * `Test()` 注册用例、`Assert()` / `AssertEqual()` / `AssertThrows()` 断言，
 * `RunTests()` 顺序执行并汇总结果，失败时以非零退出码结束。
 *
 * ## 总测试流程
 * 1. 测试文件顶部 `import { Test, Assert, AssertEqual, RunTests } from "./TestKit"`；
 * 2. 用 `Test("用例名", () => {...})` 注册用例（回调可为 async）；
 * 3. 文件底部 `async function Main() { const Result = await RunTests(); ... }`
 *    + `Main().catch(...)` —— 顺序执行全部用例，任一失败置非零退出码；
 * 4. 对编译产物在纯 Node 下运行：
 *    `node --expose-gc Content/JavaScript/GameFeatures/Tests/ContractTests.js`
 *
 * 流程要点：用例按注册顺序执行，每个用例独立 try/catch；任一断言抛异常即
 * 记为失败并继续下一个用例；最后打印 `N passed, M failed, T total`。
 */

export interface TestResult {
  Passed: number;
  Failed: number;
  Total: number;
}

type TestFn = () => void | Promise<void>;

const Tests: Array<{ Name: string; Fn: TestFn }> = [];

export function Test(Name: string, Fn: TestFn): void {
  Tests.push({ Name, Fn });
}

export function Assert(Condition: unknown, Message = "assertion failed"): asserts Condition {
  if (!Condition) {
    throw new Error(Message);
  }
}

export function AssertEqual<T>(Actual: T, Expected: T, Message?: string): void {
  if (Actual !== Expected) {
    throw new Error(
      `${Message ?? "AssertEqual"} — expected ${String(Expected)}, got ${String(Actual)}`,
    );
  }
}

export function AssertThrows(Fn: () => void, Message?: string): void {
  try {
    Fn();
  } catch {
    return;
  }
  throw new Error(Message ?? "expected function to throw");
}

export async function RunTests(): Promise<TestResult> {
  let Passed = 0;
  let Failed = 0;
  for (const T of Tests) {
    try {
      await T.Fn();
      Passed++;
      console.log(`  ok   ${T.Name}`);
    } catch (Exception) {
      Failed++;
      console.error(`  FAIL ${T.Name}`);
      console.error(
        `       ${Exception instanceof Error ? Exception.stack ?? Exception.message : String(Exception)}`,
      );
    }
  }
  console.log(`\n${Passed} passed, ${Failed} failed, ${Tests.length} total`);
  return { Passed, Failed, Total: Tests.length };
}
