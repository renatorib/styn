import { StynTree, StynWalk } from "./tree";

export type StynPlugin = (tree: StynTree, walk: StynWalk) => StynTree;

// TODO: typed css object? how handle strict css property type check and still support css vars?
export type CSSObject = { [key: string]: any };
export type CSSObjectRules = { [key: string]: CSSObject };
