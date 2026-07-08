# UsingReactUMG.ts 写法

源示例：`puerts_unreal_demo/TypeScript/UsingReactUMG.ts`

## 入口

```ts
import { ReactUMG } from 'react-umg';
import * as UI from './main-ui';

const world = (argv.getByName('GameInstance') as UE.GameInstance).GetWorld();
ReactUMG.init(world);
UI.Load();
```

规则：
- 使用 React UMG 前必须先 `ReactUMG.init(world)`。
- `UI.Load()` 中调用 `ReactUMG.render(<Root />)`。
- `react-umg` 是示例自定义 renderer，不是 UE 原生 API；renderer 细节查 `react-umg.md`。
