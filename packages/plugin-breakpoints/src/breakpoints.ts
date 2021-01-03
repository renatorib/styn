import { StynPlugin } from "styn";
import { Declarations } from "@styn/tree";

type ScreensList = { [screen: string]: string };

export const breakpoints = (
  screens: ScreensList,
  template = (size: string) => `@media (min-width: ${size})`
): StynPlugin => (tree, walk) => {
  return walk(tree, (rule, parent, index) => {
    if (rule.type === "rule" && rule.declarations) {
      let it = 1;
      for (const property in rule.declarations) {
        if (typeof rule.declarations[property] === "object") {
          const mqrule = {
            type: "at-rule" as const,
            keyword: template(screens[property]),
            rules: [
              {
                type: "rule" as const,
                selector: rule.selector,
                declarations: rule.declarations[property] as Declarations,
              },
            ],
          };
          delete rule.declarations[property];
          parent.splice(index + it, 0, mqrule);
          it++;
        }
      }
    }
  });
};
