const path = require('path');
const filePaths = require('../test-data/filePaths');
Cypress.Commands.add('hentDollyPerson', (soker, bestillingFilenavn) => {
  const bestillingFilePath = path.join(__dirname, '..', 'test-data/test-identer', bestillingFilenavn);
  let usedIdents = [];
  return cy.readFile(filePaths.CONSUMED_IDENTS)
    .then((str) => {
      usedIdents = str ? str : [];
    })
    .readFile(bestillingFilePath)
    .then((bestilling) => {
      soker.person = bestilling.personStatus.find(personStatus => !usedIdents.includes(personStatus.ident));
      soker.soknad.fnr = soker.person.ident;
      return soker
    });
});
