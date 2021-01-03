<p align="center">
  <img src="./image/styn.png">
</p>

<p align="center">
<strong>styn</strong> is a small, zero-dependency, extensible, js object to css generator
</p>

<p align="center">
  <img src="./image/styn-code.png">
</p>

## Table of Contents

- [Usage](#usage)
- [Plugins](#plugins)
- [React](#react)

## Usage

### Basic

```js
import { styn } from "styn";

const { selector, css } = styn({
  backgroundColor: "red",
  "&:hover": {
    backgroundColor: "blue",
  },
});
```

**Outputs to:**

selector: `'.styn4b5pb'` (generated class name)

css:

```css
.styn4b5pb {
  background-color: red;
}
.styn4b5pb:hover {
  background-color: blue;
}
```

### Opt-out auto generated class name

```js
import { styn } from "styn";

const { selector, css } = styn(
  {
    backgroundColor: "red",
    "&:hover": {
      backgroundColor: "blue",
    },
  },
  {
    selector: ".box",
  }
);
```

```css
.box {
  background-color: red;
}
.box:hover {
  background-color: blue;
}
```

## Plugins

styn accepts plugins that interact with the styn tree, here are an example of a plugin that accept a new `truncate` property that converts to three new properties (`white-space`, `overflow` and `text-overflow`)

> Note: "styn tree" is a very, very, very short version of an AST. It may not be the best option if you want to work with a full AST.

```ts
import { styn, StynPlugin } from "styn";

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

const { css } = styn(
  {
    width: "350px",
    padding: "20px",
    truncate: true,
  },
  {
    plugins: [truncate],
  }
);
```

css output

```css
.styn4b5pb {
  width: 350px;
  padding: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### Built-in plugins

styn comes with those built-in plugins

- **breakpoints**

```js
import { breakpoints } from "styn";

const plugins = [
  breakpoints({
    md: "768px",
    lg: "1024px",
  }),
];

const { css } = styn(
  {
    color: "red",
    md: {
      color: "blue",
    },
    lg: {
      color: "yellow",
    },
  },
  { plugins }
);

/* css =>

.styn4b5pb {
  color: red;
}
@media (min-width: 768px) {
  .styn4b5pb {
    color: blue;
  }
}
@media (min-width: 1024px) {
  .styn4b5pb {
    color: yellow;
  }
}
*/
```

- **tokenizer**

```js
import { tokenizer } from "styn";

const plugins = [
  tokenizer({
    colors: {
      primary: "#123456",
    },
  }),
];

const { css } = styn({ color: "colors.primary" }, { plugins });

/* css =>

.styn4b5pb {
  color: #123456;
}
*/
```

- **prefixer** (soon)

## React

soon

## Contribute

You can help improving this project sending PRs and helping with issues.
Also you can ping me at [Twitter](https://twitter.com/renatorib_)
