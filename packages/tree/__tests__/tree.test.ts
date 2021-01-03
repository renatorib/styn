import { stringify, parse, walk } from "../src/tree";

const fullTreeOutput = `@keyframes pulse {
  0% {
    background-color: #001f3f;
  }
  100% {
    background-color: #ff4136;
  }
}
@font-face {
  font-family: "CustomFont";
  src: url('myfont.woff2') format('woff2'), url('myfont.woff') format('woff');
}
@namespace svg url(http://www.w3.org/2000/svg);
.foo {
  background-color: red;
}
.foo:hover {
  background-color: blue;
}
.foo::after {
  content: "";
  position: absolute;
}
@media only screen and (min-width: 768px) {
  .foo {
    background-color: green;
  }
  .foo:hover {
    background-color: yellow;
  }
}
@media only screen and (min-width: 1024px) {
  .foo {
    background-color: purple;
  }
  .foo:hover {
    background-color: cyan;
  }
}
`;
const fullParseAndStringify = `@unknown value;
@charset "utf-8";
@font-face {
  font-family: "FontName";
  src: url(../fonts/font-name.woff);
}
@keyframes pulse {
  from {
    background-color: red;
  }
  to {
    background-color: blue;
  }
}
.foo {
  height: 100px;
  animation-name: pulse;
  animation-duration: 2s;
}
@media (min-width: 768px) {
  .foo {
    height: 200px;
  }
}
`;

const replacedOutput = `.foo {
  color: red;
}
.foo:hover {
  color: blue;
}
`;

describe("tree", () => {
  test("stringify", () => {
    const css = stringify({
      meta: {},
      rules: [
        {
          type: "at-rule" as const,
          keyword: "@keyframes",
          values: ["pulse"],
          rules: [
            {
              type: "rule" as const,
              selector: "0%",
              declarations: {
                backgroundColor: "#001f3f",
              },
            },
            {
              type: "rule" as const,
              selector: "100%",
              declarations: {
                backgroundColor: "#ff4136",
              },
            },
          ],
        },
        {
          type: "at-rule" as const,
          keyword: "@font-face",
          declarations: {
            fontFamily: '"CustomFont"',
            src: "url('myfont.woff2') format('woff2'), url('myfont.woff') format('woff')",
          },
        },
        {
          type: "at-rule" as const,
          keyword: "@namespace",
          values: ["svg", "url(http://www.w3.org/2000/svg)"],
        },
        {
          type: "rule" as const,
          selector: ".foo",
          declarations: {
            backgroundColor: "red",
          },
        },
        {
          type: "rule" as const,
          selector: ".foo:hover",
          declarations: {
            backgroundColor: "blue",
          },
        },
        {
          type: "rule" as const,
          selector: ".foo::after",
          declarations: {
            content: '""',
            position: "absolute",
          },
        },
        {
          type: "at-rule" as const,
          keyword: "@media only screen and (min-width: 768px)",
          rules: [
            {
              type: "rule" as const,
              selector: ".foo",
              declarations: {
                backgroundColor: "green",
              },
            },
            {
              type: "rule" as const,
              selector: ".foo:hover",
              declarations: {
                backgroundColor: "yellow",
              },
            },
          ],
        },
        {
          type: "at-rule" as const,
          keyword: "@media only screen and (min-width: 1024px)",
          rules: [
            {
              type: "rule" as const,
              selector: ".foo",
              declarations: {
                backgroundColor: "purple",
              },
            },
            {
              type: "rule" as const,
              selector: ".foo:hover",
              declarations: {
                backgroundColor: "cyan",
              },
            },
          ],
        },
      ],
    });
    expect(css).toBe(fullTreeOutput);
  });

  test("parse & stringify", () => {
    const tree = parse({
      "@unknown": "value",
      "@charset": '"utf-8"',
      "@font-face": {
        fontFamily: '"FontName"',
        src: "url(../fonts/font-name.woff)",
      },
      "@keyframes pulse": {
        from: {
          backgroundColor: "red",
        },
        to: {
          backgroundColor: "blue",
        },
      },
      ".foo": {
        height: "100px",
        animationName: "pulse",
        animationDuration: "2s",
      },
      "@media (min-width: 768px)": {
        ".foo": {
          height: "200px",
        },
      },
    });

    expect(tree).toMatchObject({
      rules: [
        {
          type: "at-rule",
          keyword: "@unknown",
          values: ["value"],
        },
        {
          type: "at-rule",
          keyword: "@charset",
          values: ['"utf-8"'],
        },
        {
          type: "at-rule",
          keyword: "@font-face",
          declarations: {
            fontFamily: '"FontName"',
            src: "url(../fonts/font-name.woff)",
          },
        },
        {
          type: "at-rule",
          keyword: "@keyframes pulse",
          rules: [
            {
              type: "rule",
              selector: "from",
              declarations: {
                backgroundColor: "red",
              },
            },
            {
              type: "rule",
              selector: "to",
              declarations: {
                backgroundColor: "blue",
              },
            },
          ],
        },
        {
          type: "rule",
          selector: ".foo",
          declarations: {
            height: "100px",
            animationName: "pulse",
            animationDuration: "2s",
          },
        },
        {
          type: "at-rule",
          keyword: "@media (min-width: 768px)",
          rules: [
            {
              type: "rule",
              selector: ".foo",
              declarations: {
                height: "200px",
              },
            },
          ],
        },
      ],
      meta: {},
    });

    expect(stringify(tree)).toBe(fullParseAndStringify);
  });

  test("walk", () => {
    const tree = {
      meta: {},
      rules: [
        {
          type: "rule" as const,
          selector: "&",
          declarations: {
            color: "red",
          },
        },
        {
          type: "rule" as const,
          selector: "&:hover",
          declarations: {
            color: "blue",
          },
        },
      ],
    };
    const replaced = walk(tree, (rule) => {
      if (rule.type === "rule" && rule.selector) {
        rule.selector = rule.selector.split("&").join(".foo");
      }
    });
    const css = stringify(replaced);
    expect(css).toBe(replacedOutput);
  });
});
