/*
|--------------------------------------------------------------------------
| TS-Node ESM hook
|--------------------------------------------------------------------------
|
| Importing this file before any other file will allow you to run TypeScript
| code directly using TS-Node + SWC. For example
|
| node --import="./tsnode.esm.js" bin/test.ts
| node --import="./tsnode.esm.js" audit.ts
|
|
| Why not use "--loader=ts-node/esm"?
| Because, loaders have been deprecated.
*/

import { register } from 'node:module'
register('ts-node/esm', import.meta.url)
