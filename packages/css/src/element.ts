import { StynPlugin, CSSObject } from "./types";
import { css } from "./css";

const genHash = (prefix = "styn") =>
  prefix + ((Math.random() * 46656) | 0).toString(36) + ((Math.random() * 46656) | 0).toString(36);

export type StynElementOptions = {
  className?: string;
  prefix?: string;
  plugins?: StynPlugin[];
};

export const element = (objectRules: CSSObject, options: StynElementOptions = {}) => {
  const className = options.className ?? genHash(options.prefix ?? "styn");

  return {
    className,
    styles: css(
      {
        [`.${className}`]: objectRules,
      },
      {
        plugins: options.plugins,
      }
    ),
  };
};

export const createElement =
  (options: StynElementOptions = {}) =>
  (objectRules: CSSObject) =>
    element(objectRules, options);
