import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginImport from "eslint-plugin-import";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: {
      import: pluginImport,
    },
    extends: [js.configs.recommended],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "import/no-unresolved": "error",
    },
    settings: {
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
          extensions: [".js", ".jsx", ".json"],
        },
      },
    },
  },

  pluginReact.configs.flat.recommended,
]);
