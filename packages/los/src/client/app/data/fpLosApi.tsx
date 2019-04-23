import {
  RestApiConfigBuilder, ReduxRestApi, ReduxRestApiBuilder, ReduxEvents,
} from './rest-api-redux/index';
import errorHandler from './error-api-redux';

const fpLosApiKeys = {
  LANGUAGE_FILE: 'LANGUAGE_FILE',
  KODEVERK: 'KODEVERK',
  NAV_ANSATT: 'NAV_ANSATT',
  SEARCH_FAGSAK: 'SEARCH_FAGSAK',
  BEHANDLEDE_OPPGAVER: 'BEHANDLEDE_OPPGAVER',
  FPSAK_URL: 'FPSAK_URL',
  FEATURE_TOGGLES: 'FEATURE_TOGGLES',
  SAKSLISTE: 'SAKSLISTE',
  RESERVER_OPPGAVE: 'RESERVER_OPPGAVE',
  HENT_RESERVASJONSSTATUS: 'HENT_RESERVASJONSSTATUS',
  OPPGAVER_TIL_BEHANDLING: 'OPPGAVER_TIL_BEHANDLING',
  RESERVERTE_OPPGAVER: 'RESERVERTE_OPPGAVER',
  OPPHEV_OPPGAVERESERVASJON: 'OPPHEV_OPPGAVERESERVASJON',
  FORLENG_OPPGAVERESERVASJON: 'FORLENG_OPPGAVERESERVASJON',
  SAKSLISTER_FOR_AVDELING: 'SAKSLISTER_FOR_AVDELING',
  OPPRETT_NY_SAKSLISTE: 'OPPRETT_NY_SAKSLISTE',
  SLETT_SAKSLISTE: 'SLETT_SAKSLISTE',
  LAGRE_SAKSLISTE_NAVN: 'LAGRE_SAKSLISTE_NAVN',
  LAGRE_SAKSLISTE_BEHANDLINGSTYPE: 'LAGRE_SAKSLISTE_BEHANDLINGSTYPE',
  LAGRE_SAKSLISTE_FAGSAK_YTELSE_TYPE: 'LAGRE_SAKSLISTE_FAGSAK_YTELSE_TYPE',
  LAGRE_SAKSLISTE_ANDRE_KRITERIER: 'LAGRE_SAKSLISTE_ANDRE_KRITERIER',
  LAGRE_SAKSLISTE_SORTERING: 'LAGRE_SAKSLISTE_SORTERING',
  LAGRE_SAKSLISTE_SORTERING_DYNAMISK_PERIDE: 'LAGRE_SAKSLISTE_SORTERING_DYNAMISK_PERIDE',
  LAGRE_SAKSLISTE_SORTERING_TIDSINTERVALL_DAGER: 'LAGRE_SAKSLISTE_SORTERING_TIDSINTERVALL_DAGER',
  LAGRE_SAKSLISTE_SORTERING_TIDSINTERVALL_DATO: 'LAGRE_SAKSLISTE_SORTERING_TIDSINTERVALL_DATO',
  SAKSBEHANDLER_SOK: 'SAKSBEHANDLER_SOK',
  SAKSBEHANDLERE_FOR_AVDELING: 'SAKSBEHANDLERE_FOR_AVDELING',
  OPPRETT_NY_SAKSBEHANDLER: 'OPPRETT_NY_SAKSBEHANDLER',
  SLETT_SAKSBEHANDLER: 'SLETT_SAKSBEHANDLER',
  LAGRE_SAKSLISTE_SAKSBEHANDLER: 'LAGRE_SAKSLISTE_SAKSBEHANDLER',
  HENT_OPPGAVER_FOR_AVDELING: 'HENT_OPPGAVER_FOR_AVDELING',
  HENT_OPPGAVER_PER_DATO: 'HENT_OPPGAVER_PER_DATO',
  HENT_OPPGAVER_PER_FORSTE_STONADSDAG: 'HENT_OPPGAVER_PER_FORSTE_STONADSDAG',
  HENT_OPPGAVER_MANUELT_PA_VENT: 'HENT_OPPGAVER_MANUELT_PA_VENT',
  AVDELINGER: 'AVDELINGER',
  OPPGAVE_ANTALL: 'OPPGAVE_ANTALL',
  OPPGAVER_FOR_FAGSAKER: 'OPPGAVER_FOR_FAGSAKER',
  FLYTT_RESERVASJON_SAKSBEHANDLER_SOK: 'FLYTT_RESERVASJON_SAKSBEHANDLER_SOK',
  FLYTT_RESERVASJON: 'FLYTT_RESERVASJON',
  SAKSLISTE_SAKSBEHANDLERE: 'SAKSLISTE_SAKSBEHANDLERE',
  BEHANDLINGSKO_OPPGAVE_ANTALL: 'BEHANDLINGSKO_OPPGAVE_ANTALL',
  HENT_NYE_OG_FERDIGSTILTE_OPPGAVER: 'HENT_NYE_OG_FERDIGSTILTE_OPPGAVER',
};

const endpoints = new RestApiConfigBuilder()
  /* /api/fagsak */
  .withPost('/api/fagsak/sok', fpLosApiKeys.SEARCH_FAGSAK)

  /* /api/saksbehandler */
  .withGet('/api/saksbehandler', fpLosApiKeys.NAV_ANSATT)

  /* /api/saksbehandler/saksliste */
  .withGet('/api/saksbehandler/saksliste', fpLosApiKeys.SAKSLISTE)
  .withGet('/api/saksbehandler/saksliste/saksbehandlere', fpLosApiKeys.SAKSLISTE_SAKSBEHANDLERE)

  /* /api/saksbehandler/oppgave */
  .withAsyncGet('/api/saksbehandler/oppgaver', fpLosApiKeys.OPPGAVER_TIL_BEHANDLING, { maxPollingLimit: 1800 })
  .withGet('/api/saksbehandler/oppgaver/reserverte', fpLosApiKeys.RESERVERTE_OPPGAVER)
  .withPost('/api/saksbehandler/oppgaver/reserver', fpLosApiKeys.RESERVER_OPPGAVE)
  .withGet('/api/saksbehandler/oppgaver/reservasjon-status', fpLosApiKeys.HENT_RESERVASJONSSTATUS)
  .withPost('/api/saksbehandler/oppgaver/opphev', fpLosApiKeys.OPPHEV_OPPGAVERESERVASJON)
  .withPost('/api/saksbehandler/oppgaver/forleng', fpLosApiKeys.FORLENG_OPPGAVERESERVASJON)
  .withGet('/api/saksbehandler/oppgaver/behandlede', fpLosApiKeys.BEHANDLEDE_OPPGAVER)
  .withPost('/api/saksbehandler/oppgaver/flytt/sok', fpLosApiKeys.FLYTT_RESERVASJON_SAKSBEHANDLER_SOK)
  .withPost('/api/saksbehandler/oppgaver/flytt', fpLosApiKeys.FLYTT_RESERVASJON)
  .withGet('/api/saksbehandler/oppgaver/antall', fpLosApiKeys.BEHANDLINGSKO_OPPGAVE_ANTALL)
  .withGet('/api/saksbehandler/oppgaver/oppgaver-for-fagsaker', fpLosApiKeys.OPPGAVER_FOR_FAGSAKER)

  /* /api/saksbehandler/nokkeltall */
  .withGet('/api/saksbehandler/nokkeltall/nye-og-ferdigstilte-oppgaver', fpLosApiKeys.HENT_NYE_OG_FERDIGSTILTE_OPPGAVER)

  /* /api/avdelingsleder/avdelinger */
  .withGet('/api/avdelingsleder/avdelinger', fpLosApiKeys.AVDELINGER)

  /* /api/avdelingsleder/sakslister */
  .withGet('/api/avdelingsleder/sakslister', fpLosApiKeys.SAKSLISTER_FOR_AVDELING)
  .withPost('/api/avdelingsleder/sakslister', fpLosApiKeys.OPPRETT_NY_SAKSLISTE)
  .withPost('/api/avdelingsleder/sakslister/slett', fpLosApiKeys.SLETT_SAKSLISTE)
  .withPost('/api/avdelingsleder/sakslister/navn', fpLosApiKeys.LAGRE_SAKSLISTE_NAVN)
  .withPost('/api/avdelingsleder/sakslister/behandlingstype', fpLosApiKeys.LAGRE_SAKSLISTE_BEHANDLINGSTYPE)
  .withPost('/api/avdelingsleder/sakslister/ytelsetype', fpLosApiKeys.LAGRE_SAKSLISTE_FAGSAK_YTELSE_TYPE)
  .withPost('/api/avdelingsleder/sakslister/andre-kriterier', fpLosApiKeys.LAGRE_SAKSLISTE_ANDRE_KRITERIER)
  .withPost('/api/avdelingsleder/sakslister/sortering', fpLosApiKeys.LAGRE_SAKSLISTE_SORTERING)
  .withPost('/api/avdelingsleder/sakslister/sortering-tidsintervall-type', fpLosApiKeys.LAGRE_SAKSLISTE_SORTERING_DYNAMISK_PERIDE)
  .withPost('/api/avdelingsleder/sakslister/sortering-tidsintervall-dager', fpLosApiKeys.LAGRE_SAKSLISTE_SORTERING_TIDSINTERVALL_DAGER)
  .withPost('/api/avdelingsleder/sakslister/sortering-tidsintervall-dato', fpLosApiKeys.LAGRE_SAKSLISTE_SORTERING_TIDSINTERVALL_DATO)
  .withPost('/api/avdelingsleder/sakslister/saksbehandler', fpLosApiKeys.LAGRE_SAKSLISTE_SAKSBEHANDLER)

  /* /api/avdelingsleder/saksbehandlere */
  .withPost('/api/avdelingsleder/saksbehandlere/sok', fpLosApiKeys.SAKSBEHANDLER_SOK)
  .withGet('/api/avdelingsleder/saksbehandlere', fpLosApiKeys.SAKSBEHANDLERE_FOR_AVDELING)
  .withPost('/api/avdelingsleder/saksbehandlere', fpLosApiKeys.OPPRETT_NY_SAKSBEHANDLER)
  .withPost('/api/avdelingsleder/saksbehandlere/slett', fpLosApiKeys.SLETT_SAKSBEHANDLER)

  /* /api/avdelingsleder/oppgaver */
  .withGet('/api/avdelingsleder/oppgaver/antall', fpLosApiKeys.OPPGAVE_ANTALL)

  /* /api/avdelingsleder/nokkeltall */
  .withGet('/api/avdelingsleder/nokkeltall/behandlinger-under-arbeid', fpLosApiKeys.HENT_OPPGAVER_FOR_AVDELING)
  .withGet('/api/avdelingsleder/nokkeltall/behandlinger-under-arbeid-historikk', fpLosApiKeys.HENT_OPPGAVER_PER_DATO)
  .withGet('/api/avdelingsleder/nokkeltall/behandlinger-manuelt-vent-historikk', fpLosApiKeys.HENT_OPPGAVER_MANUELT_PA_VENT)
  .withGet('/api/avdelingsleder/nokkeltall/behandlinger-forste-stonadsdag', fpLosApiKeys.HENT_OPPGAVER_PER_FORSTE_STONADSDAG)

  /* /api/konfig */
  .withGet('/api/konfig/fpsak-url', fpLosApiKeys.FPSAK_URL)
  .withGet('/api/konfig/feature-toggles', fpLosApiKeys.FEATURE_TOGGLES)

  /* /api/kodeverk */
  .withGet('/api/kodeverk', fpLosApiKeys.KODEVERK)

  /* /sprak */
  .withGet('/sprak/nb_NO.json', fpLosApiKeys.LANGUAGE_FILE)
  .build();

export const reduxRestApi: ReduxRestApi = new ReduxRestApiBuilder(endpoints, 'dataContext')
  .withContextPath('fplos')
  .withReduxEvents(new ReduxEvents()
    .withErrorActionCreator(errorHandler.getErrorActionCreator()))
  .build();

const fpLosApi = reduxRestApi.getEndpointApi();
export default fpLosApi;
