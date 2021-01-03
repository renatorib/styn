import { styn } from "../styn";
import { tokenizer } from "./tokenizer";

const TOKENIZED = `.foo {
  background-color: #123456;
  border-color: #654321;
}
`;

describe("tokenizer", () => {
  test("simple", () => {
    const plugins = [
      tokenizer({
        primaryColor: "#123456",
        secondaryColor: "#654321",
      }),
    ];

    const { css } = styn(
      {
        backgroundColor: "primaryColor",
        borderColor: "secondaryColor",
      },
      { selector: ".foo", plugins }
    );

    expect(css).toBe(TOKENIZED);
  });

  test("nested", () => {
    const plugins = [
      tokenizer({
        fooColors: {
          primary: "#123456",
        },
        barColors: {
          secondary: "#654321",
        },
      }),
    ];

    const { css } = styn(
      {
        backgroundColor: "fooColors.primary",
        borderColor: "barColors.secondary",
      },
      { selector: ".foo", plugins }
    );

    expect(css).toBe(TOKENIZED);
  });
});
