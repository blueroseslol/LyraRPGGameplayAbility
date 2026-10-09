# Ref

| 场景 | 用法 |
| --- | --- |
| 获取 ReactUMG 原生控件 | React `ref` 回调，通过 `instance.nativePtr` 访问；收到 null 时清引用 |
| UE 参数声明为 `$Ref<T>` | `$ref` 创建引用容器，调用后用 `$unref` 取值 |

以下假设 `table` 是已有的 `UE.DataTable`：

```typescript
import * as UE from 'ue';
import { $ref, $unref } from 'puerts';

const outNames = $ref<UE.TArray<string>>();
UE.DataTableFunctionLibrary.GetDataTableRowNames(table, outNames);
const names = $unref(outNames);
```

纯 out 参数可按签名空初始化；in/out 参数需传入有效初值。函数返回值与引用回写分别处理，以工程 `.d.ts` 为准。