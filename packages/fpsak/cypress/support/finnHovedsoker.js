const paths = require('../test-data/paths');

Cypress.Commands.add('finnHovedsoker', state => cy.request({
  url: paths.TESTHUB_SOK_PERSON,
  method: 'POST',
  body: state.hovedsokerSok,
})
  .then((res) => {
    state.hovedsoker = res.body;
    state.hovedsoknad.fnr = state.hovedsoker.fnr;
    console.log(`Done finnPerson (${state.hovedsoker.fnr})`, res.body);
    return state;
  }));
