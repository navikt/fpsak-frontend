const paths = require('../../test-data/paths');

Cypress.Commands.add('vtpJournalforSoknad', (soker, dokumenttypeid) => {
  return cy.request({
    url: paths.VTP_JOURNALFOR_SOKNAD.replace('{fnr}', soker.person.ident)
      .replace('{dokumenttypeid}', dokumenttypeid),
    method: 'POST',
    body: soker.soknadXML,
  })
    .then((res) => {
      console.log('Journalførte søknaden i VTP', res.body);
      soker.soknadJournalpostId = res.body.journalpostId;
      return soker;
    });
});
