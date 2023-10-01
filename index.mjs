import { readFile } from 'node:fs/promises';
import PHPWasm from './php-wasm.mjs'

const code = await readFile('/dev/stdin', { encoding: 'utf-8' });

const { ccall } = await PHPWasm();
const result = ccall(
  'php_wasm_run',
  'number', ['string'],
  [code],
);
console.log(`result: ${result}`);
