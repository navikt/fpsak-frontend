const paths = require('../test-data/paths');
const template = require('../test-data/aksjonspunkt/5027');

Cypress.Commands.add('oppfyllAksjonspunkt5027', (soker) => {
  template.behandlingId = soker.behandling.id;
  template.behandlingVersjon = soker.behandling.versjon;
  template.bekreftedeAksjonspunktDtoer[0].fodselsdato = soker.soknad.foedsel.foedselsdato;
  template.bekreftedeAksjonspunktDtoer[0].antallBarnFodt = soker.soknad.antallBarn;
  return cy.request({
    url: paths.FPSAK_LAGRE_AKSJONSPUNKT,
    method: 'POST',
    body: template,
  });
});
