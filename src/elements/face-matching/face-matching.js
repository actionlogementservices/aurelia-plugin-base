import { DOM, inject, bindable, bindingMode, TaskQueue } from 'aurelia-framework';
import { FaceMatchingConfiguration } from '../../core/face-matching-configuration';
import { generateUniqueId, loadScript } from '../../core/functions';

/** @typedef {import('types').FaceMatchingOptions} FaceMatchingOptions */

/** Options applied when not overridden by the `options` bindable. @type {FaceMatchingOptions} */
const defaultOptions = { renderMode: 'pretty' };

/**
 * Implements the **`face-matching` custom element** that embeds the face matching iframe of the service provider.
 *
 * It loads the service provider script, creates the iframe for the participant `token` and dispatches
 * the iframe messages as bubbling DOM events (the message is the event `detail`):
 * - `user-event` (`FaceMatchingUserEvent`)
 * - `client-file-event` (`FaceMatchingClientFileEvent`)
 * - `error-event` (`FaceMatchingErrorEvent`, also dispatched when the script cannot be loaded)
 * - `display-event` (`FaceMatchingDisplayEvent`, the iframe height is adjusted by the service provider script)
 * - `exit-event` (the participant chose to come back later)
 * @example
 * <face-matching token.bind="token" options.bind="{ lang: 'fr' }"
 *   client-file-event.delegate="onClientFileEvent($event.detail)"
 *   error-event.delegate="onError($event.detail)"></face-matching>
 * @category element
 */
@inject(DOM.Element, TaskQueue, FaceMatchingConfiguration)
export class FaceMatchingCustomElement {
  /** Participant access token provided by the Face Matching request. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  token;

  /** Face matching options. @type {FaceMatchingOptions} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  options;

  /** Unique id of the iframe, required by the service provider script. @type {string} */ iframeId = `fm-${generateUniqueId()}`;
  /** Html container of the custom element. @type {Element} */ _container;
  /** Aurelia asynchronous task queue. @type {TaskQueue} */ _taskqueue;
  /** Plugin configuration. @type {FaceMatchingConfiguration} */ _configuration;
  /** Service provider script instance. @type {any} */ _faceMatching;
  /** Is the custom element in the DOM? @type {boolean} */ _attached = false;

  /**
   * Creates an instance of the `face-matching` custom element.
   * @param {Element} element html element
   * @param {TaskQueue} taskqueue aurelia asynchronous task queue
   * @param {FaceMatchingConfiguration} configuration plugin configuration
   */
  constructor(element, taskqueue, configuration) {
    this._container = element;
    this._taskqueue = taskqueue;
    this._configuration = configuration;
  }

  /**
   * Defines the logic triggered when the custom element is added to the DOM.
   */
  attached() {
    this._attached = true;
    this._refresh();
  }

  /**
   * Defines the logic triggered when the custom element is removed from the DOM.
   */
  detached() {
    this._attached = false;
    this._destroyFaceMatching();
  }

  /**
   * Recreates the iframe when the token changes.
   */
  tokenChanged() {
    if (this._attached) this._refresh();
  }

  /**
   * Recreates the iframe when the options change.
   */
  optionsChanged() {
    if (this._attached) this._refresh();
  }

  /**
   * (Re)creates the iframe for the current token, after loading the service provider script if needed.
   */
  async _refresh() {
    this._destroyFaceMatching();
    if (!this.token) return;
    try {
      // the script may already be included by the application
      if (!globalThis.NthSignbook) await loadScript(this._configuration.scriptUrl);
    } catch {
      this._dispatch('error-event', { type: 'errorEvent', cause: 'SCRIPT_LOADING_ERROR' });
      return;
    }
    // the element may have been detached, or a newer refresh may have run while loading
    if (!this._attached || !this.token || this._faceMatching) return;
    this._faceMatching = new globalThis.NthSignbook({
      iframeSelectorId: this.iframeId,
      url: this._configuration.pageUrl,
      // the service provider script puts the token as is in the iframe url
      token: this.token.trim(),
      options: { ...defaultOptions, ...this.options },
      onUserEventMessage: event => this._dispatch('user-event', event),
      onClientFileEventMessage: event => this._dispatch('client-file-event', event),
      onErrorEventMessage: event => this._dispatch('error-event', event),
      onDisplayEventMessage: event => this._dispatch('display-event', event),
      onExitEventMessage: event => this._dispatch('exit-event', event)
    });
  }

  /**
   * Stops listening to the iframe messages.
   */
  _destroyFaceMatching() {
    this._faceMatching?.destroy();
    this._faceMatching = undefined;
  }

  /**
   * Dispatches a bubbling custom event from the custom element.
   * @param {string} name event name
   * @param {any} detail event detail
   */
  _dispatch(name, detail) {
    const eventToSend = DOM.createCustomEvent(name, { bubbles: true, detail });
    this._taskqueue.queueMicroTask(() => this._container.dispatchEvent(eventToSend));
  }
}
