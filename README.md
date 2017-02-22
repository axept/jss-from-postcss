# jss-from-postcss

> No black boxes anymore.

> Less magic 👉 Less bugs 👉 More profit! 🚀

Use the best bits of [PostCSS](https://github.com/postcss/postcss) and all plugins ([one](https://github.com/postcss/postcss#plugins), [two](http://postcss.parts/), [three?](https://github.com/axept/jss-from-postcss/edit/master/README.md) 😉) to get it as [JSS styles](https://github.com/cssinjs/jss).

Fast, predictable and fully customizable PostCSS to JSS "on-the-fly" adapter.

Supports Server-side Rendering (SSR) and [run-time execution](https://github.com/lttb/babel-plugin-prejss).

## Content

+ [Motivation](#motivation)
+ [Installation](#installation)
+ [Adapters](#adapters)
+ [Inspiration](#inspiration)

## Motivation

This package could help you to migrate from PostCSS to JSS up to 5x time faster. Save your time. 

It means in a few minutes you can migrate to JSS from anything:

+ [SCSS](https://github.com/postcss/postcss-scss)
+ SASS
+ LESS
+ Stylus
+ SugarSS and so on

## Installation

```bash
npm install jss-from-postcss --save
```

## Example

```javascript
import jss from 'jss'
import preset from 'jss-preset-default'
import color from 'color'
import fromPostCSS, { keyframes } from 'jss-from-postcss'

// One time setup with default plugins and settings.
jss.setup(preset())

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

const styles = fromPostCSS`
  button {
    color: ${context => context.defaultColor || 'palevioletred'};
    display: block;
    margin: 0.5em 0;
    font-family: Helvetica, Arial, sans-serif;

    &:hover {
      text-decoration: underline;
      animation: ${rotate360} 2s linear infinite;
    }
  }
  
  ctaButton {
    @include button;
    
    &:hover {
      background: ${color('blue').darken(0.3).hex()}
    }
  }
`

const { classes } = jss.createStyleSheet(styles({
  defaultColor: 'navy',
}).attach()

document.body.innerHTML = `
  <button class="${classes['button']}">Button</button>
  <button class="${classes['ctaButton']}">CTA Button</button>
`
```

## Adapters

PostCSS is using under hood for pre-processing your styles to plain CSS and then parse plain CSS to make it applicable for JSS.

But you can create any custom CSS adapter to override `prepare` and/or `parse` functions:

+ `prepare(styles: string): string` is using for converting your styles code to plain CSS
+ `parse(CSS: string): object` is using for converting plain CSS to JSS

Feel free to play with it:

```javascript
import fromPostCSS, { createAdapter, keyframes } from 'jss-from-postcss'

const fromMixedCSS = createAdapter({
  prepare: (styles) => {
    const prepared = styles.replace(/^\s*\/\/.*$/gm, '') // remove JS comments
    return fromPostCSS(prepared)
  }
})

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

const styles = fromMixedCSS`
  button {
    color: ${context => context.defaultColor || 'palevioletred'};
    display: block;
    margin: 0.5em 0;
    font-family: Helvetica, Arial, sans-serif;
    
    // Let it snow!
    &:hover {
      text-decoration: underline;
      animation: ${rotate360} 2s linear infinite;
    }
  }
  
  ctaButton {
    @include button;
    
    &:hover {
      background: ${color('blue').darken(0.3).hex()}
    }
  }
`
```

## Inspiration

+ https://github.com/styled-components/styled-components
