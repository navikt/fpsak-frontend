const paths = require('../test-data/paths');

Cypress.Commands.add('pollFagsak', soker => cy.request({
  url: paths.FPSAK_FAGSAK_SOK,
  method: 'POST',
  headers: {
    Accept: 'application/json',
  },
  body: {
    searchString: soker.soknad.fnr,
  },
})
  .then((resp) => {
    if (resp.body.length > 0) {
      soker.fagsak = resp.body[0];
      console.log('Done polling Fagsak', soker.fagsak);
      return soker;
    }
    cy.wait(1000);
    return cy.pollFagsak(soker);
  }));
