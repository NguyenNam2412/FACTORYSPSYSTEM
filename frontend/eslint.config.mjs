// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginImport from "eslint-plugin-import";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Cấu hình mặc định cho JS
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    plugins: {
      import: pluginImport,
      react: pluginReact,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    extends: [
      js.configs.recommended, // rule cho JS
      ...tseslint.configs.recommended, // rule cho TS
      pluginReact.configs.flat.recommended, // rule cho React
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      // Import alias + check path
      "import/no-unresolved": "error",

      // React
      "react/react-in-jsx-scope": "off", // React 17+ không cần import React
      "react/prop-types": "off", // dùng TS nên không cần prop-types

      // TS
      "@typescript-eslint/no-unused-vars": ["warn"],

      // Chung
      "no-console": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        alias: {
          map: [
            ["@components", "./src/components"],
            ["@utils", "./src/utils"],
            ["@api", "./src/api"],
            ["@helpers", "./src/helpers"],
            ["@pages", "./src/pages"],
            ["@routes", "./src/routes"],
            ["@store", "./src/store"],
            ["@styles", "./src/styles"],
          ],
          extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        },
      },
    },
  },
]);
