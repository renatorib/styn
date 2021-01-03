import { stringify, walk, parse, Declarations } from "@styn/tree";
import { StynPlugin, CSSObjectRules } from "./types";

const nested: StynPlugin = (tree, walk) => {
  return walk(tree, (rule, parent, index) => {
    const unnest = (declarations: Declarations, selector: string) => {
      const selectors = selector.split(",");
      for (const property in declarations) {
        if (typeof declarations[property] === "object" && property.includes("&")) {
          const nestedDeclarations = declarations[property] as Declarations;
          const nestedSelector = selectors.map((sel) => property.replace(/&/gm, sel)).join(",");
          unnest(nestedDeclarations, nestedSelector);
          parent.splice(index + 1, 0, {
            type: "rule",
            selector: nestedSelector,
            declarations: nestedDeclarations,
          });
          delete declarations[property];
        }
      }
    };
    if (rule.type === "rule" && rule.declarations) {
      unnest(rule.declarations, rule.selector);
    }
  });
};

const corePlugins = [nested];

export type StynCssOptions = {
  plugins?: StynPlugin[];
};

export type StynCss = (objectRules: CSSObjectRules, options?: StynCssOptions) => string;

export const css: StynCss = (objectRules, options = {}) => {
  const plugins = [...corePlugins, ...(options.plugins ?? [])];

  let tree = parse(objectRules);

  // apply pipe of plugins to generated a new tree
  // plugins applies in array order 0 -> Infinity
  // plugin[2](plugin[1](plugin[0](tree)))
  tree = plugins.reduce((tree, plugin) => plugin(tree, walk), tree);

  return stringify(tree);
};
