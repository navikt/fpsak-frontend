const paths = require('../test-data/paths');

Cypress.Commands.add('pollBehandling', soker => cy.request({
  url: paths.FPSAK_ALLE_BEHANDLINGER + soker.fagsak.saksnummer,
  method: 'GET',
  headers: {
    Accept: 'application/json',
  },
})
  .then((resp) => {
    if (resp.body[0]) {
      soker.behandling = resp.body[0];
      console.log('Done polling Behandling', soker.behandling);
      return soker;
    }
    cy.wait(1000);
    return cy.pollBehandling(soker);
  }));
