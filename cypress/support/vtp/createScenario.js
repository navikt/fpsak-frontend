const paths = require('../../test-data/paths');

Cypress.Commands.add('vtpCreateScenario', (state, scenarioKey) => {
  return cy.request({
    url: paths.VTP_CREATE_SCENARIO.replace('{key}', scenarioKey),
    method: 'POST',
  })
    .then((res) => {
      state.scenario = res.body;
      state.hovedsoker.person = {
        ident: state.scenario.personopplysninger.søkerIdent,
        aktørId: state.scenario.personopplysninger.søkerAktørIdent,
      };
      state.hovedsoker.arbeidsforhold = state.scenario.scenariodata.aareg.arbeidsforhold;
      if (state.scenario.personopplysninger.annenpartIdent) {
        state.annensoker.person = {
          ident: state.scenario.personopplysninger.annenpartIdent,
        };
      }
      console.log(state);
      return state;
    });
});
