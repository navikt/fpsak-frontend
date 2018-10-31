const paths = require('../../test-data/paths');

/**
 * Dette styres via scenarioene.
 */
Cypress.Commands.add('finnAnnenforelderViaTesthub', state => cy.request({
  url: paths.TESTHUB_SOK_PERSON,
  method: 'POST',
  body: state.annenforelderSok,
})
  .then((res) => {
    state.annenforelder = res.body;
    state.annenforelder.fnr = state.annenforelder.fnr;
    console.log(`Done finnPerson (${state.annenforelder.fnr})`, res.body);
    return state;
  }));
