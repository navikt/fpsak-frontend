const paths = require('../test-data/paths');

Cypress.Commands.add('sendHovedsoknad', state => cy.request({
  url: paths.TESTHUB_SEND_FORELDREPENGESOKNAD,
  method: 'POST',
  body: state.hovedsoknad,
})
  .then((res) => {
    console.log(`Done sendHovedsoknad: (${state.hovedsoknad.fnr})`, res.body);
    return state;
  }));
