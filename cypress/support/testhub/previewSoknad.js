const paths = require('../../test-data/paths');

Cypress.Commands.add('hentSoknadsXML', (soker) => {
  soker.soknad.fnr = soker.person.ident;
  cy.request({
    url: paths.TESTHUB_PREVIEW_FORELDREPENGESOKNAD,
    method: 'POST',
    body: soker.soknad,
  })
    .then((res) => {
      console.log(`Fikk lagd en XML søknad`);
      soker.soknadXML = res.body;
      return soker;
    });
});
