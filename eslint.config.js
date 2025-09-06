import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

import { defineConfig } from "eslint/config";

export default defineConfig(
  {
    ignores: ["**/build/**", "**/dist/**"],
  },
  tseslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  reactHooks.configs["recommended-latest"],
  reactRefresh.configs.vite,
  reactX.configs["recommended-typescript"],
  reactDom.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  }
);
