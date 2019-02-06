export { default as reducerRegistry } from './src/ReducerRegistry';
export { default as PersonIndex } from './src/person/PersonIndex';
export { default as requireProps } from './src/requireProps';
export { default as trackRouteParam } from './src/trackRouteParam';
export { default as featureToggle } from './src/featureToggle';
export { ErrorTypes, errorOfType, getErrorResponseData } from './src/ErrorTypes';
export {
  getPathToFplos,
  getLocationWithDefaultBehandlingspunktAndFakta,
  DEFAULT_FAKTA,
  DEFAULT_BEHANDLINGSPROSESS,
  getFaktaLocation,
  getBehandlingspunktLocation,
  getSupportPanelLocationCreator,
  getLocationWithQueryParams,
  fagsakPath,
  aktoerPath,
  behandlingerPath,
  behandlingPath,
  pathToFagsak,
  pathToBehandlinger,
  pathToBehandling,
  pathToMissingPage,
} from './src/paths';

export {
  RETTSKILDE_URL,
  LINK_TIL_REGNEARK,
  LINK_TIL_BESTE_BEREGNING_REGNEARK,
  SYSTEMRUTINE_URL,
} from './src/eksterneLenker';

export {
  setRequestPollingMessage,
  getRequestPollingMessage,
} from './src/pollingMessageDuck';
