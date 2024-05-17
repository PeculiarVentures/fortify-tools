import * as matchers from "vitest-dom/matchers";
import { expect } from "vitest";
import i18n from "./src/i18n";
i18n.init();
expect.extend(matchers);
