const paths = require('../test-data/paths');

Cypress.Commands.add('oppdaterBehandling', soker => cy.request({
  url: paths.FPSAK_HENT_BEHANDLING + soker.behandling.id,
  method: 'GET',
  headers: {
    Accept: 'application/json',
  },
})
  .then((resp) => {
    soker.behandling = resp.body;
    console.log('Ferdig med å oppdatere behandling', soker.behandling);
    return soker;
  }));
