import { StynPlugin } from "../src/types";
import { css } from "../src/css";

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

describe("css", () => {
  test("basic", () => {
    const styles = css({
      ".foo": {
        backgroundColor: "red",
        "&:hover": {
          backgroundColor: "blue",
          "&:focus": {
            backgroundColor: "yellow",
          },
        },
      },
    });

    expect(styles).toBe(BASIC1);
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

    const styles = css(
      {
        ".foo": {
          width: "350px",
          padding: "20px",
          truncate: true,
        },
      },
      {
        plugins: [truncate],
      }
    );

    expect(styles).toBe(PLUGIN1);
  });
});
