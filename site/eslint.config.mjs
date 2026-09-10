import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // The comparison arms are self-contained specimens: each one loads its own
    // faces with a <link> so a reader can open the file and see the whole thing.
    // Hoisting them into the app's font pipeline would make the arms depend on
    // the chrome, which is the one thing a controlled comparison must not do.
    files: ["src/arms/**/*.tsx"],
    rules: { "@next/next/no-page-custom-font": "off" },
  },
]);

export default eslintConfig;
