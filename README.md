<div align="center">
  <img src="https://user-images.githubusercontent.com/1626923/137092657-fb398d20-b592-4661-a1f9-4135db0b61d5.png" alt="Vue Storefront" height="80px" />
</div>

---------

# #TechForUkraine

<table>
  <tr>
    <td style="width:40%;">
       <img src="https://user-images.githubusercontent.com/1626923/155853691-d6d0a541-d3b9-40bf-b8f5-2d38303e9e49.png" />
    </td>
    <td>
      <h2><strong>Ongoing tensions on Ukrainian territory close the space for civil society.</strong></h2>
      <h3>How can you support Ukrainian civil society?</h3>
      All the help is valid, and if you are not able to help locally, by giving shelter to a fellow Ukraine, there are some ways that you can help also:
      <ul>
        <li>
          Support the Ukraine Armed forces directly by sending funding to the open special accounts.<br />
          <a href="https://bank.gov.ua/en/news/all/natsionalniy-bank-vidkriv-spetsrahunok-dlya-zboru-koshtiv-na-potrebi-armiyi" target="_blank">NBU Opens Special Account to Raise Funds for Ukraine’s Armed Forces</a>
        </li>
        <li>
          Help the ICRC (Red Cross) with donations.<br />
          <a href="https://www.icrc.org/en/where-we-work/europe-central-asia/ukraine" target="_blank">Ukrainian Red Cross Society</a>
        </li>
        <li>
          Donate to the United Help Ukraine.<br />
          <a href="https://unitedhelpukraine.org/" target="_blank">United Help Ukraine</a>
        </li>
        <li>
          Donate to Voices of Children<br />
          <a href="https://voices.org.ua/en/" target="_blank">Voices of Children</a>
        </li>
    </td>
  </tr>
</table>

---------


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
