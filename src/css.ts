import { StynPlugin, CSSObjectRules } from "./types";
import { stringify, walk, StynTree } from "./tree";
import { nested } from "./plugins/nested";

export type StynCssOptions = {
  plugins?: StynPlugin[];
};

export type StynCss = (objectRules: CSSObjectRules, options?: StynCssOptions) => string;

export const css: StynCss = (objectRules, options = {}) => {
  const plugins = [nested, ...(options.plugins ?? [])];

  let tree: StynTree = {
    rules: [],
  };

  for (const objectRule in objectRules) {
    tree.rules.push({
      type: "rule",
      selector: objectRule,
      declarations: objectRules[objectRule],
    });
  }

  // apply pipe of plugins to generated a new tree
  // plugins applies in array order 0 -> Infinity
  // plugin[2](plugin[1](plugin[0](tree)))
  tree = plugins.reduce((tree, plugin) => plugin(tree, walk), tree);

  return stringify(tree);
};
