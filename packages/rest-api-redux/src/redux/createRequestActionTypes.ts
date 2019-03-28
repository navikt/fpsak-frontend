import { RequestRunner } from '@fpsak-frontend/rest-api';
import { ActionTypes } from './ActionTypesTsType';

/**
   * createActionType og createActionTypeWithoutPath
   * Hjelpefunksjon for å generere actionType for actions relatert til AJAX-kall
   *
   * Eks: createRequestActionType('fetchBehandlinger', 'ERROR', get, '/fpsak/api/behandlinger') -> '@@REST/fetchBehandlinger GET /fpsak/api/behandlinger ERROR'
   */
const createActionType = (name, qualifier, restMethod = '', path = '') => `@@REST/${name} ${restMethod} ${path} ${qualifier}`;
const createActionTypeWithoutPath = (name, qualifier) => `@@REST/${name} ${qualifier}`;

const getName = requestRunner => requestRunner.getName();
const getRestMethod = requestRunner => requestRunner.getRestMethodName();
const getPath = requestRunner => requestRunner.getPath();

const getActionTypes = (requestRunner: RequestRunner) => ({
  requestStarted: () => createActionType(getName(requestRunner), 'STARTED', getRestMethod(requestRunner), getPath(requestRunner)),
  requestFinished: () => createActionType(getName(requestRunner), 'FINISHED', getRestMethod(requestRunner), getPath(requestRunner)),
  requestError: () => createActionType(getName(requestRunner), 'ERROR', getRestMethod(requestRunner), getPath(requestRunner)),
  reset: () => createActionTypeWithoutPath(getName(requestRunner), 'RESET'),
  updatePollingMessage: () => createActionType(getName(requestRunner), 'POLLING_MESSAGE_RECEIVED', getRestMethod(requestRunner), getPath(requestRunner)),
  statusRequestStarted: () => createActionType(getName(requestRunner), 'STATUS_STARTED', getRestMethod(requestRunner), getPath(requestRunner)),
  statusRequestFinished: () => createActionType(getName(requestRunner), 'STATUS_FINISHED', getRestMethod(requestRunner), getPath(requestRunner)),
  pollingTimeout: () => createActionType(getName(requestRunner), 'POLLING_TIMEOUT', getRestMethod(requestRunner), getPath(requestRunner)),
  copyDataStarted: () => createActionTypeWithoutPath(getName(requestRunner), 'COPY_DATA_STARTED'),
  copyDataFinished: () => createActionTypeWithoutPath(getName(requestRunner), 'COPY_DATA_FINISHED'),
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
const createRequestActionTypes = (requestRunner: RequestRunner): ActionTypes => getActionTypes(requestRunner);
export default createRequestActionTypes;
