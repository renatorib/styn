import { stringify, walk, parse } from "@styn/tree";
import { StynPlugin, CSSObjectRules } from "./types";
import { nested } from "./plugins/nested";

const corePlugins = [nested];

export type StynCssOptions = {
  plugins?: StynPlugin[];
};

export const css = (objectRules: CSSObjectRules, options: StynCssOptions = {}) => {
  let tree = parse(objectRules);

  // apply pipe of plugins to generate a new tree
  // plugins applies in array order 0, 1...
  // plugin[2](plugin[1](plugin[0](tree)))
  const plugins = [...corePlugins, ...(options.plugins ?? [])];
  const newTree = [...plugins].reduce((tree, plugin) => plugin(tree, walk), tree);

  console.log(newTree);

  return stringify(newTree);
};

export const createCss =
  (options: StynCssOptions = {}) =>
  (objectRules: CSSObjectRules) =>
    css(objectRules, options);
