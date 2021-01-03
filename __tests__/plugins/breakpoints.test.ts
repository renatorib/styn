import { element } from "../../src/element";
import { breakpoints } from "../../src/plugins/breakpoints";

const WITHBREAKPOINTS = `.foo {
  background-color: red;
}
@media (min-width: 768px) {
  .foo {
    background-color: blue;
  }
}
@media (min-width: 1024px) {
  .foo {
    background-color: yellow;
  }
}
`;

describe("breakpoints", () => {
  test("simple", () => {
    const plugins = [
      breakpoints({
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      }),
    ];

    const { styles } = element(
      {
        backgroundColor: "red",
        md: {
          backgroundColor: "blue",
        },
        lg: {
          backgroundColor: "yellow",
        },
      },
      { className: "foo", plugins }
    );

    expect(styles).toBe(WITHBREAKPOINTS);
  });
});
