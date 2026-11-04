// Same as src/index.tsx: @peculiar/x509 needs the Reflect polyfill before it loads.
import '@abraham/reflection';
import { expect } from 'vitest';
import * as matchers from 'vitest-dom/matchers';
import i18n from './src/i18n';

void i18n.init();
expect.extend(matchers);
