// Hey, hi! You can see an example of tree in the test file.

export type Keyword = string;
export type Selector = string;
export type Declarations = { [property: string]: number | string | Declarations };

export type Rule = {
  type: "rule";
  selector: Selector;
  declarations: Declarations;
};

export type AtRule = {
  type: "at-rule";
  keyword: Keyword;
  values?: string[];
  declarations?: Declarations;
  rules?: Rule[];
};

export type StynRule = Rule | AtRule;

export type StynTree = {
  rules: StynRule[];
  meta: {
    [k: string]: any;
    [k: number]: any;
  };
};

const i = (content: string, count: number) => `${" ".repeat(count)}${content}`; // indentation

const linewrap = (content: string) =>
  content[content.length - 1] === "\n" ? content : `${content}\n`;

const block = (content: string, _i = 0) => {
  const open = `{\n`;
  const close = i("}", _i);
  return `${open}${linewrap(content)}${close}\n`;
};

const normalizeProp = (prop: string) =>
  [...prop].map((l) => (l.toLowerCase() === l ? l : `-${l.toLowerCase()}`)).join("");

const join = (arr: any[], fn: Function = (x: any) => x, ...args: any[]) => {
  return arr
    .map((item) => fn(item, ...args))
    .map(linewrap)
    .join("");
};

export const stringify = (tree: StynTree) => {
  const stringifyDeclarations = (declarations: Declarations, _i = 0) => {
    return block(
      Object.keys(declarations)
        .map((property) => {
          const prop = normalizeProp(property);
          const value = declarations[property];
          if (typeof value === "object") return undefined;
          return linewrap(i(`${prop}: ${value};`, _i + 2));
        })
        .filter(Boolean)
        .join(""),
      _i
    );
  };

  const stringifyRule = (rule: Rule, _i = 0) => {
    const declarations = stringifyDeclarations(rule.declarations, _i);
    return linewrap(i(`${rule.selector} ${declarations}`, _i));
  };

  const stringifyAtRule = (atRule: AtRule, _i = 0) => {
    const keyword = atRule.keyword;
    const values = atRule.values ? ` ${atRule.values.join(" ")}` : "";

    if (atRule.declarations) {
      const declarations = stringifyDeclarations(atRule.declarations, _i);
      return linewrap(i(`${keyword}${values} ${declarations}`, _i));
    } else if (atRule.rules) {
      const rules = atRule.rules.map((rule) => stringifyRule(rule, _i + 2)).join("");
      return linewrap(i(`${keyword}${values} ${block(rules, _i)}`, _i));
    } else {
      return linewrap(i(`${keyword}${values};`, _i));
    }
  };

  const stringifyStynRule = (rule: StynRule) => {
    if (rule.type === "at-rule") {
      return stringifyAtRule(rule as AtRule);
    } else if (rule.type === "rule") {
      return stringifyRule(rule as Rule);
    }
    return "";
  };

  return join(tree.rules.map(stringifyStynRule).filter(Boolean));
};

export const parse = (object: { [k: string]: any }): StynTree => {
  const rules: StynRule[] = [];

  for (const prop in object) {
    const value = object[prop];
    if (prop.startsWith("@")) {
      // Handle at-rules
      const atRule: AtRule = {
        type: "at-rule",
        keyword: prop,
      };
      if (prop.startsWith("@font-face")) {
        // Handle at-rules with declarations
        atRule.declarations = value;
      } else if (typeof value === "object") {
        // Handle at-rules with selectors (rules)
        atRule.rules = [];
        for (const selector in value) {
          atRule.rules.push({
            type: "rule",
            selector,
            declarations: value[selector],
          });
        }
      } else if (typeof value === "string") {
        atRule.values = [value];
      }
      rules.push(atRule);
    } else {
      // Handle normal rules
      const rule: Rule = {
        type: "rule",
        selector: prop,
        declarations: value,
      };
      rules.push(rule);
    }
  }

  return { rules, meta: {} };
};

export type StynWalk = (
  tree: StynTree,
  callback: (r: StynRule, parent: StynRule[], index: number) => void
) => StynTree;

export const walk: StynWalk = (tree, cb) => {
  const treeCopy = { ...tree };
  for (const rule of treeCopy.rules) {
    cb(rule, treeCopy.rules, treeCopy.rules.indexOf(rule));
    if (rule.type === "at-rule" && typeof rule.rules !== "undefined") {
      for (const childRule of rule.rules) {
        cb(childRule, rule.rules, rule.rules.indexOf(childRule));
      }
    }
  }
  return treeCopy;
};
