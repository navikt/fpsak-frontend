import { ReduxEvents, ReduxRestApiBuilder, RestApiConfigBuilder } from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { reducerRegistry, setRequestPollingMessage } from '@fpsak-frontend/fp-felles';

export const AnkeBehandlingApiKeys = {
  BEHANDLING_ANKE: 'BEHANDLING_ANKE',
  AKSJONSPUNKTER: 'AKSJONSPUNKTER',
  VILKAR: 'VILKAR',
  ANKE_VURDERING: 'ANKE_VURDERING',
  BEHANDLING_NY_BEHANDLENDE_ENHET: 'BEHANDLING_NY_BEHANDLENDE_ENHET',
  HENLEGG_BEHANDLING: 'HENLEGG_BEHANDLING',
  RESUME_BEHANDLING: 'RESUME_BEHANDLING',
  BEHANDLING_ON_HOLD: 'BEHANDLING_ON_HOLD',
  UPDATE_ON_HOLD: 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
  PREVIEW_MESSAGE: 'PREVIEW_MESSAGE',
  SAVE_ANKE_VURDERING: 'SAVE_ANKE_VURDERING',
  SAVE_REOPEN_ANKE_VURDERING: 'SAVE_REOPEN_ANKE_VURDERING',
};

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/fpsak/api/behandlinger', AnkeBehandlingApiKeys.BEHANDLING_ANKE)

  // behandlingsdata
  .withRel('aksjonspunkter', AnkeBehandlingApiKeys.AKSJONSPUNKTER)
  .withRel('vilkar', AnkeBehandlingApiKeys.VILKAR)
  .withRel('anke-vurdering', AnkeBehandlingApiKeys.ANKE_VURDERING)

  // operasjoner
  .withRel('bytt-behandlende-enhet', AnkeBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withRel('henlegg-behandling', AnkeBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withRel('gjenoppta-behandling', AnkeBehandlingApiKeys.RESUME_BEHANDLING, { saveResponseIn: AnkeBehandlingApiKeys.BEHANDLING_ANKE })
  .withRel('sett-behandling-pa-vent', AnkeBehandlingApiKeys.BEHANDLING_ON_HOLD)
  .withRel('endre-pa-vent', AnkeBehandlingApiKeys.UPDATE_ON_HOLD)
  .withRel('lagre-aksjonspunkter', AnkeBehandlingApiKeys.SAVE_AKSJONSPUNKT, { saveResponseIn: AnkeBehandlingApiKeys.BEHANDLING_ANKE })
  .withRel('mellomlagre-anke', AnkeBehandlingApiKeys.SAVE_ANKE_VURDERING)
  .withRel('mellomlagre-gjennapne-anke', AnkeBehandlingApiKeys.SAVE_REOPEN_ANKE_VURDERING, { saveResponseIn: AnkeBehandlingApiKeys.BEHANDLING_ANKE })

  /* FPFORMIDLING */
  .withPostAndOpenBlob('/fpformidling/api/brev/forhaandsvis', AnkeBehandlingApiKeys.PREVIEW_MESSAGE)

  .build();

const reducerName = 'dataContextAnkeBehandling';

export const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withReduxEvents(new ReduxEvents()
    .withErrorActionCreator(errorHandler.getErrorActionCreator())
    .withPollingMessageActionCreator(setRequestPollingMessage))
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const ankeBehandlingApi = reduxRestApi.getEndpointApi();
export default ankeBehandlingApi;
