import { readFile } from 'node:fs/promises';
import PHPWasm from './php-wasm.mjs'

const PRELUDE = `
define('STDIN', fopen('php://stdin', 'r'));
define('STDOUT', fopen('php://stdout', 'r'));
define('STDERR', fopen('php://stderr', 'r'));

`;

const code = await readFile('/dev/stdin', { encoding: 'utf-8' });

const BUFFER_MAX = 1024 * 1024; // 1 MiB

let stdoutPos = 0; // bytewise
const stdoutBuf = Buffer.alloc(BUFFER_MAX);
let stderrPos = 0; // bytewise
const stderrBuf = Buffer.alloc(BUFFER_MAX);

const { ccall } = await PHPWasm({
  stdout: (asciiCode) => {
    if (asciiCode === null) {
      return; // flush
    }
    if (BUFFER_MAX <= stdoutPos) {
      return; // ignore
    }
    stdoutBuf.writeUInt8(
      asciiCode < 0 ? asciiCode + 256 : asciiCode,
      stdoutPos++,
    );
  },
  stderr: (asciiCode) => {
    if (asciiCode === null) {
      return; // flush
    }
    if (BUFFER_MAX <= stderrPos) {
      return; // ignore
    }
    stderrBuf.writeUInt8(
      asciiCode < 0 ? asciiCode + 256 : asciiCode,
      stderrPos++,
    );
  },
});
const result = ccall(
  'php_wasm_run',
  'number', ['string'],
  [PRELUDE + code],
);
console.log(`result: ${result}`);

console.log("stdout:");
console.log(stdoutBuf.subarray(0, stdoutPos).toString());

console.log("stderr:");
console.log(stderrBuf.subarray(0, stderrPos).toString());
