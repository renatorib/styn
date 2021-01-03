import { stringify, walk, StynTree, StynWalk } from "./tree";

const gen6Hash = () => {
  return (
    "styn" + ((Math.random() * 46656) | 0).toString(36) + ((Math.random() * 46656) | 0).toString(36)
  );
};

export type StynPlugin = (tree: StynTree, walk: StynWalk) => StynTree;

export type StynOptions = {
  selector?: string;
  plugins?: StynPlugin[];
};

export type StynReturn = {
  css: string;
  selector: string;
};

// TODO: typed css object? how handle strict css property type check and still support css vars?
export type CSSObject = { [key: string]: any };

export type StynFn = (object: CSSObject, options?: StynOptions, selector?: string) => StynReturn;

// transformer
export const styn: StynFn = (object, options = {}) => {
  const selector = options.selector ?? `.${gen6Hash()}`;
  const plugins = options.plugins ?? [];
  const nestedDeclarations: any = {};
  const declarations: any = {};

  let tree: StynTree = {
    rules: [],
  };

  // Separate nested properties from non nested properties
  // Nested properties are those who values are objects
  for (const property in object) {
    const value = object[property];
    if (typeof value === "object" && !Array.isArray(value)) {
      nestedDeclarations[property] = value;
    } else {
      declarations[property] = value;
    }
  }

  tree.rules.push({
    type: "rule",
    selector: selector,
    declarations,
  });

  for (const nestedSelector in nestedDeclarations) {
    // in nested styles, the property name *is* the selector
    tree.rules.push({
      type: "rule",
      // TODO: & replace should be part of core? maybe move to a built-in plugin?
      selector: nestedSelector.split("&").join(selector),
      declarations: nestedDeclarations[nestedSelector],
    });
  }

  // apply pipe of plugins to generated a new tree
  // plugins applies in array order 0 -> Infinity
  // plugin[2](plugin[1](plugin[0](tree)))
  tree = plugins.reduce((tree, plugin) => plugin(tree, walk), tree);

  return { css: stringify(tree), selector };
};
