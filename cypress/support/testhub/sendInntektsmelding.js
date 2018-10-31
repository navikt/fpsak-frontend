const paths = require('../../test-data/paths');
const inntektsmelding = require('../../test-data/journalforInntektsmelding/enkel');

Cypress.Commands.add('sendInntektsmeldingViaTesthub', (soker) => {
  // henter ut en person
  inntektsmelding.arbeidstakerFNR = soker.person.ident;
  inntektsmelding.arbeidsforholdId = soker.arbeidsforhold.arbeidsforholdId;
  inntektsmelding.startDatoForeldrepengePerioden = soker.soknad.perioder[0].fom;
  inntektsmelding.inntektsmeldingID = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, 5);
  inntektsmelding.organisasjonsnummer = soker.arbeidsforhold.organisasjonNummer;
  soker.inntektsmelding = inntektsmelding;
  return cy.request({
    url: paths.TESTHUB_SEND_INNTEKTSMELDING,
    method: 'POST',
    body: inntektsmelding,
  })
    .then((res) => {
      console.log('Done sendInntektsmeldingViaTesthub: ', res);
      return soker;
    });
});
