import { writeFixture } from './test/fixture.mjs';
if (!process.argv[2]) throw new Error('Specify a new fixture package directory');
console.log(JSON.stringify((await writeFixture(process.argv[2])).summary));
