/**
 * 极简零依赖测试框架，用于 contract tests。
 *
 * 刻意不依赖 @types/node（本项目未安装），因此可对编译产物在纯 Node 下运行：
 *
 *   node --expose-gc Content/JavaScript/GameFeatures/tests/contractTests.js
 */

export interface TestResult {
  passed: number;
  failed: number;
  total: number;
}

type TestFn = () => void | Promise<void>;

const tests: Array<{ name: string; fn: TestFn }> = [];

export function test(name: string, fn: TestFn): void {
  tests.push({ name, fn });
}

export function assert(condition: unknown, message = "assertion failed"): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export function assertEqual<T>(actual: T, expected: T, message?: string): void {
  if (actual !== expected) {
    throw new Error(
      `${message ?? "assertEqual"} — expected ${String(expected)}, got ${String(actual)}`,
    );
  }
}

export function assertThrows(fn: () => void, message?: string): void {
  try {
    fn();
  } catch {
    return;
  }
  throw new Error(message ?? "expected function to throw");
}

export async function runTests(): Promise<TestResult> {
  let passed = 0;
  let failed = 0;
  for (const t of tests) {
    try {
      await t.fn();
      passed++;
      console.log(`  ok   ${t.name}`);
    } catch (error) {
      failed++;
      console.error(`  FAIL ${t.name}`);
      console.error(`       ${error instanceof Error ? error.stack ?? error.message : String(error)}`);
    }
  }
  console.log(`\n${passed} passed, ${failed} failed, ${tests.length} total`);
  return { passed, failed, total: tests.length };
}
