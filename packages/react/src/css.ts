import { stringify, walk, parse } from "@styn/tree";
import { StynPlugin, CSSObjectRules } from "./types";
import { nested } from "./nested";

const corePlugins = [nested];

export type StynCssOptions = {
  plugins?: StynPlugin[];
};

export type StynCss = (objectRules: CSSObjectRules, options?: StynCssOptions) => string;

export const css: StynCss = (objectRules, options = {}) => {
  let tree = parse(objectRules);

  // apply pipe of plugins to generate a new tree
  // plugins applies in array order 0, 1...
  // plugin[2](plugin[1](plugin[0](tree)))
  const plugins = [...corePlugins, ...(options.plugins ?? [])];
  tree = plugins.reduce((tree, plugin) => plugin(tree, walk), tree);

  return stringify(tree);
};
