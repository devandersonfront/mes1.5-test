# react-resizeable

Check out the [demo](https://codesandbox.io/s/react-resizeable-examples-vsdcj?file=/src/app.js).

A react library that allows you to place custom resizeable grid components throughout your codebase.

`react-resizeable` exports two components, `Resizeable`, the parent container and, `Child`, the wrapper for any children. See [demo](https://codesandbox.io/s/react-resizeable-examples-vsdcj?file=/src/app.js) for examples.

## Features

⏳ Saves you time by handling all the annoying event listeners for you.

⭐️ Flexibility to use proper semantic HTML (both components accept an `as` prop!)

🐑 Simplicity -- no need to pass multiple breakpoints, if each child has a `minWidth` we'll handle the wrap for you!

## Requirement

To use `react-resizeable`, you must use `styled-component > 4.1` as it is a peer dependency.

## Installation

```sh
$ yarn add react-resizeable
// or
$ npm i react-resizeable
```

## Example

**_NOTE:_** most arguments are provided defaults (see [Full API](#full-api) below) with the only required one being `width` on the `<Child>` component, however it is strongly recommended to include `minWidth` as well. (see [demo](https://codesandbox.io/s/react-resizeable-examples-vsdcj?file=/src/app.js) for additional examples).

```js
import React from 'react';
import { Resizeable, Child } from 'react-resizeable';

const SomeComponent = () => (
    <Resizeable height="100vh" as="main">
      <Child resize={{
        width: '50%',
        minWidth: '300px'
        resizeable: true,
        resizeDir: 'both'
      }}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </p>
      </Child>
      <Child resize={{
        as: 'article',
        width: '50%',
        minWidth: '300px',
        height: '450px',
        minHeight: '350px'
      }}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </p>
      </Child>
    </Resizeable>
)

export default SomeComponent;
```

## [Full API](#full-api)

### `<Parent />`

### Props:

```js
interface ResizeableProps {
  flexDirection?: 'row' | 'column';
  height?: string;
  as?: keyof JSX.IntrinsicElements;
}
```

**Defaults**:

```js
 {
   flexDirection: 'row',
   height: '100%',
   as: 'div',
 }
```

### `<Child />`

**_Note:_**

- `<Child />` includes a `forwardRef` wrapper, so feel free to pass it a `ref` if need be.
- all additional props passed to child are forwarded to the styled component so you **_could_** pass a style prop to override things if you were so inclined.

### Props:

```js
interface ChildProps {
  resize: {
    width: string;
    resizeDir?: 'none' | 'both' | 'horizontal' | 'vertical' | 'initial' | 'inherit';
    resizeable?: boolean;
    minWidth?: string;
    height?: string;
    minHeight?: string;
    as?: keyof JSX.IntrinsicElements;
  };
}
```

**Defaults**:

```js
  resize: {
    width: 'n/a',
    resizeable: false,
    resizeDir: 'n/a',
    as: 'div',
    minWidth: 'min-content',
    height: '100%',
    minHeight: '100%',
  }
```

## License

**[MIT](LICENSE)** Licensed

## Contributors

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
