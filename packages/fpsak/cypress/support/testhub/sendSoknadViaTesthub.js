const paths = require('../../test-data/paths');

Cypress.Commands.add('sendSoknadViaTesthub', soker => cy.request({
  url: paths.TESTHUB_SEND_FORELDREPENGESOKNAD,
  method: 'POST',
  body: soker.soknad,
})
  .then((res) => {
    console.log(`Done sendHovedsoknad: (${soker.soknad.fnr})`, res.body);
    return soker;
  }));
