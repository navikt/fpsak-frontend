const paths = require('../../test-data/paths');
const opprettArbeidsforholdRequest = require('../../test-data/opprettArbeidsforholdErketype/enkel');

Cypress.Commands.add('sikkerstillArbeidsforholdViaTesthub', (soker) => {
  const fodselsnummer = soker.person.ident;
  return cy.request({
    url: paths.TESTHUB_HENT_ARBEIDESFORHOLD.replace('{fnr}', fodselsnummer),
    method: 'GET',
  })
    .then((res) => {
      soker.arbeidsforhold = res.body.find(a => a.fnr !== null);
      if (!soker.arbeidsforhold) {
        opprettArbeidsforholdRequest.fnr = fodselsnummer;
        return cy.request({
          url: paths.TESTHUB_OPPRETT_ARBEIDSFORHOLD,
          method: 'POST',
          body: opprettArbeidsforholdRequest,
        })
          .then(() => {
            console.log('Arbeidsforhold opprettet: ', opprettArbeidsforholdRequest);
            return cy.sikkerstillArbeidsforholdViaTesthub(soker);
          });
      }
      console.log('Arbeidsforhold eksisterer: ', soker.arbeidsforhold);
      return soker;
    });
});
