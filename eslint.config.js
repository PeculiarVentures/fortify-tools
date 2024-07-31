import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import stylisticJs from "@stylistic/eslint-plugin-js";
import importPlugin from "eslint-plugin-import-x";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    ignores: ["src/**/*.d.ts"],
    plugins: {
      "@stylistic/js": stylisticJs,
      import: importPlugin,
    },
    rules: {
      "no-param-reassign": ["error", { props: false }],
      "operator-assignment": ["error", "always"],
      "no-empty": 2,
      "no-multi-assign": 2,
      "no-var": 2,
      "spaced-comment": ["warn", "always", { exceptions: ["*"] }],
      "no-fallthrough": 2,
      "arrow-body-style": ["error", "as-needed"],

      "@stylistic/js/eol-last": ["warn", "always"],
      "@stylistic/js/no-multiple-empty-lines": [
        "error",
        { max: 1, maxBOF: 0, maxEOF: 0 },
      ],
      "@stylistic/js/keyword-spacing": 2,
      "@stylistic/js/quotes": ["error", "double"],
      "@stylistic/js/quote-props": ["error", "as-needed"],
      "@stylistic/js/semi": 1,
      "@stylistic/js/semi-style": ["error", "last"],
      "@stylistic/js/brace-style": ["error", "1tbs", { allowSingleLine: true }],
      "@stylistic/js/arrow-parens": ["error", "always"],
      "@stylistic/js/object-curly-spacing": ["error", "always"],
      "@stylistic/js/comma-style": ["error", "last"],

      "@stylistic/js/jsx-quotes": ["error", "prefer-double"],

      "@typescript-eslint/no-unused-vars": ["warn", { caughtErrors: "none" }],
      "@typescript-eslint/no-unused-expressions": [
        "error",
        { allowShortCircuit: true, allowTernary: true },
      ],

      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal"],
        },
      ],
    },
  },
  eslintConfigPrettier
);
