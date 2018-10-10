const paths = require('../test-data/paths');

Cypress.Commands.add('oppdaterBehandling', state => cy.request({
  url: paths.FPSAK_HENT_BEHANDLING + state.behandling.id,
  method: 'GET',
  headers: {
    Accept: 'application/json',
  },
})
  .then((resp) => {
    state.behandling = resp.body;
    console.log('Ferdig med å oppdatere behandling', state.behandling);
    return state;
  }));
