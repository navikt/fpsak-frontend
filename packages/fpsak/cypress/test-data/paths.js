const environment = require('./environment');
console.log(environment);
const TESTHUB_BASE = Cypress.env('TESTHUB_BASE');
module.exports = {
  TESTHUB_SOK_PERSON: `${TESTHUB_BASE}/person/sokperson`,
  TESTHUB_GETCONFIG: `${TESTHUB_BASE}/envconfig/getconfig/${environment.NAME}`,
  TESTHUB_SEND_INNTEKTSMELDING: `${TESTHUB_BASE}/testdata/journalforInntektsmelding/${environment.NAME}/live/true`,
  TESTHUB_OPPRETT_ARBEIDSFORHOLD: `${TESTHUB_BASE}/eksterne/opprettArbeidsforholdErketype/${environment.NAME}/true`,
  TESTHUB_SEND_FORELDREPENGESOKNAD: `${TESTHUB_BASE}/foreldrepengesoknad/sendviafordeling/${environment.NAME}`,
  FPSAK_ALLE_BEHANDLINGER: '/fpsak/api/behandlinger/alle?saksnummer=',
};
