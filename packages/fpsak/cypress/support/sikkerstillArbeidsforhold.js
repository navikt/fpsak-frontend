const paths = require('../test-data/paths');
const opprettArbeidsforholdRequest = require('../test-data/opprettArbeidsforholdErketype/enkel');

Cypress.Commands.add('sikkerstillArbeidsforhold', (state, fodselsnummer) => cy.request({
  url: paths.TESTHUB_HENT_ARBEIDESFORHOLD.replace('{fnr}', fodselsnummer),
  method: 'GET',
})
  .then((res) => {
    state.arbeidsforhold = state.arbeidsforhold || {};
    state.arbeidsforhold[fodselsnummer] = res.body.find(a => a.fnr !== null);
    if (!state.arbeidsforhold[fodselsnummer]) {
      opprettArbeidsforholdRequest.fnr = fodselsnummer;
      return cy.request({
        url: paths.TESTHUB_OPPRETT_ARBEIDSFORHOLD,
        method: 'POST',
        body: opprettArbeidsforholdRequest,
      })
        .then(() => {
          console.log('Arbeidsforhold opprettet: ', opprettArbeidsforholdRequest);
          return cy.sikkerstillArbeidsforhold(state, fodselsnummer);
        });
    }
    console.log('Arbeidsforhold eksisterer: ', state.arbeidsforhold[fodselsnummer]);
    return state;
  }));
