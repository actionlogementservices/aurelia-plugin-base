/**
 * Defines common functions.
 * @module
 * @category internal
 */

/** Pending or settled loadings of external scripts, by url. @type {Map<string, Promise<void>>} */
const scriptLoadings = new Map();

/**
 * Generates an unique identifier string of the form 'm5y6ckpexb01gvv02s'.
 * @returns {string} unique identifier
 */
export const generateUniqueId = () => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).slice(2);
  return timestamp + randomPart;
};

/**
 * Inserts the specified script in the document head, only once per url.
 * A failed loading is forgotten so that it can be retried.
 * @param {string} url script url
 * @returns {Promise<void>} resolved when the script is loaded
 */
export const loadScript = url => {
  if (!scriptLoadings.has(url)) {
    const loading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.addEventListener('load', () => resolve());
      script.addEventListener('error', () => {
        scriptLoadings.delete(url);
        script.remove();
        reject(new Error(`Unable to load script ${url}`));
      });
      document.head.append(script);
    });
    scriptLoadings.set(url, loading);
  }
  return scriptLoadings.get(url);
};
