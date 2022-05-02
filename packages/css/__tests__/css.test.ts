import { StynPlugin } from "../src/types";
import { css, createCss } from "../src/css";

const BASIC1 = `.foo {
  background-color: red;
}
.foo:hover {
  background-color: blue;
}
.foo:hover:focus {
  background-color: yellow;
}
`;
const PLUGIN1 = `.foo {
  width: 350px;
  padding: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
`;

describe.only("css", () => {
  test.only("basic", () => {
    const customCss = createCss();
    const cssObj = {
      ".foo": {
        backgroundColor: "red",
        "&:hover": {
          backgroundColor: "blue",
          "&:focus": {
            backgroundColor: "yellow",
          },
        },
      },
    };

    const customCssStyles = customCss(cssObj);
    const cssStyles = css(cssObj);

    console.log(customCssStyles);
    console.log(cssStyles);

    expect(customCssStyles).toBe(BASIC1);
    expect(cssStyles).toBe(BASIC1);
  });

  test("custom plugins", () => {
    const truncate: StynPlugin = (tree, walk) => {
      return walk(tree, (rule) => {
        if (rule.declarations) {
          for (const property in rule.declarations) {
            if (property === "truncate") {
              delete rule.declarations.truncate;
              rule.declarations.whiteSpace = "nowrap";
              rule.declarations.overflow = "hidden";
              rule.declarations.textOverflow = "ellipsis";
            }
          }
        }
      });
    };

    const customCss = createCss({ plugins: [truncate] });
    const cssObj = {
      ".foo": {
        width: "350px",
        padding: "20px",
        truncate: true,
      },
    };

    const cssStyles = css(cssObj, {
      plugins: [truncate],
    });
    const customCssStyles = customCss(cssObj);

    expect(cssStyles).toBe(PLUGIN1);
    expect(customCssStyles).toBe(PLUGIN1);
  });
});
