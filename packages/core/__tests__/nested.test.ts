import { element } from "../src/element";
import { css } from "../src/css";

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

const NESTED2 = `.foo, .bar, #id {
  background-color: red;
}
.foo:hover, .bar:hover, #id:hover {
  background-color: blue;
}
.foo:hover:active, .bar:hover:active, #id:hover:active {
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
      }
    );

    expect(styles).toBe(NESTED);
  });

  test("simple css", () => {
    const styles = css({
      ".foo": {
        backgroundColor: "red",
        "&:hover": {
          backgroundColor: "blue",
          "&:active": {
            backgroundColor: "yellow",
          },
        },
      },
    });

    expect(styles).toBe(NESTED);
  });

  test("multiple selectors css", () => {
    const styles = css({
      ".foo, .bar, #id": {
        backgroundColor: "red",
        "&:hover": {
          backgroundColor: "blue",
          "&:active": {
            backgroundColor: "yellow",
          },
        },
      },
    });

    expect(styles).toBe(NESTED2);
  });
});
