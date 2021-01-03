import { StynPlugin } from "../types";
import { Declarations } from "../tree";

export const nested: StynPlugin = (tree, walk) => {
  return walk(tree, (rule, parent, index) => {
    const unnest = (declarations: Declarations, selector: string) => {
      for (const property in declarations) {
        if (typeof declarations[property] === "object" && property.includes("&")) {
          const nestedDeclarations = declarations[property] as Declarations;
          const nestedSelector = property.split("&").join(selector);
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
