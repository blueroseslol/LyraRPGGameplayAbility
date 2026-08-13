import * as UE from "ue";
import * as puerts from "puerts";

console.log("GameplayRuntime start");

// GameFeature 生命周期控制已迁移回 UE 原生子系统（UGameFeaturesSubsystem / Lyra Experience），
// 不再由 TS 重造状态机。本入口保留 PuerTS 运行时接线；后续 TS 侧如需驱动 GameFeature，
// 应调用 C++ 的 BlueprintCallable 薄包装（如 ULyraGameFeatureStatics）。
// 取 GameInstance 的既有方式如下（保留以备后续接线）：
const GameInstance = puerts.argv.getByName("GameInstance") as UE.GameInstance | null;
console.log(`[GameplayRuntime] GameInstance ${GameInstance ? "已就绪" : "未绑定"}`);
