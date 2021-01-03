import { StynPlugin } from "../src/types";
import { element } from "../src/element";

const BASIC1 = (className: string) => `.${className} {
  background-color: red;
}
`;
const BASIC2 = (className: string) => `.${className} {
  background-color: red;
  border-color: #556677;
  color: blue;
}
`;
const VENDOR1 = (className: string) => `.${className} {
  appearence: button;
  -webkit-appearence: button;
  -moz-appearence: button;
}
`;
const PLUGIN1 = (className: string) => `.${className} {
  width: 350px;
  padding: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
`;

describe("element", () => {
  test("single property", () => {
    const { className, styles } = element({
      backgroundColor: "red",
    });
    expect(styles).toBe(BASIC1(className));
  });

  test("multiple properties", () => {
    const { className, styles } = element({
      backgroundColor: "red",
      borderColor: "#556677",
      color: "blue",
    });
    expect(styles).toBe(BASIC2(className));
  });

  test("vendor prefix properties", () => {
    const { className, styles } = element({
      appearence: "button",
      WebkitAppearence: "button",
      MozAppearence: "button",
    });
    expect(styles).toBe(VENDOR1(className));
  });

  test("custom className", () => {
    const { className, styles } = element(
      {
        backgroundColor: "red",
      },
      {
        className: "custom-selector",
      }
    );
    expect(className).toBe("custom-selector");
    expect(styles).toBe(BASIC1(className));
  });

  test("prefix", () => {
    const { className } = element(
      {
        backgroundColor: "red",
      },
      {
        prefix: "bar",
      }
    );
    expect(className.substr(0, 3)).toBe("bar");
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

    const { className, styles } = element(
      {
        width: "350px",
        padding: "20px",
        truncate: true,
      },
      {
        plugins: [truncate],
      }
    );

    expect(styles).toBe(PLUGIN1(className));
  });
});
