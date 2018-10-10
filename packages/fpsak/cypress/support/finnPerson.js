const paths = require('../test-data/paths');

Cypress.Commands.add('finnPerson', state => cy.request({
  url: paths.TESTHUB_SOK_PERSON,
  method: 'POST',
  body: state.personSok,
})
  .then((res) => {
    state.person = res.body;
    state.soknad.fnr = state.person.fnr;
    console.log(`Done finnPerson (${state.person.fnr})`, res.body);
    return state;
  }));
