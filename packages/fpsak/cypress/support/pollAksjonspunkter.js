const paths = require('../test-data/paths');

Cypress.Commands.add('pollAksjonspunkter', soker => cy.request({
  url: paths.FPSAK_HENT_AKSJONSPUNKTER + soker.behandling.id,
  method: 'GET',
  headers: {
    Accept: 'application/json',
  },
})
  .then((resp) => {
    const ap5027 = resp.body.find(ap => ap.definisjon.kode === '5027');
    if (ap5027) {
      console.log('Done polling Aksjonspunkt5027', ap5027);
      return cy.oppdaterBehandling(soker).oppfyllAksjonspunkt5027(soker);
    }
    cy.wait(1000);
    return cy.pollAksjonspunkter(soker);
  }));
