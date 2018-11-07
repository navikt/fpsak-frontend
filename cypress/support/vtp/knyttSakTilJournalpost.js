const paths = require('../../test-data/paths');

Cypress.Commands.add('vtpKnyttSakTilJournalpost', (soker) => {
  const journalpostid = soker.soknadJournalpostId;
  const saksnummer = soker.fagsak.saksnummer;

  return cy.request({
    url: paths.VTP_KNYTT_SAK_TIL_JOURNALPOST.replace('{journalpostid}', journalpostid)
      .replace('{saksnummer}', saksnummer),
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  })
    .then((res) => {
      console.log('Knyttet fagsak til journalpost i VTP', res.body);
      return cy.request({
        url: paths.FPSAK_KNYTT_SAK_TIL_JOURNALPOST,
        method: 'POST',
        body: {
          saksnummerDto: {
            saksnummer: saksnummer,
          },
          journalpostIdDto: {
            journalpostId: journalpostid,
          },
        },
      })
        .then(res => {
          console.log('Knyttet fagsak til journalpost i FPSAK', res.body);
        });
    });
});
