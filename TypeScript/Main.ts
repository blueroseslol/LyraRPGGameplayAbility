import * as UE from 'ue';
import { argv } from 'puerts';
import { loadFigwrightCover } from './UI/FigwrightCover';
import { pluginGreeting } from '../Plugins/EasyEditorPlugin/TypeScript/Runtime';

const gameInstance = argv.getByName("GameInstance") as UE.GameInstance;
const world = gameInstance?.GetWorld();
/*
console.log('========================================');
console.log('Puerts TypeScript Loaded Successfully!');
console.log('[EasyEditor Runtime]', pluginGreeting('Lyra'));
console.log('GameInstance:', gameInstance);
console.log('========================================');
*/
export let figwrightUI: ReturnType<typeof loadFigwrightCover> | undefined;

if (world) {
    figwrightUI = loadFigwrightCover(world);
    console.log('[ReactUMG] Figwright Cover added to the game viewport');
} else {
    console.error('[ReactUMG] Cannot display Figwright Cover: GameInstance world is unavailable');
}
