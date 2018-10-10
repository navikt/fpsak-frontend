const paths = require('../test-data/paths');

Cypress.Commands.add('pollBehandling', state => cy.request({
  url: paths.FPSAK_ALLE_BEHANDLINGER + state.fagsak.saksnummer,
  method: 'GET',
  headers: {
    Accept: 'application/json',
  },
})
  .then((resp) => {
    if (resp.body[0]) {
      state.behandling = resp.body[0];
      console.log('Done polling Behandling', state.behandling);
      return state;
    }
    cy.wait(1000);
    return cy.pollBehandling(state);
  }));
