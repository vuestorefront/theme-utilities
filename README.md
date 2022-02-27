<div align="center">
  <img src="https://user-images.githubusercontent.com/1626923/137092657-fb398d20-b592-4661-a1f9-4135db0b61d5.png" alt="Vue Storefront" height="80px" />
</div>

  ---------

### Stay connected

![GitHub Repo stars](https://img.shields.io/github/stars/vuestorefront/vue-storefront?style=social)
![Twitter Follow](https://img.shields.io/twitter/follow/vuestorefront?style=social)
![YouTube Channel Subscribers](https://img.shields.io/youtube/channel/subscribers/UCkm1F3Cglty3CE1QwKQUhhg?style=social)
[![Discord](https://img.shields.io/discord/770285988244750366?label=join%20discord&logo=Discord&logoColor=white)](https://discord.vuestorefront.io)


# Theme Utilities for Vue Storefront 2 (and not only)

<a href="http://discord.vuestorefront.io/">
<img src="https://discordapp.com/api/guilds/770285988244750366/widget.png?style=shield" alt="Discord Shield"/>
</a>

> **Disclaimer:** This project is still in beta phase.

## How it works
This package creates a `vsf-tu` script allowing to extend multiple [Vue Storefront 2](https://github.com/vuestorefront/vue-storefront) themes by letting them inherit from each other.

You can use it with any JavaScript application though. it does not require Vue or Nuxt to run.

Script reads files from multiple sources and copies them to destination directory. If files with the same path (relative to each source) exist in multiple sources, priority will be given to source defined later in the configuration.

Files with `.vue`, `.ts`, `.js`, and `.json` extensions are additionally parsed using `ejs` library, allowing them to contain build-time variables like `<%= some.source.variable %>`.

## Install

```bash
yarn global add @vue-storefront/theme-utilities
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
