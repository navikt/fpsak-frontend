const paths = require('../test-data/paths');

Cypress.Commands.add('sendSoknadViaTesthub', state => cy.request({
  url: paths.TESTHUB_SEND_FORELDREPENGESOKNAD,
  method: 'POST',
  body: state.soknad,
})
  .then((res) => {
    console.log(`Done sendSoknadViaTesthub: (${state.soknad.fnr})`, res.body);
    return state;
  }));
