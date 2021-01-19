![Vue Storefront](https://camo.githubusercontent.com/48c886ac0703e3a46bc0ec963e20f126337229fc/68747470733a2f2f643968687267346d6e767a6f772e636c6f756466726f6e742e6e65742f7777772e76756573746f726566726f6e742e696f2f32383062313964302d6c6f676f2d76735f3062793032633062793032633030303030302e6a7067)

# Theme Utilities for Vue Storefront Next

<a href="https://slack.vuestorefront.io">![Branch Develop](https://img.shields.io/badge/community%20chat-slack-FF1493.svg)</a>

> **Disclaimer:** This project is still in beta phase.

## How it works
This package creates a `vsf-tu` script allowing to extend multiple [Vue Storefront Next](https://github.com/vuestorefront/vue-storefront/tree/next) themes.

Script reads files from multiple sources and copies them to destination directory. If files with the same path (relative to each source) exist in multiple sources, priority will be given to source defined later in the configuration.

Files with `.vue`, `.ts`, `.js`, and `.json` extensions are additionally parsed using `ejs` library, allowing them to contain build-time variables like `<%= some.source.variable %>`.

## Install

```bash
yarn add @vue-storefront/theme-utilities
```

## Usage

Create a `theme-utils.config.js` file in the root of the project.

```javascript
// theme-utils.config.js
module.exports = {
  copy: {
    to: '',
    from: [
      {
        path: '',
        ignore: [],
        variables: {},
        watch: true
      }
    ]
  }
};
```

Run the script:

```bash
vsf-tu
```

Alternatively you can use `--config path/to/config/file` flag to provide custom configuration path.

## Configuration

### Options

- `to` Path to output directory. Can be relative or absolute.
- `from` Array of source directories:
  - `path` Path to source directory. Can be relative or absolute.
  - `ignore` Array of ignored files/paths. Paths are [glob](https://github.com/isaacs/node-glob)-compatible. Contents of `.nuxt` and `node_modules` are ignored by default.
  - `variables` Template variables resolved at build-time.
  - `watch` Whether directory should be watched for changes.

### Example

```javascript
// theme-utils.config.js
module.exports = {
  copy: {
    to: '_theme',
    from: [
      {
        path: '@vue-storefront/nuxt-theme/theme',
        ignore: [],
        variables: {
          options: {
            generate: {
              replace: {
                apiClient: '@vue-storefront/commercetools-api',
                composables: '@vue-storefront/commercetools'
              }
            }
          }
        },
        watch: true
      },
      {
        path: '/home/Projects/VueStorefront/packages/commercetools/theme',
        ignore: [
          '*', // Ignore all files directly in the root of the directory, like package.json, tsconfig.json etc.
        ],
        variables: {},
        watch: true
      }
    ]
  }
};
```
