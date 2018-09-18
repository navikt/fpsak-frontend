import {
  get, getBlob, post, postBlob, postAndOpenBlob, getAsync, postAsync, put, putAsync, isAsyncRestMethod,
} from 'data/rest/restMethods';

/**
   * getMethodName
   * Hjelpefunksjon som mapper gitt AJAX-metode til et navn
   *
   * Eks. getMethodName(getBlob) -> 'GET'
   */
const getMethodName = (restMethod) => {
  switch (restMethod) {
    case get:
    case getBlob:
    case getAsync:
      return 'GET';
    case post:
    case postBlob:
    case postAndOpenBlob:
    case postAsync:
      return 'POST';
    case put:
    case putAsync:
      return 'PUT';
    default:
      return '';
  }
};

/**
   * createRequestActionType
   * Hjelpefunksjon for å generere actionType for actions relatert til AJAX-kall
   *
   * Eks: createRequestActionType('fetchBehandlinger', 'ERROR', get, '/fpsak/api/behandlinger') -> '@@REST/fetchBehandlinger GET /fpsak/api/behandlinger ERROR'
   */
const createRequestActionType = (name, qualifier, restMethod = '', path = '') => [`@@REST/${name}`, getMethodName(restMethod), path, qualifier]
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
const createRequestActionTypes = (name, restMethod, path) => (isAsyncRestMethod(restMethod)
  ? { ...getDefaultActionTypes(name, restMethod, path), ...getAsyncActionTypes(name, restMethod, path) }
  : getDefaultActionTypes(name, restMethod, path));

export default createRequestActionTypes;
