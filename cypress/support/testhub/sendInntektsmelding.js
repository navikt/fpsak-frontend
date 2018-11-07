const paths = require('../../test-data/paths');
const inntektsmeldingTpl = require('../../test-data/inntektsmelding');
Cypress.Commands.add('sendInntektsmeldingViaTesthub', (soker) => {
  soker.inntektsmelding = inntektsmeldingTpl(
    'enkel',
    soker.person.ident,
    soker.arbeidsforhold.arbeidsforholdId,
    soker.soknad.perioder[0].fom,
    soker.arbeidsforhold.organisasjonNummer,
  );
  return cy.request({
    url: paths.TESTHUB_SEND_INNTEKTSMELDING,
    method: 'POST',
    body: soker.inntektsmelding,
  })
    .then((res) => {
      console.log('Done sendInntektsmeldingViaTesthub: ', res);
      return soker;
    });
});
