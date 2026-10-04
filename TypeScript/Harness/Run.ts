import { argv } from 'puerts';
import { inventoryStacks } from './Inventory.test';

declare function setTimeout(callback: () => void, milliseconds: number): unknown;
interface ResultBridge {
    Case: string;
    Fault: string;
    Complete(success: boolean, message: string): void;
}
const result = argv.getByName('Result') as unknown as ResultBridge;

async function run(): Promise<void> {
    if (result.Fault === 'Throw') throw new Error('Injected TS exception');
    if (result.Fault === 'Reject') await Promise.reject(new Error('Injected Promise rejection'));
    if (result.Fault === 'Timeout') await new Promise<void>(() => {});
    if (result.Case === 'AsyncInventory') await new Promise<void>(resolve => setTimeout(resolve, 20));
    else if (result.Case !== 'Inventory') throw new Error(`Unknown test: ${result.Case}`);
    inventoryStacks(result.Fault === 'Failure');
}
run().then(() => result.Complete(true, ''), error =>
    result.Complete(false, error instanceof Error ? error.stack ?? error.message : String(error)));
