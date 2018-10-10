const paths = require('../test-data/paths');

Cypress.Commands.add('pollFagsak', state => cy.request({
  url: paths.FPSAK_FAGSAK_SOK,
  method: 'POST',
  headers: {
    Accept: 'application/json',
  },
  body: {
    searchString: state.soknad.fnr,
  },
})
  .then((resp) => {
    if (resp.body.length > 0) {
      state.fagsak = resp.body[0];
      console.log('Done polling Fagsak', state.fagsak);
      return state;
    }
    cy.wait(1000);
    return cy.pollFagsak(state);
  }));
