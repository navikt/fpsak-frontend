const paths = require('../../test-data/paths');
const inntektsmeldingTpl = require('../../test-data/inntektsmelding');
Cypress.Commands.add('previewInntektsmelding', (soker) => {
  console.log(soker);
  soker.inntektsmelding = inntektsmeldingTpl(
    'enkel',
    soker.person.ident,
    soker.arbeidsforhold[0].arbeidsforholdId,
    soker.soknad.perioder[0].fom,
    soker.arbeidsforhold[0].arbeidsgiverOrgnr,
  );
  cy.request({
    url: paths.TESTHUB_PREVIEW_INNTEKTSMELDING,
    method: 'POST',
    body: soker.inntektsmelding,
  })
    .then((res) => {
      console.log(`Fikk lagd en XML inntektsmelding.`);
      soker.inntektsMeldingXML = res.body;
      return soker;
    });
});
