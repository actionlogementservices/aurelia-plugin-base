declare type Mandatory<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>;

/**
 * Plugin options, returned by the callback provided with
 * `aurelia.use.plugin('@actionlogementservices/aurelia-plugin-fm', () => options)`.
 */
export type FaceMatchingPluginOptions = {
  /** Face matching service provider base url (mandatory). */
  serviceBaseUrl: string;
};

export type FaceMatchingPage = 'identity' | 'signature' | 'attachments';

export type FaceMatchingDocumentCategory =
  | 'ID_DOCUMENT'
  | 'BANKING_DOCUMENT'
  | 'ADDRESS_DOCUMENT'
  | 'INCOME_DOCUMENT'
  | 'UNDEFINED';

/**
 * Face matching options (see the service provider integration documentation).
 */
export type FaceMatchingOptions = {
  /** rendering mode (default `pretty`) */ renderMode?: 'pretty' | 'tiny';
  /** delegate's token */ delegateeToken?: string;
  /** comma separated list of displayed pages */ displayedPages?: string;
  /** comma separated list of document categories */ documentCategories?: string;
  /** user interface language */ lang?: 'fr' | 'en' | 'it' | 'es' | 'de' | 'ro' | 'hr' | 'pt' | 'nl';
  /** return link used at the end of some paths */ callbackURL?: string;
  /** video identification launch behaviour */ vidRequestMode?: 'popup' | 'redirect';
  /** bank account flow launch behaviour */ bankAccountMode?: 'popup' | 'redirect';
  /** reloads the iframe after the client file is unblocked */ autoReload?: 'true' | 'false' | boolean;
};

/** Detail of the `user-event` event. */
export type FaceMatchingUserEvent = {
  type: 'userEvent';
  action: string;
  context: { userIndex?: number; page?: string; [key: string]: any };
};

/** Detail of the `client-file-event` event. */
export type FaceMatchingClientFileEvent = {
  type: 'clientFileEvent';
  state: string;
  participantState: 'PENDING' | 'WAITING' | 'DONE';
  changedState?: { from: string; to: string };
  context: { [key: string]: any };
};

/** Detail of the `error-event` event. */
export type FaceMatchingErrorEvent = {
  type: 'errorEvent';
  cause:
    | 'BROWSER_NOT_SUPPORTED'
    | 'INVALID_URL'
    | 'INVALID_STATE'
    | 'BAD_REQUEST'
    | 'SERVER_ERROR'
    | 'SERVER_MAINTENANCE'
    | 'UNKNOWN'
    | string;
};

/** Detail of the `display-event` event. */
export type FaceMatchingDisplayEvent = {
  type: 'displayEvent';
  cause: 'heightChanged' | 'pageChanged' | 'modalPosition';
  height?: number;
  offsetTop?: number;
  [key: string]: any;
};
