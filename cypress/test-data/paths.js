const environment = require('./environment');

const TESTHUB_BASE = Cypress.env('TESTHUB_BASE');
const VTP_BASE = Cypress.env('VTP_BASE');
module.exports = {
  FPSAK_ALLE_BEHANDLINGER: '/fpsak/api/behandlinger/alle?saksnummer=',
  FPSAK_FAGSAK_SOK: '/fpsak/api/fagsak/sok',
  FPSAK_LOGIN: '/fpsak/jetty/login',
  FPSAK_HENT_AKSJONSPUNKTER: '/fpsak/api/behandling/aksjonspunkt?behandlingId=',
  FPSAK_HENT_BEHANDLING: '/fpsak/api/behandlinger?behandlingId=',
  FPSAK_LAGRE_AKSJONSPUNKT: '/fpsak/api/behandling/aksjonspunkt',
  FPSAK_OPPRETT_FAGSAK: '/fpsak/api/fordel/fagsak/opprett',
  FPSAK_KNYTT_SAK_TIL_JOURNALPOST: '/fpsak/api/fordel/fagsak/knyttJournalpost',
  FPSAK_JOURNALPOST: '/fpsak/api/fordel/journalpost',
  TESTHUB_GETCONFIG: `${TESTHUB_BASE}/envconfig/getconfig/${environment.NAME}`,
  TESTHUB_HENT_ARBEIDESFORHOLD: `${TESTHUB_BASE}/arbeidsforhold/hent/{fnr}/${environment.NAME}`,
  TESTHUB_INVALIDER_ARBEIDSFORHOLD: `${TESTHUB_BASE}/eksterne/invaliderarbeidsforhold?env=${environment.NAME}&fnr={fnr}`,
  TESTHUB_OPPRETT_ARBEIDSFORHOLD: `${TESTHUB_BASE}/eksterne/opprettArbeidsforholdErketype/${environment.NAME}/true`,
  TESTHUB_PREVIEW_FORELDREPENGESOKNAD: `${TESTHUB_BASE}/foreldrepengesoknad/forhandsvisxml`,
  TESTHUB_PREVIEW_INNTEKTSMELDING: `${TESTHUB_BASE}/testdata/journalforInntektsmelding/${environment.NAME}/live/false`,
  TESTHUB_SEND_FORELDREPENGESOKNAD: `${TESTHUB_BASE}/foreldrepengesoknad/sendviafordeling/${environment.NAME}`,
  TESTHUB_SEND_INNTEKTSMELDING: `${TESTHUB_BASE}/testdata/journalforInntektsmelding/${environment.NAME}/live/true`,
  TESTHUB_SOK_PERSON: `${TESTHUB_BASE}/person/sokperson`,
  VTP_CREATE_SCENARIO: `${VTP_BASE}/api/testscenario/{key}`,
  VTP_JOURNALFOR_SOKNAD: `${VTP_BASE}/api/journalforing/foreldrepengesoknadxml/fnr/{fnr}/dokumenttypeid/{dokumenttypeid}`,
  VTP_KNYTT_SAK_TIL_JOURNALPOST: `${VTP_BASE}/api/journalforing/knyttsaktiljournalpost/journalpostid/{journalpostid}/saksnummer/{saksnummer}`,
};
