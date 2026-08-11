import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "scripts/**",
    "tmp/**",
    "check-db.js",
    "order-check.js",
    "read_pdf.js",
    "harden_payment_schema.js",
  ]),
  {
    files: ["src/**/*.{js,jsx,ts,tsx}", "tests/**/*.{js,jsx,ts,tsx}"],
    rules: {
      // These legacy typing/style findings remain visible as warnings while
      // build, unit tests, browser tests and Lighthouse stay release-blocking.
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      "react/no-unescaped-entities": "warn",
      "prefer-const": "warn",
    },
  },
]);

export default eslintConfig;
