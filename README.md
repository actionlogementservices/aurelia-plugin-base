[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm package](https://img.shields.io/npm/v/%40actionlogementservices%2Faurelia-plugin-fm)](https://www.npmjs.com/package/@actionlogementservices/aurelia-plugin-fm)

# `@actionlogementservices/aurelia-plugin-fm`

An Aurelia plugin that provides a **face matching** custom element for **aurelia v1** applications.

## Description

This plugin provides the `face-matching` custom element that embeds the face matching iframe of the service provider:

- it loads the service provider script,
- it creates the iframe for the participant token,
- it dispatches the iframe messages as DOM events.

The look and texts of the iframe are customized on the service provider side.

## Installation

1. **Install** the plugin:

   ```node
   npm install @actionlogementservices/aurelia-plugin-fm
   ```

1. **Register** the plugin in aurelia with a callback returning the plugin options.
   The options are read from the deployed environment configuration with [aurelia-configuration](https://github.com/Vheissu/aurelia-configuration):

   ```javascript
   // in your main.js or main.ts
   import { AureliaConfiguration } from 'aurelia-configuration';

   export function configure(aurelia) {
     aurelia.use
       .standardConfiguration()
       .plugin(PLATFORM.moduleName('aurelia-configuration'))
       .plugin(PLATFORM.moduleName('@actionlogementservices/aurelia-plugin-fm'), () =>
         aurelia.container.get(AureliaConfiguration).get('faceMatching')
       );
   ```

   with the deployed `config/config.json`:

   ```json
   {
     "faceMatching": {
       "serviceBaseUrl": "<service provider base url>"
     }
   }
   ```

   | Option           | Description |
   | ---------------- | ----------- |
   | `serviceBaseUrl` | **mandatory** base url of the face matching service provider. The plugin throws when it is not provided. |

## Usage

### `face-matching` custom element

Use the `face-matching` custom element with the participant token:

```html
<face-matching
  token.bind="token"
  options.bind="{ lang: 'fr' }"
  client-file-event.delegate="onClientFileEvent($event.detail)"
  error-event.delegate="onError($event.detail)"></face-matching>
```

| Bindable  | Description |
| --------- | ----------- |
| `token`   | participant access token (`tokenFM` of the `FaceMatchingPP` response of the api-eer `POST /demande` route). The iframe is (re)created whenever it changes. |
| `options` | face matching options (`renderMode` defaults to `pretty`, `lang`, `displayedPages`, `callbackURL`, `vidRequestMode`...). See `FaceMatchingOptions` in `types.d.ts`. |

Each message of the iframe is dispatched as a bubbling DOM event whose `detail` is the message:

| Event               | Description |
| ------------------- | ----------- |
| `user-event`        | user action (`FaceMatchingUserEvent`) |
| `client-file-event` | client file or participant state change (`FaceMatchingClientFileEvent`) |
| `error-event`       | error (`FaceMatchingErrorEvent`), also dispatched with the cause `SCRIPT_LOADING_ERROR` when the service provider script cannot be loaded |
| `display-event`     | display change (`FaceMatchingDisplayEvent`): the iframe height is adjusted automatically by the service provider script |
| `exit-event`        | the participant chose to come back later |

## Compatibility

This plugin has been tested on aurelia v1 with **webpack**.
The application provides the plugin options, typically with `aurelia-configuration 2.0.0`.

## Development

The plugin is bootstrapped by [aurelia-cli](https://github.com/aurelia/cli):

- the `src/` folder contains the source code of the plugin,
- the `dev-app/` folder contains the code of the dev app used to test the plugin. Its configuration is read from `config/config.json`.

| Command                 | Description |
| ----------------------- | ----------- |
| `npm start`             | runs the dev app on `http://localhost:9000` |
| `npm test`              | lints and runs the unit tests |
| `npm run lint`          | fixes the lint and formatting issues |
| `npm run build`         | builds the plugin in `dist/` |
| `npm run publish:local` | publishes the plugin locally with [yalc](https://github.com/wclr/yalc) to test it in an application |

Always use the `PLATFORM.moduleName()` wrapper in the files of `src/` so that the plugin can be consumed by webpack applications.

## Release

The package is published on npm by the `Release` GitHub workflow, with npm trusted publishing (no npm token is stored in GitHub):

1. In your pull request, bump the version with `npm run bump` (updates `package.json` and `package-lock.json` only).
1. When the pull request is merged on `main`, the workflow runs the tests and **stages** the new version on npm.
   Prerelease versions (e.g. `1.1.0-0`) are staged with the `next` dist-tag.
1. The workflow creates a draft GitHub release and an issue assigned to the person who merged, as a reminder to:
   - approve the staged version in the **Staged Packages** tab of the [npm package](https://www.npmjs.com/package/@actionlogementservices/aurelia-plugin-fm) (2FA required),
   - publish the draft GitHub release, which creates the git tag,
   - close the issue.

If the staged version is rejected, delete the draft release and close the issue.
