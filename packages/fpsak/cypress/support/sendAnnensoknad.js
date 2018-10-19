const paths = require('../test-data/paths');

Cypress.Commands.add('sendAnnensoknad', state => cy.request({
  url: paths.TESTHUB_SEND_FORELDREPENGESOKNAD,
  method: 'POST',
  body: state.annensoknad,
})
  .then((res) => {
    console.log(`Done sendAnnensoknad: (${state.annensoknad.fnr})`, res.body);
    return state;
  }));
