/**
 * Defines the Aurelia plugin entry point.
 * @module
 * @category public
 */

import { PLATFORM } from 'aurelia-pal';
import { FaceMatchingConfiguration } from './core/face-matching-configuration';
export { FaceMatchingConfiguration } from './core/face-matching-configuration';

/** @typedef {import('aurelia-framework').FrameworkConfiguration} FrameworkConfiguration */
/** @typedef {import('types').FaceMatchingPluginOptions} FaceMatchingPluginOptions */

/**
 * Configures the plugin.
 * @param {FrameworkConfiguration} aurelia aurelia framework
 * @param {() => FaceMatchingPluginOptions} getOptions callback providing the plugin options
 * @throws {Error} when the service base url is not provided
 */
function configure(aurelia, getOptions) {
  // aurelia provides an empty object when the plugin is registered without callback
  const options = typeof getOptions === 'function' ? getOptions() : undefined;
  aurelia.container.get(FaceMatchingConfiguration).configure(options);
  aurelia.globalResources([PLATFORM.moduleName('./elements/face-matching/face-matching')]);
}

export { configure };
