// Hey, hi! You can see an example of tree in the test file.

type Keyword = string;
type Selector = string;
type Declarations = { [property: string]: number | string };

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
          return linewrap(i(`${prop}: ${value};`, _i + 2));
        })
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
      const rules = atRule.rules.map((rule) => stringifyRule(rule, 2)).join("");
      return linewrap(i(`${keyword}${values} ${block(rules)}`, _i));
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

export type StynWalk = (tree: StynTree, callback: (r: StynRule) => void) => StynTree;

export const walk: StynWalk = (tree, cb) => {
  const treeCopy = { ...tree };
  treeCopy.rules.forEach((rule) => {
    cb(rule);
    if (rule.type === "at-rule" && rule.rules) {
      rule.rules.forEach((rule) => {
        cb(rule);
      });
    }
  });
  return treeCopy;
};
