import { ReduxEvents, ReduxRestApiBuilder, RestApiConfigBuilder } from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { reducerRegistry, setRequestPollingMessage } from '@fpsak-frontend/fp-felles';

export const BehandlingFpsakApiKeys = {
  BEHANDLING: 'BEHANDLING',
  UPDATE_ON_HOLD: 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
  SAVE_OVERSTYRT_AKSJONSPUNKT: 'SAVE_OVERSTYRT_AKSJONSPUNKT',
  PREVIEW_MESSAGE: 'PREVIEW_MESSAGE',
  PREVIEW_TILBAKEKREVING_MESSAGE: 'PREVIEW_TILBAKEKREVING_MESSAGE',
  STONADSKONTOER_GITT_UTTAKSPERIODER: 'STONADSKONTOER_GITT_UTTAKSPERIODER',
  AKSJONSPUNKTER: 'AKSJONSPUNKTER',
  VILKAR: 'VILKAR',
  PERSONOPPLYSNINGER: 'PERSONOPPLYSNINGER',
  SIMULERING_RESULTAT: 'SIMULERING_RESULTAT',
  TILBAKEKREVINGVALG: 'TILBAKEKREVINGVALG',
  BEREGNINGRESULTAT_ENGANGSSTONAD: 'BEREGNINGRESULTAT_ENGANGSSTONAD',
  FAMILIEHENDELSE: 'FAMILIEHENDELSE',
  SOKNAD: 'SOKNAD',
  ORIGINAL_BEHANDLING: 'ORIGINAL_BEHANDLING',
  MEDLEMSKAP: 'MEDLEMSKAP',
  UTTAK_PERIODE_GRENSE: 'UTTAK_PERIODE_GRENSE',
};

const endpoints = new RestApiConfigBuilder()
  /* /api/behandlinger */
  .withAsyncPost('/fpsak/api/behandlinger', BehandlingFpsakApiKeys.BEHANDLING)
  .withPost('/fpsak/api/behandlinger/endre-pa-vent', BehandlingFpsakApiKeys.UPDATE_ON_HOLD)

  /* /api/behandling */
  .withAsyncPost('/fpsak/api/behandling/aksjonspunkt', BehandlingFpsakApiKeys.SAVE_AKSJONSPUNKT)
  .withAsyncPost('/fpsak/api/behandling/aksjonspunkt/overstyr', BehandlingFpsakApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT)
  .withPost('/fpsak/api/behandling/uttak/stonadskontoerGittUttaksperioder', BehandlingFpsakApiKeys.STONADSKONTOER_GITT_UTTAKSPERIODER)

  /* fptilbake/api/dokument */
  .withPostAndOpenBlob('/fptilbake/api/dokument/forhandsvis-varselbrev', BehandlingFpsakApiKeys.PREVIEW_TILBAKEKREVING_MESSAGE)

  /* /api/brev */
  .withPostAndOpenBlob('/fpformidling/api/brev/forhaandsvis', BehandlingFpsakApiKeys.PREVIEW_MESSAGE)

  // TODO (TOR) Desse er ikkje i bruk enno. Må flytta ut prosess- og fakta-komponentar først
  .withInjectedPath('aksjonspunkter', BehandlingFpsakApiKeys.AKSJONSPUNKTER)
  .withInjectedPath('vilkar', BehandlingFpsakApiKeys.VILKAR)
  .withInjectedPath('soeker-personopplysninger', BehandlingFpsakApiKeys.PERSONOPPLYSNINGER)
  .withInjectedPath('simuleringResultat', BehandlingFpsakApiKeys.SIMULERING_RESULTAT)
  .withInjectedPath('tilbakekrevingvalg', BehandlingFpsakApiKeys.TILBAKEKREVINGVALG)
  .withInjectedPath('beregningsresultat-engangsstonad', BehandlingFpsakApiKeys.BEREGNINGRESULTAT_ENGANGSSTONAD)
  .withInjectedPath('familiehendelse-v2', BehandlingFpsakApiKeys.FAMILIEHENDELSE)
  .withInjectedPath('soknad', BehandlingFpsakApiKeys.SOKNAD)
  .withInjectedPath('original-behandling', BehandlingFpsakApiKeys.ORIGINAL_BEHANDLING)
  .withInjectedPath('soeker-medlemskap', BehandlingFpsakApiKeys.MEDLEMSKAP)
  .withInjectedPath('uttak-periode-grense', BehandlingFpsakApiKeys.UTTAK_PERIODE_GRENSE)

  .build();

const reducerName = 'dataContextForstegangOgRevurderingBehandling';

export const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withReduxEvents(new ReduxEvents()
    .withErrorActionCreator(errorHandler.getErrorActionCreator())
    .withPollingMessageActionCreator(setRequestPollingMessage))
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const fpsakBehandlingApi = reduxRestApi.getEndpointApi();
export default fpsakBehandlingApi;
