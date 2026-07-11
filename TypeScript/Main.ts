import * as UE from "ue";
import * as puerts from "puerts";
import { GameplayRuntime } from "@matrix/puerts-runtime";

const gameInstance = puerts.argv.getByName("GameInstance") as UE.GameInstance;
const runtime = new GameplayRuntime(gameInstance);
runtime.start();
