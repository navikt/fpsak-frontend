import { ReduxEvents, ReduxRestApiBuilder, RestApiConfigBuilder } from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { reducerRegistry, setRequestPollingMessage } from '@fpsak-frontend/fp-felles';

export const EsBehandlingApiKeys = {
  BEHANDLING_ES: 'BEHANDLING_ES',
  UPDATE_ON_HOLD: 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
  SAVE_OVERSTYRT_AKSJONSPUNKT: 'SAVE_OVERSTYRT_AKSJONSPUNKT',
  PREVIEW_MESSAGE: 'PREVIEW_MESSAGE',
  PREVIEW_TILBAKEKREVING_MESSAGE: 'PREVIEW_TILBAKEKREVING_MESSAGE',
  AKSJONSPUNKTER: 'AKSJONSPUNKTER',
  VILKAR: 'VILKAR',
  PERSONOPPLYSNINGER: 'PERSONOPPLYSNINGER',
  SIMULERING_RESULTAT: 'SIMULERING_RESULTAT',
  TILBAKEKREVINGVALG: 'TILBAKEKREVINGVALG',
  BEREGNINGRESULTAT_ENGANGSSTONAD: 'BEREGNINGRESULTAT_ENGANGSSTONAD',
  FAMILIEHENDELSE: 'FAMILIEHENDELSE',
  SOKNAD: 'SOKNAD',
  SOKNAD_ORIGINAL_BEHANDLING: 'SOKNAD_ORIGINAL_BEHANDLING',
  FAMILIEHENDELSE_ORIGINAL_BEHANDLING: 'FAMILIEHENDELSE_ORIGINAL_BEHANDLING',
  BEREGNINGSRESULTAT_ORIGINAL_BEHANDLING: 'BEREGNINGSRESULTAT_ORIGINAL_BEHANDLING',
  MEDLEMSKAP: 'MEDLEMSKAP',
  MEDLEMSKAP_V2: 'MEDLEMSKAP_V2',
  INNTEKT_ARBEID_YTELSE: 'INNTEKT_ARBEID_YTELSE',
  VERGE: 'VERGE',
  SEND_VARSEL_OM_REVURDERING: 'SEND_VARSEL_OM_REVURDERING',
  BEHANDLING_NY_BEHANDLENDE_ENHET: 'BEHANDLING_NY_BEHANDLENDE_ENHET',
  HENLEGG_BEHANDLING: 'HENLEGG_BEHANDLING',
  RESUME_BEHANDLING: 'RESUME_BEHANDLING',
  BEHANDLING_ON_HOLD: 'BEHANDLING_ON_HOLD',
  OPEN_BEHANDLING_FOR_CHANGES: 'OPEN_BEHANDLING_FOR_CHANGES',
  VERGE_OPPRETT: 'VERGE_OPPRETT',
  VERGE_FJERN: 'VERGE_FJERN',
};

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/fpsak/api/behandlinger', EsBehandlingApiKeys.BEHANDLING_ES)

  // behandlingsdata
  .withRel('aksjonspunkter', EsBehandlingApiKeys.AKSJONSPUNKTER)
  .withRel('vilkar', EsBehandlingApiKeys.VILKAR)
  .withRel('soeker-personopplysninger', EsBehandlingApiKeys.PERSONOPPLYSNINGER)
  .withRel('simuleringResultat', EsBehandlingApiKeys.SIMULERING_RESULTAT)
  .withRel('tilbakekrevingvalg', EsBehandlingApiKeys.TILBAKEKREVINGVALG)
  .withRel('beregningsresultat-engangsstonad', EsBehandlingApiKeys.BEREGNINGRESULTAT_ENGANGSSTONAD)
  .withRel('familiehendelse-v2', EsBehandlingApiKeys.FAMILIEHENDELSE)
  .withRel('soknad', EsBehandlingApiKeys.SOKNAD)
  .withRel('soknad-original-behandling', EsBehandlingApiKeys.SOKNAD_ORIGINAL_BEHANDLING)
  .withRel('familiehendelse-original-behandling', EsBehandlingApiKeys.FAMILIEHENDELSE_ORIGINAL_BEHANDLING)
  .withRel('beregningsresultat-engangsstonad-original-behandling', EsBehandlingApiKeys.BEREGNINGSRESULTAT_ORIGINAL_BEHANDLING)
  .withRel('soeker-medlemskap', EsBehandlingApiKeys.MEDLEMSKAP)
  .withRel('soeker-medlemskap-v2', EsBehandlingApiKeys.MEDLEMSKAP_V2)
  .withRel('inntekt-arbeid-ytelse', EsBehandlingApiKeys.INNTEKT_ARBEID_YTELSE)
  .withRel('soeker-verge', EsBehandlingApiKeys.VERGE)
  .withRel('sendt-varsel-om-revurdering', EsBehandlingApiKeys.SEND_VARSEL_OM_REVURDERING)

  // operasjoner
  .withRel('bytt-behandlende-enhet', EsBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withRel('henlegg-behandling', EsBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withRel('gjenoppta-behandling', EsBehandlingApiKeys.RESUME_BEHANDLING, { saveResponseIn: EsBehandlingApiKeys.BEHANDLING_ES })
  .withRel('sett-behandling-pa-vent', EsBehandlingApiKeys.BEHANDLING_ON_HOLD)
  .withRel('endre-pa-vent', EsBehandlingApiKeys.UPDATE_ON_HOLD)
  .withRel('opne-for-endringer', EsBehandlingApiKeys.OPEN_BEHANDLING_FOR_CHANGES, { saveResponseIn: EsBehandlingApiKeys.BEHANDLING_ES })
  .withRel('lagre-aksjonspunkter', EsBehandlingApiKeys.SAVE_AKSJONSPUNKT, { saveResponseIn: EsBehandlingApiKeys.BEHANDLING_ES })
  .withRel('lagre-overstyr-aksjonspunkter', EsBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT, { saveResponseIn: EsBehandlingApiKeys.BEHANDLING_ES })
  .withRel('opprett-verge', EsBehandlingApiKeys.VERGE_OPPRETT, { saveResponseIn: EsBehandlingApiKeys.BEHANDLING_ES })
  .withRel('fjern-verge', EsBehandlingApiKeys.VERGE_FJERN, { saveResponseIn: EsBehandlingApiKeys.BEHANDLING_ES })

  /* FPTILBAKE */
  .withPostAndOpenBlob('/fptilbake/api/dokument/forhandsvis-varselbrev', EsBehandlingApiKeys.PREVIEW_TILBAKEKREVING_MESSAGE)

  /* FPFORMIDLING */
  .withPostAndOpenBlob('/fpformidling/api/brev/forhaandsvis', EsBehandlingApiKeys.PREVIEW_MESSAGE)

  .build();

const reducerName = 'dataContextESBehandling';

export const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withReduxEvents(new ReduxEvents()
    .withErrorActionCreator(errorHandler.getErrorActionCreator())
    .withPollingMessageActionCreator(setRequestPollingMessage))
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const esBehandlingApi = reduxRestApi.getEndpointApi();
export default esBehandlingApi;
