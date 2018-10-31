const environment = require('./environment');

const TESTHUB_BASE = Cypress.env('TESTHUB_BASE');

module.exports = {
  FPSAK_ALLE_BEHANDLINGER: '/fpsak/api/behandlinger/alle?saksnummer=',
  FPSAK_FAGSAK_SOK: '/fpsak/api/fagsak/sok',
  FPSAK_HENT_AKSJONSPUNKTER: '/fpsak/api/behandling/aksjonspunkt?behandlingId=',
  FPSAK_HENT_BEHANDLING: '/fpsak/api/behandlinger?behandlingId=',
  FPSAK_LAGRE_AKSJONSPUNKT: '/fpsak/api/behandling/aksjonspunkt',
  TESTHUB_GETCONFIG: `${TESTHUB_BASE}/envconfig/getconfig/${environment.NAME}`,
  TESTHUB_HENT_ARBEIDESFORHOLD: `${TESTHUB_BASE}/arbeidsforhold/hent/{fnr}/${environment.NAME}`,
  TESTHUB_INVALIDER_ARBEIDSFORHOLD: `${TESTHUB_BASE}/eksterne/invaliderarbeidsforhold?env=${environment.NAME}&fnr={fnr}`,
  TESTHUB_OPPRETT_ARBEIDSFORHOLD: `${TESTHUB_BASE}/eksterne/opprettArbeidsforholdErketype/${environment.NAME}/true`,
  TESTHUB_PREVIEW_FORELDREPENGESOKNAD: `${TESTHUB_BASE}/foreldrepengesoknad/forhandsvisxml`,
  TESTHUB_PREVIEW_INNTEKTSMELDING: `${TESTHUB_BASE}/testdata/journalforInntektsmelding/${environment.NAME}/live/false`,
  TESTHUB_SEND_FORELDREPENGESOKNAD: `${TESTHUB_BASE}/foreldrepengesoknad/sendviafordeling/${environment.NAME}`,
  TESTHUB_SEND_INNTEKTSMELDING: `${TESTHUB_BASE}/testdata/journalforInntektsmelding/${environment.NAME}/live/true`,
  TESTHUB_SOK_PERSON: `${TESTHUB_BASE}/person/sokperson`,
};
