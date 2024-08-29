import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    ignores: ["src/**/*.d.ts"],
    rules: {
      "@typescript-eslint/semi": 1,
      "no-param-reassign": ["error", { props: false }],
      "brace-style": ["error", "1tbs", { allowSingleLine: true }],
      "operator-assignment": ["error", "always"],
      "no-empty": 2,
      "no-multi-assign": 2,
      "spaced-comment": ["warn", "always", { exceptions: ["*"] }],
      "no-var": 2,
      "@typescript-eslint/keyword-spacing": 2,
      "no-fallthrough": 2,
      "@typescript-eslint/no-unused-vars": 1,
      quotes: ["error", "double"],
      "arrow-body-style": ["error", "as-needed"],
      "eol-last": ["warn", "always"],
      "no-multiple-empty-lines": ["error", { max: 1, maxBOF: 0, maxEOF: 0 }],
    },
  }
);
