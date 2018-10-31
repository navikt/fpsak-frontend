const paths = require('../test-data/paths');
const template = require('../test-data/aksjonspunkt/5001');

Cypress.Commands.add('oppfyllAksjonspunkt5001', (soker) => {
  template.saksnummer = soker.fagsak.id;
  template.behandlingId = soker.behandling.id;
  template.behandlingVersjon = soker.behandling.versjon;
  template.bekreftedeAksjonspunktDtoer[0].utstedtdato = soker.soknad.termin.utstedtdato.substr(0, 10);
  template.bekreftedeAksjonspunktDtoer[0].termindato = soker.soknad.termin.termindato.substr(0, 10);
  return cy.request({
    url: paths.FPSAK_LAGRE_AKSJONSPUNKT,
    method: 'POST',
    body: template,
  });
});
