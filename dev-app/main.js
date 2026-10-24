import { AureliaConfiguration } from 'aurelia-configuration';
import environment from './environment';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    // loads the deployed environment configuration from config/config.json
    .plugin('aurelia-configuration')
    // load the plugin ../src
    // The "resources" is mapped to "../src" in aurelia.json "paths"
    .feature('resources', () => aurelia.container.get(AureliaConfiguration).get('faceMatching'));

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot());
}
