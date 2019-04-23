import { ActionTypes } from './ActionTypesTsType';

/**
   * createRequestActionType
   * Hjelpefunksjon for å generere actionType for actions relatert til AJAX-kall
   *
   * Eks: createRequestActionType('fetchBehandlinger', 'ERROR', get, '/fpsak/api/behandlinger') -> '@@REST/fetchBehandlinger GET /fpsak/api/behandlinger ERROR'
   */
const createRequestActionType = (name, qualifier, restMethod = '', path = '') => [`@@REST/${name}`, restMethod, path, qualifier]
  .filter(s => s !== '')
  .join(' ');

const getCopyDataActionTypes = name => ({
  copyDataStarted: createRequestActionType(name, 'COPY_DATA_STARTED'),
  copyDataFinished: createRequestActionType(name, 'COPY_DATA_FINISHED'),
});

const getDefaultActionTypes = (name, restMethod, path) => ({
  ...getCopyDataActionTypes(name),
  requestStarted: createRequestActionType(name, 'STARTED', restMethod, path),
  requestFinished: createRequestActionType(name, 'FINISHED', restMethod, path),
  requestError: createRequestActionType(name, 'ERROR', restMethod, path),
  reset: createRequestActionType(name, 'RESET'),
});

const getAsyncActionTypes = (name, restMethod, path) => ({
  updatePollingMessage: createRequestActionType(name, 'POLLING_MESSAGE_RECEIVED', restMethod, path),
  statusRequestStarted: createRequestActionType(name, 'STATUS_STARTED', restMethod, path),
  statusRequestFinished: createRequestActionType(name, 'STATUS_FINISHED', restMethod, path),
  pollingTimeout: createRequestActionType(name, 'POLLING_TIMEOUT', restMethod, path),
});

/**
   * createRequestActionTypes
   * Hjelpefunksjon for å generere actionTypes for en gitt AJAX-metode og ressurs.
   *
   * Eks. createRequestActionType(fetchBehandlinger, get, '/fpsak/api/behandlinger') -> {
   *   reset: '@@REST GET /fpsak/api/behandlinger RESET',
   *   requestStarted: '@@REST GET /fpsak/api/behandlinger STARTED',
   *   requestError: '@@REST GET /fpsak/api/behandlinger ERROR',
   *   requestFinished: '@@REST GET /fpsak/api/behandlinger FINISHED',
   * }
   */
const createRequestActionTypes = (isAsync: boolean, name: string, restMethod: string, path: string): ActionTypes => (isAsync
  ? { ...getDefaultActionTypes(name, restMethod, path), ...getAsyncActionTypes(name, restMethod, path) }
  : getDefaultActionTypes(name, restMethod, path));

export default createRequestActionTypes;
