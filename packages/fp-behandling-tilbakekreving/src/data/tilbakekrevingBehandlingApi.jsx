import {
  RestApiConfigBuilder, ReduxRestApiBuilder, ReduxEvents,
} from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { reducerRegistry, setRequestPollingMessage } from '@fpsak-frontend/fp-felles';

export const TilbakekrevingBehandlingApiKeys = {
  BEHANDLING: 'BEHANDLING',
  ORIGINAL_BEHANDLING: 'ORIGINAL_BEHANDLING',
  UPDATE_ON_HOLD: 'UPDATE_ON_HOLD',
  BEHANDLING_ON_HOLD: 'BEHANDLING_ON_HOLD',
  RESUME_BEHANDLING: 'RESUME_BEHANDLING',
  NY_BEHANDLENDE_ENHET: 'NY_BEHANDLENDE_ENHET',
  HENLEGG_BEHANDLING: 'HENLEGG_BEHANDLING',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
  SAVE_OVERSTYRT_AKSJONSPUNKT: 'SAVE_OVERSTYRT_AKSJONSPUNKT',
  PREVIEW_MESSAGE: 'PREVIEW_MESSAGE',
  SUBMIT_MESSAGE: 'SUBMIT_MESSAGE',
  PREVIEW_MESSAGE_KLAGE: 'PREVIEW_MESSAGE_KLAGE',
};

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/api/behandlinger', TilbakekrevingBehandlingApiKeys.BEHANDLING)
  .withAsyncPost('/api/behandlinger', TilbakekrevingBehandlingApiKeys.ORIGINAL_BEHANDLING)
  .withPost('/api/behandlinger/endre-pa-vent', TilbakekrevingBehandlingApiKeys.UPDATE_ON_HOLD)
  .withPost('/api/behandlinger/sett-pa-vent', TilbakekrevingBehandlingApiKeys.BEHANDLING_ON_HOLD)
  .withAsyncPost('/api/behandlinger/gjenoppta', TilbakekrevingBehandlingApiKeys.RESUME_BEHANDLING)
  .withPost('/api/behandlinger/bytt-enhet', TilbakekrevingBehandlingApiKeys.NY_BEHANDLENDE_ENHET)
  .withPost('/api/behandlinger/henlegg', TilbakekrevingBehandlingApiKeys.HENLEGG_BEHANDLING)

  /* /api/behandling */
  .withAsyncPost('/api/behandling/aksjonspunkt', TilbakekrevingBehandlingApiKeys.SAVE_AKSJONSPUNKT)
  .withAsyncPost('/api/behandling/aksjonspunkt/overstyr', TilbakekrevingBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT)

/* /api/brev */
  .withPostAndOpenBlob('/api/brev/forhandsvis', TilbakekrevingBehandlingApiKeys.PREVIEW_MESSAGE)
  .withPost('/api/brev/bestill', TilbakekrevingBehandlingApiKeys.SUBMIT_MESSAGE)
  .withPostAndOpenBlob('/api/brev/forhandsvis-klage', TilbakekrevingBehandlingApiKeys.PREVIEW_MESSAGE_KLAGE)

  .build();

const reducerName = 'dataContextTilbakekrevingBehandling';

const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withContextPath('fptilbake')
  .withReduxEvents(new ReduxEvents()
    .withErrorActionCreator(errorHandler.getErrorActionCreator())
    .withPollingMessageActionCreator(setRequestPollingMessage))
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const tilbakekrevingBehandlingApi = reduxRestApi.getEndpointApi();
export default tilbakekrevingBehandlingApi;
