const paths = require('../test-data/paths');
const opprettArbeidsforholdRequest = require('../test-data/opprettArbeidsforholdErketype/enkel');

Cypress.Commands.add('sikkerstillAtArbeidsforhold', state => cy.request({
  url: paths.TESTHUB_HENT_ARBEIDESFORHOLD.replace('{fnr}', state.person.fnr),
  method: 'GET',
})
  .then((res) => {
    state.arbeidsforhold = res.body.find(a => a.fnr !== null);
    if (!state.arbeidsforhold) {
      opprettArbeidsforholdRequest.fnr = state.person.fnr;
      return cy.request({
        url: paths.TESTHUB_OPPRETT_ARBEIDSFORHOLD,
        method: 'POST',
        body: opprettArbeidsforholdRequest,
      })
        .then(() => {
          console.log('Arbeidsforhold opprettet: ', opprettArbeidsforholdRequest);
          return cy.sikkerstillAtArbeidsforhold(state);
        });
    }
    console.log('Arbeidsforhold eksisterer: ', state.arbeidsforhold);
    return state;
  }));
