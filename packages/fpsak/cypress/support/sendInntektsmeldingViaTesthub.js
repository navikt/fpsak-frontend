const paths = require('../test-data/paths');
const inntektsmelding = require('../test-data/journalforInntektsmelding/enkel');

Cypress.Commands.add('sendInntektsmeldingViaTesthub', (state) => {
  // henter ut en person
  inntektsmelding.arbeidstakerFNR = state.arbeidsforhold.fnr;
  inntektsmelding.arbeidsforholdId = state.arbeidsforhold.arbeidsforholdId;
  inntektsmelding.startDatoForeldrepengePerioden = state.soknad.perioder[0].fom;
  inntektsmelding.inntektsmeldingID = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
  inntektsmelding.organisasjonsnummer = state.arbeidsforhold.organisasjonNummer;
  state.inntektsmelding = inntektsmelding;
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
