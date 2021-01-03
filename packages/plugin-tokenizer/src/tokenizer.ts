import { StynPlugin } from "styn";

function flatten(ob: any) {
  let toReturn: any = {};

  for (const i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if (typeof ob[i] == "object" && ob[i] !== null) {
      const flatObject = flatten(ob[i]);
      for (const x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;
        toReturn[i + "." + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }

  return toReturn;
}

type TokenList = { [token: string]: string | number | TokenList };

export const tokenizer = (tokens: TokenList): StynPlugin => (tree, walk) => {
  return walk(tree, (rule) => {
    const tokensFlat = flatten(tokens);
    if (rule.declarations) {
      for (const property in rule.declarations) {
        const value = rule.declarations[property];
        if (typeof value !== "object" && value in tokensFlat) {
          rule.declarations[property] = tokensFlat[value];
        }
      }
    }
  });
};
