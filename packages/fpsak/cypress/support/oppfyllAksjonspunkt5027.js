const paths = require('../test-data/paths');
const template = require('../test-data/aksjonspunkt/5027');

Cypress.Commands.add('oppfyllAksjonspunkt5027', (state) => {
  template.behandlingId = state.behandling.id;
  template.behandlingVersjon = state.behandling.versjon;
  template.bekreftedeAksjonspunktDtoer[0].fodselsdato = state.hovedsoknad.foedsel.foedselsdato;
  template.bekreftedeAksjonspunktDtoer[0].antallBarnFodt = state.hovedsoknad.antallBarn;
  return cy.request({
    url: paths.FPSAK_LAGRE_AKSJONSPUNKT,
    method: 'POST',
    body: template,
  });
});
