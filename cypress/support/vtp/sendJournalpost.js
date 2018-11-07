const req = require('../../helpers/journalpostRequest');

Cypress.Commands.add('journalforSoknad', (soker) => {
  cy.request(req(
    soker.soknadXML,
    soker.soknadJournalpostId,
    'ab0047',
    'I000003',
    'SOK',
    soker.fagsak.saksnummer,
  ))
    .then((resp) => {
      soker.fagsak = resp.body;
      console.log('Opprettet journalpost i FPSAK.', resp.body);
      return soker;
    });
});
