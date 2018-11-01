const paths = require('../test-data/paths');

Cypress.Commands.add('fagsakOpprett', soker => cy.request({
  url: paths.FPSAK_OPPRETT_FAGSAK,
  method: 'POST',
  headers: {
    Accept: 'application/json',
  },
  body: {

  };
})
  .then((resp) => {
    soker.behandling = resp.body;
    console.log('Ferdig med å oppdatere behandling', soker.behandling);
    return soker;
  }));
