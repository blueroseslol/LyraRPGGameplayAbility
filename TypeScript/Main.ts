import * as UE from 'ue';
import { argv } from 'puerts';

// Get arguments passed from C++ (see ULyraGameInstance::OnStart)
const gameInstance = argv.getByName("GameInstance");

console.log('========================================');
console.log('Puerts TypeScript Loaded Successfully!');
console.log('GameInstance:', gameInstance);
console.log('========================================');
