const paths = require('../../test-data/paths');

Cypress.Commands.add('previewSoknad', (soker) => {
  soker.soknad.fnr = soker.person.ident;
  console.log(JSON.stringify(soker.soknad))
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
