import { UNITS_A } from './units-a.js';
import { UNITS_B } from './units-b.js';

/** 课本内置的 11 个单元（Starter + Unit 1~10），只读。家长自定义内容在 store.js 里合并。 */
export const BUILTIN_UNITS = [...UNITS_A, ...UNITS_B];
