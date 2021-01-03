import { element } from "../../src/element";
import { tokenizer } from "../../src/plugins/tokenizer";

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

    const { styles } = element(
      {
        backgroundColor: "primaryColor",
        borderColor: "secondaryColor",
      },
      { className: "foo", plugins }
    );

    expect(styles).toBe(TOKENIZED);
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

    const { styles } = element(
      {
        backgroundColor: "fooColors.primary",
        borderColor: "barColors.secondary",
      },
      { className: "foo", plugins }
    );

    expect(styles).toBe(TOKENIZED);
  });
});
