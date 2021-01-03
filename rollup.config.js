import path from "path";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";

const { LERNA_PACKAGE_NAME, LERNA_ROOT_PATH } = process.env;
const PACKAGE_ROOT_PATH = process.cwd();
const PKG_JSON = require(path.join(PACKAGE_ROOT_PATH, "package.json"));

const extensions = [".ts"];

export default {
  input: "./src/index.ts",

  external: ["styn", "@styn/tree"],

  plugins: [
    // Allows node_modules resolution
    resolve({ extensions }),

    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs(),

    // Compile TypeScript/JavaScript files
    babel({
      extensions,
      babelHelpers: "bundled",
      include: ["src/**/*"],
    }),
  ],

  output: [
    PKG_JSON.main
      ? {
          file: PKG_JSON.main,
          format: "cjs",
        }
      : null,
    PKG_JSON.module
      ? {
          file: PKG_JSON.module,
          format: "es",
        }
      : null,
  ].filter(Boolean),
};
