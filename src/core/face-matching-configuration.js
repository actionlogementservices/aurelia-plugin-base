/** @typedef {import('types').FaceMatchingPluginOptions} FaceMatchingPluginOptions */

/**
 * Holds the plugin configuration (face matching service provider).
 * Registered as a singleton when the plugin is configured.
 * @category public
 */
export class FaceMatchingConfiguration {
  /** Face matching service provider base url. @type {string} */
  serviceBaseUrl;

  /**
   * Applies the plugin options.
   * @param {Partial<FaceMatchingPluginOptions>} [options] plugin options
   * @throws {Error} when the service base url is not provided
   */
  configure(options = {}) {
    if (!options.serviceBaseUrl) {
      throw new Error('aurelia-plugin-fm: the "serviceBaseUrl" plugin option is required.');
    }
    this.serviceBaseUrl = options.serviceBaseUrl.replace(/\/+$/, '');
  }

  /**
   * Url of the service provider script.
   * @returns {string} script url
   */
  get scriptUrl() {
    return `${this.serviceBaseUrl}/contract/signbook/v3/script/signbook.js`;
  }

  /**
   * Url of the page displayed in the iframe.
   * @returns {string} page url
   */
  get pageUrl() {
    return `${this.serviceBaseUrl}/contract/signbook/signbook.html`;
  }
}
