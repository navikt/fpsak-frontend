const paths = require('../test-data/paths');
const inntektsmelding = require('../test-data/journalforInntektsmelding/enkel');

Cypress.Commands.add('sendInntektsmelding', (state, fodselsnummer) => {
  // henter ut en person
  state.inntektsmelding = state.inntektsmelding || {};
  inntektsmelding.arbeidstakerFNR = fodselsnummer;
  inntektsmelding.arbeidsforholdId = state.arbeidsforhold[fodselsnummer].arbeidsforholdId;
  inntektsmelding.startDatoForeldrepengePerioden = state.hovedsoknad.perioder[0].fom;
  inntektsmelding.inntektsmeldingID = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, 5);
  inntektsmelding.organisasjonsnummer = state.arbeidsforhold[fodselsnummer].organisasjonNummer;
  state.inntektsmelding[fodselsnummer] = inntektsmelding;
  return cy.request({
    url: paths.TESTHUB_SEND_INNTEKTSMELDING,
    method: 'POST',
    body: inntektsmelding,
  })
    .then((res) => {
      console.log('Done sendInntektsmeldingViaTesthub: ', res);
      return state;
    });
});
