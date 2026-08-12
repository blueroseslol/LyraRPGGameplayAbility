import * as UE from "ue";
import * as puerts from "puerts";
import { BootstrapGameFeatures } from "./GameFeatures/Bootstrap";

const GameInstance = puerts.argv.getByName("GameInstance") as UE.GameInstance;

console.log("GameplayRuntime start");

// 接入 GameFeature 脚本生命周期（M3, 4.5）：同一 VM 内只引导一次。
BootstrapGameFeatures(GameInstance);