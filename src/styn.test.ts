import { styn, StynPlugin } from "./styn";

const BASIC1 = (selector: string) => `${selector} {
  background-color: red;
}
`;
const BASIC2 = (selector: string) => `${selector} {
  background-color: red;
  border-color: #556677;
  color: blue;
}
`;
const VENDOR1 = (selector: string) => `${selector} {
  appearence: button;
  -webkit-appearence: button;
  -moz-appearence: button;
}
`;
const NESTED1 = (selector: string) => `${selector} {
  background-color: red;
}
${selector}:hover {
  background-color: blue;
}
`;
const NESTED2 = (selector: string) => `${selector} {
  background-color: red;
}
${selector}:hover {
  background-color: blue;
}
${selector}:active {
  background-color: yellow;
}
`;
const NESTED3 = (selector: string) => `${selector} {
  background-color: red;
}
${selector}:hover, ${selector}:active, ${selector}:focus {
  background-color: blue;
}
`;
const PLUGIN1 = (selector: string) => `${selector} {
  width: 350px;
  padding: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
`;

describe("styn", () => {
  test("single property", () => {
    const { selector, css } = styn({
      backgroundColor: "red",
    });
    expect(css).toBe(BASIC1(selector));
    expect(selector[0]).toBe(".");
  });

  test("multiple properties", () => {
    const { selector, css } = styn({
      backgroundColor: "red",
      borderColor: "#556677",
      color: "blue",
    });
    expect(css).toBe(BASIC2(selector));
  });

  test("vendor prefix properties", () => {
    const { selector, css } = styn({
      appearence: "button",
      WebkitAppearence: "button",
      MozAppearence: "button",
    });
    expect(css).toBe(VENDOR1(selector));
  });

  test("simple nested", () => {
    const { selector, css } = styn({
      backgroundColor: "red",
      "&:hover": {
        backgroundColor: "blue",
      },
    });
    expect(css).toBe(NESTED1(selector));
  });

  test("multiple nested", () => {
    const { selector, css } = styn({
      backgroundColor: "red",
      "&:hover": { backgroundColor: "blue" },
      "&:active": { backgroundColor: "yellow" },
    });
    expect(css).toBe(NESTED2(selector));
  });

  test("option name", () => {
    const { selector, css } = styn(
      {
        backgroundColor: "red",
      },
      {
        selector: ".custom-selector",
      }
    );
    expect(selector).toBe(".custom-selector");
    expect(css).toBe(BASIC1(selector));
  });

  test("nested with multiple & references", () => {
    const { selector, css } = styn({
      backgroundColor: "red",
      "&:hover, &:active, &:focus": {
        backgroundColor: "blue",
      },
    });
    expect(css).toBe(NESTED3(selector));
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

    const { selector, css } = styn(
      {
        width: "350px",
        padding: "20px",
        truncate: true,
      },
      {
        plugins: [truncate],
      }
    );

    expect(css).toBe(PLUGIN1(selector));
  });
});
