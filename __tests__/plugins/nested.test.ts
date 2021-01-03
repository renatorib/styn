import { element } from "../../src/element";
import { css } from "../../src/css";
import { nested } from "../../src/plugins/nested";

const NESTED = `.foo {
  background-color: red;
}
.foo:hover {
  background-color: blue;
}
.foo:hover:active {
  background-color: yellow;
}
`;

describe("nested", () => {
  test("simple element", () => {
    const { styles } = element(
      {
        backgroundColor: "red",
        "&:hover": {
          backgroundColor: "blue",
          "&:active": {
            backgroundColor: "yellow",
          },
        },
      },
      {
        className: "foo",
        plugins: [nested],
      }
    );

    expect(styles).toBe(NESTED);
  });

  test("simple css", () => {
    const styles = css(
      {
        ".foo": {
          backgroundColor: "red",
          "&:hover": {
            backgroundColor: "blue",
            "&:active": {
              backgroundColor: "yellow",
            },
          },
        },
      },
      {
        plugins: [nested],
      }
    );

    expect(styles).toBe(NESTED);
  });
});
