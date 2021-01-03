import { StynPlugin, CSSObject } from "./types";
import { css } from "./css";

const genHash = (prefix = "styn") =>
  prefix + ((Math.random() * 46656) | 0).toString(36) + ((Math.random() * 46656) | 0).toString(36);

export type StynElementOptions = {
  className?: string;
  prefix?: string;
  plugins?: StynPlugin[];
};

export type StynElementReturn = {
  styles: string;
  className: string;
};

export type StynElementFn = (
  object: CSSObject,
  options?: StynElementOptions,
  selector?: string
) => StynElementReturn;

export const element: StynElementFn = (object, options = {}) => {
  const className = options.className ?? genHash(options.prefix ?? "");

  return {
    className,
    styles: css(
      {
        [`.${className}`]: object,
      },
      {
        plugins: options.plugins,
      }
    ),
  };
};
