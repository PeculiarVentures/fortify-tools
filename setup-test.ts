import { expect } from 'vitest';
import * as matchers from 'vitest-dom/matchers';
import i18n from './src/i18n';

void i18n.init();
expect.extend(matchers);
