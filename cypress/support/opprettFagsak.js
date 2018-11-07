const paths = require('../test-data/paths');

Cypress.Commands.add('opprettFagsak', (soker, behandlingstemaOffisiellKode) => {

  cy.request({
    url: paths.FPSAK_OPPRETT_FAGSAK,
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: {
      journalpostId: soker.soknadJournalpostId,
      behandlingstemaOffisiellKode: behandlingstemaOffisiellKode,
      aktørId: soker.person.aktørId,
    },
  })
    .then((resp) => {
      soker.fagsak = resp.body;
      console.log('Opprettet fagsak', resp.body);
      return soker;
    });
});
